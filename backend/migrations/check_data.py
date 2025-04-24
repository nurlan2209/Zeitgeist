# check_data.py
import os
import json
import sys
# Добавляем путь к родительской директории, чтобы импортировать модули
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import database as db

def check_database_data():
    """Проверяет данные в базе данных и выводит информацию"""
    
    # Проверяем новости
    news_items = db.get_all_news_items()
    print(f"== Новости в базе данных: {len(news_items)} ==")
    if news_items:
        print("Пример первой новости:")
        print(json.dumps(news_items[0].to_dict(), indent=2, ensure_ascii=False))
    else:
        print("Новости не найдены в базе данных!")
    
    # Проверяем коллекции
    collections = db.get_all_collections()
    print(f"\n== Коллекции в базе данных: {len(collections)} ==")
    if collections:
        print("Пример первой коллекции:")
        print(json.dumps(collections[0].to_dict(), indent=2, ensure_ascii=False))
    else:
        print("Коллекции не найдены в базе данных!")
    
    # Проверяем аудионовости
    audio_items = db.get_all_news_audio()
    print(f"\n== Аудионовости в базе данных: {len(audio_items)} ==")
    if audio_items:
        print("Пример первой аудионовости:")
        print(json.dumps(audio_items[0].to_dict(), indent=2, ensure_ascii=False))
    else:
        print("Аудионовости не найдены в базе данных!")
    
    return True

if __name__ == "__main__":
    check_database_data()