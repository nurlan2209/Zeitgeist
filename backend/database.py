# database.py
import sqlite3
import os
import json
from models import NewsItem, Collection, NewsAudio
from user import User

DATABASE_PATH = 'backend/news.db'

def get_db_connection():
    """Создает соединение с базой данных"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Получаем результаты в виде словарей
    return conn

def init_db():
    """Инициализирует базу данных и создает таблицы, если их нет"""
    # Проверяем, существует ли директория для базы данных
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    
    # Проверяем, существует ли файл базы данных
    db_exists = os.path.exists(DATABASE_PATH)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Создаем таблицу для новостей, если её нет
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS news_items (
        id INTEGER PRIMARY KEY,
        category TEXT,
        title TEXT NOT NULL,
        author TEXT,
        description TEXT,
        image TEXT,
        featured INTEGER DEFAULT 0,
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
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT
    )
    ''')
    
    # Создаем таблицу для связи коллекций и новостей (многие ко многим)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS collection_news (
        collection_id INTEGER,
        news_id INTEGER,
        PRIMARY KEY (collection_id, news_id),
        FOREIGN KEY (collection_id) REFERENCES collections(id),
        FOREIGN KEY (news_id) REFERENCES news_items(id)
    )
    ''')
    
    # Создаем таблицу для аудионовостей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS news_audio (
        id INTEGER PRIMARY KEY,
        category TEXT,
        title TEXT NOT NULL,
        description TEXT,
        audio_url TEXT,
        date TEXT,
        duration INTEGER
    )
    ''')
    
    # Создаем таблицу для пользователей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash BLOB NOT NULL,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()
    
    return not db_exists  # Возвращаем True, если база была создана

# --------- NewsItem методы ---------

# Обновляем функцию get_all_news_items
def get_all_news_items():
    """Получает все новости из базы данных"""
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM news_items ORDER BY date DESC, time DESC').fetchall()
    conn.close()
    
    # Преобразуем строки БД в объекты NewsItem
    news_list = []
    for item in items:
        item_dict = dict(item)
        # Конвертируем featured из 0/1 в False/True
        item_dict['featured'] = bool(item_dict['featured'])
        news_list.append(NewsItem.from_dict(item_dict))
    
    return news_list

def get_news_item_by_id(news_id):
    """Получает новость по ID"""
    conn = get_db_connection()
    item = conn.execute('SELECT * FROM news_items WHERE id = ?', (news_id,)).fetchone()
    conn.close()
    
    if item:
        item_dict = dict(item)
        # Конвертируем featured из 0/1 в False/True
        item_dict['featured'] = bool(item_dict['featured'])
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
    
    cursor.execute('''
    INSERT OR REPLACE INTO news_items (id, category, title, author, description, image, featured, url, date, time, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        news_item.id,
        news_item.category,
        news_item.title,
        news_item.author,
        news_item.description,
        news_item.image,
        1 if news_item.featured else 0,
        news_item.url,
        news_item.date,
        news_item.time,
        news_item.created_at
    ))
    
    # Получаем id вставленной записи
    news_id = cursor.lastrowid if news_item.id is None else news_item.id
    conn.commit()
    conn.close()
    
    return news_id

# --------- Collection методы ---------

def get_all_collections():
    """Получает все коллекции из базы данных"""
    conn = get_db_connection()
    collections = conn.execute('SELECT * FROM collections').fetchall()
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
    collection = conn.execute('SELECT * FROM collections WHERE id = ?', (collection_id,)).fetchone()
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
    news_ids = conn.execute(
        'SELECT news_id FROM collection_news WHERE collection_id = ?', 
        (collection_id,)
    ).fetchall()
    conn.close()
    
    return [row['news_id'] for row in news_ids]

def add_collection(collection):
    """Добавляет коллекцию в базу данных"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    INSERT OR REPLACE INTO collections (id, title, description, image)
    VALUES (?, ?, ?, ?)
    ''', (
        collection.id,
        collection.title,
        collection.description,
        collection.image
    ))
    
    # Получаем id вставленной записи
    collection_id = cursor.lastrowid if collection.id is None else collection.id
    
    # Добавляем связи с новостями, если они есть
    if collection.newsIds:
        # Сначала удаляем старые связи
        cursor.execute('DELETE FROM collection_news WHERE collection_id = ?', (collection_id,))
        
        # Добавляем новые связи
        for news_id in collection.newsIds:
            cursor.execute('''
            INSERT INTO collection_news (collection_id, news_id)
            VALUES (?, ?)
            ''', (collection_id, news_id))
    
    conn.commit()
    conn.close()
    
    return collection_id

# --------- User методы ---------

def get_user_by_username(username):
    """Получает пользователя по имени пользователя"""
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    
    if user:
        return User.from_dict(dict(user))
    return None

def get_user_by_id(user_id):
    """Получает пользователя по ID"""
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    
    if user:
        return User.from_dict(dict(user))
    return None

def add_user(user, password):
    """Добавляет нового пользователя в базу данных"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Хешируем пароль
    password_hash = User.hash_password(password)
    
    try:
        cursor.execute('''
        INSERT INTO users (username, password_hash, email, role)
        VALUES (?, ?, ?, ?)
        ''', (
            user.username,
            password_hash,
            user.email,
            user.role
        ))
        
        # Получаем id вставленного пользователя
        user_id = cursor.lastrowid
        conn.commit()
        return user_id
    except sqlite3.IntegrityError as e:
        # Обработка ошибки уникальности (если пользователь уже существует)
        print(f"Ошибка при добавлении пользователя: {e}")
        return None
    finally:
        conn.close()

def validate_user(username, password):
    """Проверяет учетные данные пользователя и возвращает пользователя, если они верны"""
    user = get_user_by_username(username)
    
    if user and User.verify_password(user.password_hash, password):
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
        add_user(admin_user, 'admin123')  # Начальный пароль
        print("Создан пользователь admin с паролем admin123")

# --------- NewsAudio методы ---------

def get_all_news_audio():
    """Получает все аудионовости из базы данных"""
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM news_audio ORDER BY date DESC').fetchall()
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
    item = conn.execute('SELECT * FROM news_audio WHERE id = ?', (audio_id,)).fetchone()
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
    
    cursor.execute('''
    INSERT OR REPLACE INTO news_audio (id, category, title, description, audio_url, date, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        audio_item.id,
        audio_item.category,
        audio_item.title,
        audio_item.description,
        audio_item.audioUrl,
        audio_item.date,
        audio_item.duration
    ))
    
    # Получаем id вставленной записи
    audio_id = cursor.lastrowid if audio_item.id is None else audio_item.id
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
        cursor.execute("SELECT id FROM news_items WHERE id = ?", (news_id,))
        if cursor.fetchone() is None:
            print(f"Новость с ID {news_id} не найдена")
            conn.close()
            return False
        
        # Получаем текущее количество просмотров
        cursor.execute("SELECT views FROM news_items WHERE id = ?", (news_id,))
        result = cursor.fetchone()
        
        # Если поле views не существует или значение NULL, считаем его за 0
        current_views = 0
        if result and 'views' in result.keys():
            current_views = result['views'] or 0
        
        # Увеличиваем значение на 1
        new_views = current_views + 1
        
        # Обновляем счетчик просмотров
        cursor.execute(
            "UPDATE news_items SET views = ? WHERE id = ?", 
            (new_views, news_id)
        )
        
        conn.commit()
        print(f"Просмотры новости ID {news_id} увеличены до {new_views}")
        
        conn.close()
        return new_views
    
    except Exception as e:
        print(f"Ошибка при увеличении счетчика просмотров: {e}")
        conn.rollback()
        conn.close()
        return False