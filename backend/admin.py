# admin.py
from flask import Blueprint, jsonify, request
import database as db
from models import NewsItem, Collection, NewsAudio
from auth import admin_required

admin_bp = Blueprint('admin', __name__)

# Маршруты для управления новостями
@admin_bp.route('/news', methods=['POST'])
@admin_required
def create_news():
    """Создание новой новости"""
    data = request.json
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Заголовок обязателен'}), 400
    
    news_item = NewsItem.from_dict(data)
    news_id = db.add_news_item(news_item)
    
    return jsonify({
        'message': 'Новость успешно создана',
        'id': news_id
    }), 201

@admin_bp.route('/news/<int:news_id>', methods=['PUT'])
@admin_required
def update_news(news_id):
    """Обновление существующей новости"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'Данные для обновления не предоставлены'}), 400
    
    # Проверяем, существует ли новость
    existing_news = db.get_news_item_by_id(news_id)
    if not existing_news:
        return jsonify({'error': 'Новость не найдена'}), 404
    
    # Обновляем данные новости
    data['id'] = news_id  # Убеждаемся, что ID не изменится
    updated_news = NewsItem.from_dict(data)
    db.add_news_item(updated_news)  # Используем ту же функцию для обновления (REPLACE)
    
    return jsonify({
        'message': 'Новость успешно обновлена',
        'news': updated_news.to_dict()
    })

@admin_bp.route('/news/<int:news_id>', methods=['DELETE'])
@admin_required
def delete_news(news_id):
    """Удаление новости"""
    # Проверяем, существует ли новость
    existing_news = db.get_news_item_by_id(news_id)
    if not existing_news:
        return jsonify({'error': 'Новость не найдена'}), 404
    
    # Удаляем новость из БД
    conn = db.get_db_connection()
    conn.execute('DELETE FROM news_items WHERE id = ?', (news_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Новость успешно удалена'})

# Маршруты для управления коллекциями
@admin_bp.route('/collections', methods=['POST'])
@admin_required
def create_collection():
    """Создание новой коллекции"""
    data = request.json
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Заголовок обязателен'}), 400
    
    collection = Collection.from_dict(data)
    collection_id = db.add_collection(collection)
    
    return jsonify({
        'message': 'Коллекция успешно создана',
        'id': collection_id
    }), 201

@admin_bp.route('/collections/<int:collection_id>', methods=['PUT'])
@admin_required
def update_collection(collection_id):
    """Обновление существующей коллекции"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'Данные для обновления не предоставлены'}), 400
    
    # Проверяем, существует ли коллекция
    existing_collection = db.get_collection_by_id(collection_id)
    if not existing_collection:
        return jsonify({'error': 'Коллекция не найдена'}), 404
    
    # Обновляем данные коллекции
    data['id'] = collection_id  # Убеждаемся, что ID не изменится
    updated_collection = Collection.from_dict(data)
    db.add_collection(updated_collection)  # Используем ту же функцию для обновления
    
    return jsonify({
        'message': 'Коллекция успешно обновлена',
        'collection': updated_collection.to_dict()
    })

@admin_bp.route('/collections/<int:collection_id>', methods=['DELETE'])
@admin_required
def delete_collection(collection_id):
    """Удаление коллекции"""
    # Проверяем, существует ли коллекция
    existing_collection = db.get_collection_by_id(collection_id)
    if not existing_collection:
        return jsonify({'error': 'Коллекция не найдена'}), 404
    
    # Удаляем коллекцию из БД
    conn = db.get_db_connection()
    
    # Сначала удаляем все связи
    conn.execute('DELETE FROM collection_news WHERE collection_id = ?', (collection_id,))
    
    # Затем удаляем саму коллекцию
    conn.execute('DELETE FROM collections WHERE id = ?', (collection_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Коллекция успешно удалена'})

# Маршруты для управления аудионовостями
@admin_bp.route('/audio', methods=['POST'])
@admin_required
def create_audio():
    """Создание новой аудионовости"""
    data = request.json
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Заголовок обязателен'}), 400
    
    audio_item = NewsAudio.from_dict(data)
    audio_id = db.add_news_audio(audio_item)
    
    return jsonify({
        'message': 'Аудионовость успешно создана',
        'id': audio_id
    }), 201

@admin_bp.route('/audio/<int:audio_id>', methods=['PUT'])
@admin_required
def update_audio(audio_id):
    """Обновление существующей аудионовости"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'Данные для обновления не предоставлены'}), 400
    
    # Проверяем, существует ли аудионовость
    existing_audio = db.get_news_audio_by_id(audio_id)
    if not existing_audio:
        return jsonify({'error': 'Аудионовость не найдена'}), 404
    
    # Обновляем данные аудионовости
    data['id'] = audio_id  # Убеждаемся, что ID не изменится
    updated_audio = NewsAudio.from_dict(data)
    db.add_news_audio(updated_audio)  # Используем ту же функцию для обновления
    
    return jsonify({
        'message': 'Аудионовость успешно обновлена',
        'audio': updated_audio.to_dict()
    })

@admin_bp.route('/audio/<int:audio_id>', methods=['DELETE'])
@admin_required
def delete_audio(audio_id):
    """Удаление аудионовости"""
    # Проверяем, существует ли аудионовость
    existing_audio = db.get_news_audio_by_id(audio_id)
    if not existing_audio:
        return jsonify({'error': 'Аудионовость не найдена'}), 404
    
    # Удаляем аудионовость из БД
    conn = db.get_db_connection()
    conn.execute('DELETE FROM news_audio WHERE id = ?', (audio_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Аудионовость успешно удалена'})