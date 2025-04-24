import os
import json
from models import NewsItem, Collection, NewsAudio
from user import User
import psycopg2
from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from  dotenv import load_dotenv
import bcrypt

load_dotenv()

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'news.db')

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        port='5432',
        database='zeitgeist',
        user='postgres',
        password='0000'
    )
    conn.autocommit = False
    return conn

def init_db():
    """Инициализирует базу данных и создает таблицы, если их нет"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,  -- Изменено на TEXT для хранения bcrypt хеша
        email TEXT UNIQUE,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Создаем таблицу для новостей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS news_items (
        id SERIAL PRIMARY KEY,
        category TEXT,
        title TEXT NOT NULL,
        author TEXT,
        description TEXT,
        image TEXT,
        featured BOOLEAN DEFAULT FALSE,
        url TEXT,
        date TEXT,
        time TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        views INTEGER DEFAULT 0
    )
    ''')
    
    # Создаем таблицу для коллекций
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS collections (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT
    )
    ''')
    
    # Создаем таблицу для связи коллекций и новостей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS collection_news (
        collection_id INTEGER,
        news_id INTEGER,
        PRIMARY KEY (collection_id, news_id),
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
        FOREIGN KEY (news_id) REFERENCES news_items(id) ON DELETE CASCADE
    )
    ''')
    
    # Создаем таблицу для аудионовостей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS news_audio (
        id SERIAL PRIMARY KEY,
        category TEXT,
        title TEXT NOT NULL,
        description TEXT,
        audio_url TEXT,
        date TEXT,
        duration INTEGER
    )
    ''')
    
    # Создаем таблицу для комментариев
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        news_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (news_id) REFERENCES news_items(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    ''')
    
    conn.commit()
    conn.close()
    
    # Проверяем, есть ли данные в таблице news_items
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM news_items")
    count = cursor.fetchone()[0]
    conn.close()
    
    return count == 0

# Функция для хеширования пароля
def hash_password(password):
    """Хеширует пароль с использованием bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')  # Возвращаем хеш в виде строки для хранения в TEXT

# Функция для проверки пароля
def verify_password(stored_password, provided_password):
    """Проверяет пароль с использованием bcrypt"""
    try:
        return bcrypt.checkpw(
            provided_password.encode('utf-8'),
            stored_password.encode('utf-8')
        )
    except Exception as e:
        print(f"Ошибка проверки пароля: {e}")
        return False

# --------- User методы ---------

def get_user_by_username(username):
    """Получает пользователя по имени пользователя"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return User.from_dict(dict(user))
    return None

def get_user_by_id(user_id):
    """Получает пользователя по ID"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return User.from_dict(dict(user))
    return None

def add_user(user, password):
    """Добавляет нового пользователя в базу данных"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Хешируем пароль на уровне базы данных
    password_hash = hash_password(password)  # Используем функцию hash_password из database.py
    
    try:
        cursor.execute('''
        INSERT INTO users (username, password_hash, email, role)
        VALUES (%s, %s, %s, %s)
        RETURNING id
        ''', (
            user.username,
            password_hash,
            user.email,
            user.role
        ))
        
        user_id = cursor.fetchone()[0]
        conn.commit()
        return user_id
    except Exception as e:
        conn.rollback()
        print(f"Ошибка при добавлении пользователя: {e}")
        return None
    finally:
        conn.close()

def validate_user(username, password):
    """Проверяет учетные данные пользователя и возвращает пользователя, если они верны"""
    user = get_user_by_username(username)
    
    if user and verify_password(user.password_hash, password):
        return user
    
    return None

def create_admin_if_not_exists():
    """Создает пользователя-администратора, если он еще не существует"""
    admin = get_user_by_username('admin')
    
    if not admin:
        admin_user = User(
            username='admin',
            email='admin@example.com',
            role='admin'
        )
        add_user(admin_user, 'admin123')
        print("Создан пользователь admin с паролем admin123")

# --------- NewsItem методы ---------

def get_all_news_items():
    """Получает все новости из базы данных"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM news_items ORDER BY date DESC, time DESC')
    items = cursor.fetchall()
    conn.close()
    
    # Преобразуем строки БД в объекты NewsItem
    news_list = []
    for item in items:
        item_dict = dict(item)
        news_list.append(NewsItem.from_dict(item_dict))
    
    return news_list

def get_news_item_by_id(news_id):
    """Получает новость по ID"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM news_items WHERE id = %s', (news_id,))
    item = cursor.fetchone()
    conn.close()
    
    if item:
        item_dict = dict(item)
        # Конвертируем views в число
        item_dict['views'] = int(item_dict.get('views', 0))
        return NewsItem.from_dict(item_dict)
    return None

def add_news_item(news_item):
    """Добавляет новость в базу данных"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Выводим информацию о добавляемой новости для отладки
    print(f"Добавление новости: ID={news_item.id}, Title={news_item.title}")
    
    if news_item.id is None:
        # Вставка новой записи
        cursor.execute('''
        INSERT INTO news_items (category, title, author, description, image, featured, url, date, time, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        ''', (
            news_item.category,
            news_item.title,
            news_item.author,
            news_item.description,
            news_item.image,
            news_item.featured,
            news_item.url,
            news_item.date,
            news_item.time,
            news_item.created_at
        ))
        news_id = cursor.fetchone()[0]
    else:
        # Обновление существующей записи
        cursor.execute('''
        UPDATE news_items
        SET category = %s, title = %s, author = %s, description = %s, 
            image = %s, featured = %s, url = %s, date = %s, time = %s, created_at = %s
        WHERE id = %s
        RETURNING id
        ''', (
            news_item.category,
            news_item.title,
            news_item.author,
            news_item.description,
            news_item.image,
            news_item.featured,
            news_item.url,
            news_item.date,
            news_item.time,
            news_item.created_at,
            news_item.id
        ))
        news_id = cursor.fetchone()[0]
    
    conn.commit()
    conn.close()
    
    return news_id

# --------- Collection методы ---------

def get_all_collections():
    """Получает все коллекции из базы данных"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM collections')
    collections = cursor.fetchall()
    conn.close()
    
    # Преобразуем строки БД в объекты Collection
    collection_list = []
    for item in collections:
        collection_dict = dict(item)
        # Получаем связанные newsIds
        collection_dict['newsIds'] = get_collection_news_ids(collection_dict['id'])
        collection_list.append(Collection.from_dict(collection_dict))
    
    return collection_list

def get_collection_by_id(collection_id):
    """Получает коллекцию по ID"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM collections WHERE id = %s', (collection_id,))
    collection = cursor.fetchone()
    conn.close()
    
    if collection:
        collection_dict = dict(collection)
        # Получаем связанные newsIds
        collection_dict['newsIds'] = get_collection_news_ids(collection_dict['id'])
        return Collection.from_dict(collection_dict)
    return None

def get_collection_news_ids(collection_id):
    """Получает ID новостей, связанных с коллекцией"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'SELECT news_id FROM collection_news WHERE collection_id = %s', 
        (collection_id,)
    )
    news_ids = cursor.fetchall()
    conn.close()
    
    return [row[0] for row in news_ids]

def add_collection(collection):
    """Добавляет коллекцию в базу данных"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        conn.autocommit = False  # Начинаем транзакцию
        
        if collection.id is None:
            # Новая коллекция
            cursor.execute('''
            INSERT INTO collections (title, description, image)
            VALUES (%s, %s, %s)
            RETURNING id
            ''', (
                collection.title,
                collection.description,
                collection.image
            ))
            collection_id = cursor.fetchone()[0]
        else:
            # Обновление существующей коллекции
            cursor.execute('''
            UPDATE collections
            SET title = %s, description = %s, image = %s
            WHERE id = %s
            RETURNING id
            ''', (
                collection.title,
                collection.description,
                collection.image,
                collection.id
            ))
            collection_id = cursor.fetchone()[0]
            
            # Удаляем старые связи для обновления
            cursor.execute('DELETE FROM collection_news WHERE collection_id = %s', (collection_id,))
        
        # Добавляем связи с новостями, если они есть
        if collection.newsIds:
            for news_id in collection.newsIds:
                cursor.execute('''
                INSERT INTO collection_news (collection_id, news_id)
                VALUES (%s, %s)
                ''', (collection_id, news_id))
        
        conn.commit()
        return collection_id
    
    except Exception as e:
        conn.rollback()
        print(f"Ошибка при добавлении коллекции: {e}")
        return None
    
    finally:
        conn.close()

# --------- NewsAudio методы ---------

def get_all_news_audio():
    """Получает все аудионовости из базы данных"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM news_audio ORDER BY date DESC')
    items = cursor.fetchall()
    conn.close()
    
    # Преобразуем строки БД в объекты NewsAudio
    audio_list = []
    for item in items:
        audio_dict = dict(item)
        # Преобразуем названия полей из snake_case в camelCase
        if 'audio_url' in audio_dict:
            audio_dict['audioUrl'] = audio_dict.pop('audio_url')
        audio_list.append(NewsAudio.from_dict(audio_dict))
    
    return audio_list

def get_news_audio_by_id(audio_id):
    """Получает аудионовость по ID"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('SELECT * FROM news_audio WHERE id = %s', (audio_id,))
    item = cursor.fetchone()
    conn.close()
    
    if item:
        audio_dict = dict(item)
        # Преобразуем названия полей из snake_case в camelCase
        if 'audio_url' in audio_dict:
            audio_dict['audioUrl'] = audio_dict.pop('audio_url')
        return NewsAudio.from_dict(audio_dict)
    return None

def add_news_audio(audio_item):
    """Добавляет аудионовость в базу данных"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Выводим информацию о добавляемой аудионовости для отладки
    print(f"Добавление аудионовости: ID={audio_item.id}, Title={audio_item.title}")
    
    if audio_item.id is None:
        # Новая аудионовость
        cursor.execute('''
        INSERT INTO news_audio (category, title, description, audio_url, date, duration)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        ''', (
            audio_item.category,
            audio_item.title,
            audio_item.description,
            audio_item.audioUrl,
            audio_item.date,
            audio_item.duration
        ))
        audio_id = cursor.fetchone()[0]
    else:
        # Обновление существующей аудионовости
        cursor.execute('''
        UPDATE news_audio
        SET category = %s, title = %s, description = %s, audio_url = %s, date = %s, duration = %s
        WHERE id = %s
        RETURNING id
        ''', (
            audio_item.category,
            audio_item.title,
            audio_item.description,
            audio_item.audioUrl,
            audio_item.date,
            audio_item.duration,
            audio_item.id
        ))
        audio_id = cursor.fetchone()[0]
    
    conn.commit()
    conn.close()
    
    return audio_id

def is_admin(user_id):
    """Проверяет, является ли пользователь администратором"""
    user = get_user_by_id(user_id)
    return user is not None and user.role == 'admin'

def increment_news_views(news_id):
    """Увеличивает счетчик просмотров для новости на 1"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Проверяем, существует ли новость с таким ID
        cursor.execute("SELECT id FROM news_items WHERE id = %s", (news_id,))
        if cursor.fetchone() is None:
            print(f"Новость с ID {news_id} не найдена")
            conn.close()
            return False
        
        # Обновляем счетчик просмотров
        cursor.execute(
            "UPDATE news_items SET views = views + 1 WHERE id = %s RETURNING views", 
            (news_id,)
        )
        
        result = cursor.fetchone()
        new_views = result[0] if result else 0
        
        conn.commit()
        print(f"Просмотры новости ID {news_id} увеличены до {new_views}")
        
        return new_views
    
    except Exception as e:
        print(f"Ошибка при увеличении счетчика просмотров: {e}")
        conn.rollback()
        return False
    
    finally:
        conn.close()

# --------- Comments методы ---------

def get_comments_for_news(news_id):
    """Получает все комментарии для указанной новости"""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute('''
        SELECT c.id, c.news_id, c.user_id, c.content, c.created_at, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.news_id = %s
        ORDER BY c.created_at DESC
    ''', (news_id,))
    comments = cursor.fetchall()
    conn.close()
    
    return [dict(comment) for comment in comments]

def add_comment(news_id, user_id, content):
    """Добавляет новый комментарий"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
        INSERT INTO comments (news_id, user_id, content)
        VALUES (%s, %s, %s)
        RETURNING id
        ''', (news_id, user_id, content))
        
        comment_id = cursor.fetchone()[0]
        conn.commit()
        return comment_id
    except Exception as e:
        conn.rollback()
        print(f"Ошибка при добавлении комментария: {e}")
        return None
    finally:
        conn.close()

def delete_comment(comment_id):
    """Удаляет комментарий по ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM comments WHERE id = %s RETURNING id', (comment_id,))
        result = cursor.fetchone()
        conn.commit()
        return result is not None
    except Exception as e:
        conn.rollback()
        print(f"Ошибка при удалении комментария: {e}")
        return False
    finally:
        conn.close()