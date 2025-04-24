# migrations/add_views_column.py
import os
import sys
import sqlite3

# Добавляем путь к родительской директории, чтобы импортировать модули
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import DATABASE_PATH, get_db_connection

def add_views_column():
    """Добавляет столбец views в таблицу news_items для учета просмотров"""
    print("Проверка наличия столбца views в таблице news_items...")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Получаем информацию о столбцах таблицы news_items
    cursor.execute("PRAGMA table_info(news_items)")
    columns = cursor.fetchall()
    column_names = [column[1] for column in columns]
    
    if 'views' not in column_names:
        print("Добавление столбца views в таблицу news_items...")
        try:
            # Добавляем новый столбец
            cursor.execute("ALTER TABLE news_items ADD COLUMN views INTEGER DEFAULT 0")
            conn.commit()
            print("Столбец views успешно добавлен и инициализирован значением 0")
        except sqlite3.Error as e:
            print(f"Ошибка при добавлении столбца: {e}")
            conn.rollback()
    else:
        print("Столбец views уже существует в таблице news_items")
    
    conn.close()
    return True

if __name__ == "__main__":
    add_views_column()