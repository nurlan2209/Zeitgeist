# migrations/add_created_at.py
import os
import sys
import sqlite3
import random
from datetime import datetime, timedelta

# Добавляем путь к родительской директории, чтобы импортировать модули
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import DATABASE_PATH, get_db_connection

def add_created_at_column():
    """Добавляет столбец created_at в таблицу news_items с датами за последние 2 недели"""
    print("Проверка наличия столбца created_at в таблице news_items...")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Получаем информацию о столбцах таблицы news_items
    cursor.execute("PRAGMA table_info(news_items)")
    columns = cursor.fetchall()
    column_names = [column[1] for column in columns]
    
    if 'created_at' not in column_names:
        print("Добавление столбца created_at в таблицу news_items...")
        try:
            # Добавляем новый столбец
            cursor.execute("ALTER TABLE news_items ADD COLUMN created_at TIMESTAMP")
            
            # Получаем все записи
            cursor.execute("SELECT id FROM news_items")
            news_ids = cursor.fetchall()
            
            # Текущая дата
            current_date = datetime.now()
            
            # Для каждой новости устанавливаем случайную дату в последние 2 недели
            for news_id in news_ids:
                # Случайное количество дней (от 0 до 14)
                random_days = random.randint(0, 14)
                # Случайное количество часов
                random_hours = random.randint(0, 23)
                # Случайное количество минут
                random_minutes = random.randint(0, 59)
                
                # Вычисляем случайную дату в пределах последних 2 недель
                random_date = current_date - timedelta(
                    days=random_days, 
                    hours=random_hours, 
                    minutes=random_minutes
                )
                
                # Форматируем дату в строку для SQLite
                formatted_date = random_date.strftime('%Y-%m-%d %H:%M:%S')
                
                # Обновляем запись
                cursor.execute(
                    "UPDATE news_items SET created_at = ? WHERE id = ?", 
                    (formatted_date, news_id[0])
                )
            
            conn.commit()
            print("Столбец created_at успешно добавлен и заполнен случайными датами за последние 2 недели")
        except sqlite3.Error as e:
            print(f"Ошибка при добавлении столбца: {e}")
            conn.rollback()
    else:
        print("Столбец created_at уже существует в таблице news_items")
    
    conn.close()
    return True

if __name__ == "__main__":
    add_created_at_column()