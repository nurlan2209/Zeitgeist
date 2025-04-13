# import_json.py
import os
import json
import sys

# Добавляем путь к родительской директории, чтобы импортировать модули
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import NewsItem, Collection, NewsAudio
import database as db

def import_data_from_json(json_path):
    """Импортирует данные из JSON файла в базу данных"""
    print(f"Импорт данных из {json_path}...")
    
    try:
        with open(json_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
        print("Содержимое JSON файла:")
        print(f"Ключи: {list(data.keys())}")
        print(f"newsItems: {len(data.get('newsItems', []))}")
        print(f"collections: {len(data.get('collections', []))}")
        print(f"newsAudio: {len(data.get('newsAudio', []))}")
        
        # Инициализируем базу данных
        db.init_db()
        
        # Импортируем новости
        if 'newsItems' in data:
            print(f"Импорт {len(data['newsItems'])} новостей...")
            for item_data in data['newsItems']:
                news_item = NewsItem.from_dict(item_data)
                db.add_news_item(news_item)
            print("Новости успешно импортированы")
        
        # Импортируем коллекции
        if 'collections' in data:
            print(f"Импорт {len(data['collections'])} коллекций...")
            for collection_data in data['collections']:
                collection = Collection.from_dict(collection_data)
                db.add_collection(collection)
            print("Коллекции успешно импортированы")
        
        # Импортируем аудионовости
        if 'newsAudio' in data:
            print(f"Импорт {len(data['newsAudio'])} аудионовостей...")
            for audio_data in data['newsAudio']:
                audio_item = NewsAudio.from_dict(audio_data)
                db.add_news_audio(audio_item)
            print("Аудионовости успешно импортированы")
        
        print("Импорт данных завершен успешно")
        return True
    
    except Exception as e:
        print(f"Ошибка при импорте данных: {e}")
        return False

if __name__ == "__main__":
    # Проверяем аргументы командной строки
    if len(sys.argv) > 1:
        json_path = sys.argv[1]
    else:
        # Путь по умолчанию к JSON файлу
        json_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__), 
            '..', '..', 'frontend', 'src', 'service', 'newsData.json'
        ))
    
    import_data_from_json(json_path)