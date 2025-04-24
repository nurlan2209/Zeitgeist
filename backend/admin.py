# admin.py
from flask import Blueprint, jsonify, request
import database as db
from models import NewsItem, Collection, NewsAudio
from auth import admin_required ,login_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/news', methods=['POST'])
@login_required
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
    db.add_news_item(updated_news)  # Используем ту же функцию для обновления

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
    
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Удаляем новость из БД
        cursor.execute('DELETE FROM news_items WHERE id = %s', (news_id,))
        conn.commit()
        return jsonify({'message': 'Новость успешно удалена'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Ошибка при удалении новости: {str(e)}'}), 500
    finally:
        conn.close()

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
    
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Сначала удаляем все связи
        cursor.execute('DELETE FROM collection_news WHERE collection_id = %s', (collection_id,))
        
        # Затем удаляем саму коллекцию
        cursor.execute('DELETE FROM collections WHERE id = %s', (collection_id,))
        
        conn.commit()
        return jsonify({'message': 'Коллекция успешно удалена'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Ошибка при удалении коллекции: {str(e)}'}), 500
    finally:
        conn.close()

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
    
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Удаляем аудионовость из БД
        cursor.execute('DELETE FROM news_audio WHERE id = %s', (audio_id,))
        conn.commit()
        return jsonify({'message': 'Аудионовость успешно удалена'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Ошибка при удалении аудионовости: {str(e)}'}), 500
    finally:
        conn.close()

# Маршруты для модерации комментариев
@admin_bp.route('/comments', methods=['GET'])
@admin_required
def get_all_comments():
    """Получение всех комментариев для модерации"""
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT c.id, c.content, c.created_at, n.title as news_title, 
                   u.username, c.news_id, c.user_id
            FROM comments c
            JOIN news_items n ON c.news_id = n.id
            JOIN users u ON c.user_id = u.id
            ORDER BY c.created_at DESC
        ''')
        
        # Преобразуем результат в список словарей
        columns = [desc[0] for desc in cursor.description]
        comments = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return jsonify({
            'comments': comments
        })
    except Exception as e:
        return jsonify({'error': f'Ошибка при получении комментариев: {str(e)}'}), 500
    finally:
        conn.close()

@admin_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
@admin_required
def delete_comment(comment_id):
    """Удаление комментария администратором"""
    # Удаляем комментарий
    success = db.delete_comment(comment_id)
    
    if success:
        return jsonify({'message': 'Комментарий успешно удален'})
    else:
        return jsonify({'error': 'Комментарий не найден или не может быть удален'}), 404