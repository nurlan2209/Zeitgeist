# app.py
from flask import Flask
from flask_cors import CORS
from routes import api_bp
from auth import auth_bp, SECRET_KEY
from admin import admin_bp
import database as db
import os

app = Flask(__name__)
app.secret_key = SECRET_KEY  # Для сессий Flask
CORS(app, supports_credentials=True)  # Включаем CORS с поддержкой credentials

# Регистрируем blueprints
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(admin_bp, url_prefix='/admin')

# Инициализируем базу данных при запуске
# Инициализируем базу данных при запуске
with app.app_context():
    # Проверяем, существует ли БД
    db_exists = os.path.exists(db.DATABASE_PATH)
    
    # Инициализируем базу данных
    db.init_db()
    
    # Если БД не существовала, импортируем начальные данные
    if not db_exists:
        print("База данных не обнаружена. Создание новой базы...")
        
        # Импортируем данные из JSON
        from datetime import datetime, timedelta
        import random
        import json
        
        # Путь к JSON файлу
        json_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__), 
            '..', 'frontend', 'src', 'service', 'newsData.json'
        ))
        
        try:
            with open(json_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            # Текущая дата
            current_date = datetime.now()
            
            # Генерируем случайные даты для каждой новости
            if 'newsItems' in data:
                for item_data in data['newsItems']:
                    # Случайное количество дней (от 0 до 14)
                    random_days = random.randint(0, 14)
                    random_hours = random.randint(0, 23)
                    random_minutes = random.randint(0, 59)
                    
                    # Вычисляем случайную дату
                    random_date = current_date - timedelta(
                        days=random_days,
                        hours=random_hours,
                        minutes=random_minutes
                    )
                    
                    # Форматируем дату в строку
                    formatted_date = random_date.strftime('%Y-%m-%d %H:%M:%S')
                    item_data['created_at'] = formatted_date
                    
                    # Создаем объект новости и добавляем в БД
                    from models import NewsItem
                    news_item = NewsItem.from_dict(item_data)
                    db.add_news_item(news_item)
                
                print(f"Импортировано {len(data['newsItems'])} новостей с разными датами за последние 14 дней")
            
            # Импортируем остальные данные
            if 'collections' in data:
                from models import Collection
                for collection_data in data['collections']:
                    collection = Collection.from_dict(collection_data)
                    db.add_collection(collection)
                print(f"Импортировано {len(data['collections'])} коллекций")
            
            if 'newsAudio' in data:
                from models import NewsAudio
                for audio_data in data['newsAudio']:
                    audio_item = NewsAudio.from_dict(audio_data)
                    db.add_news_audio(audio_item)
                print(f"Импортировано {len(data['newsAudio'])} аудионовостей")
            
            print("База данных успешно создана и заполнена данными")
        except Exception as e:
            print(f"Ошибка при импорте данных: {e}")
    
    db.create_admin_if_not_exists()  # Создаем администратора, если его нет

if __name__ == '__main__':
    app.run(debug=True, port=5000)