# routes.py
from flask import Blueprint, jsonify, request
import database as db
from models import NewsItem, Collection, NewsAudio
from auth import login_required

api_bp = Blueprint('api', __name__)

# Маршруты для новостей (NewsItems)
@api_bp.route('/news', methods=['GET'])
def get_news():
    """Получение всех новостей"""
    news_items = db.get_all_news_items()
    # Сортируем по created_at, чтобы самые свежие новости были сверху
    sorted_news = sorted(news_items, key=lambda x: x.created_at if hasattr(x, 'created_at') else '', reverse=True)
    return jsonify({
        'news': [item.to_dict() for item in sorted_news]
    })

@api_bp.route('/news/<int:news_id>', methods=['GET'])
def get_news_item(news_id):
    """Получение новости по ID"""
    news_item = db.get_news_item_by_id(news_id)
    if news_item:
        return jsonify(news_item.to_dict())
    return jsonify({'error': 'Новость не найдена'}), 404

# Маршруты для коллекций
@api_bp.route('/collections', methods=['GET'])
def get_collections():
    """Получение всех коллекций"""
    collections = db.get_all_collections()
    return jsonify({
        'collections': [collection.to_dict() for collection in collections]
    })

@api_bp.route('/collections/<int:collection_id>', methods=['GET'])
def get_collection(collection_id):
    """Получение коллекции по ID"""
    collection = db.get_collection_by_id(collection_id)
    if collection:
        return jsonify(collection.to_dict())
    return jsonify({'error': 'Коллекция не найдена'}), 404

# Маршруты для аудионовостей
@api_bp.route('/audio', methods=['GET'])
def get_audio_news():
    """Получение всех аудионовостей"""
    audio_items = db.get_all_news_audio()
    return jsonify({
        'newsAudio': [item.to_dict() for item in audio_items]
    })

@api_bp.route('/audio/<int:audio_id>', methods=['GET'])
def get_audio_item(audio_id):
    """Получение аудионовости по ID"""
    audio_item = db.get_news_audio_by_id(audio_id)
    if audio_item:
        return jsonify(audio_item.to_dict())
    return jsonify({'error': 'Аудионовость не найдена'}), 404

# Общий маршрут для всех данных
@api_bp.route('/data', methods=['GET'])
def get_all_data():
    """Получение всех данных в одном ответе (как в исходном JSON)"""
    news_items = db.get_all_news_items()
    # Сортируем по created_at, чтобы самые свежие новости были сверху
    sorted_news = sorted(news_items, key=lambda x: x.created_at if hasattr(x, 'created_at') else '', reverse=True)
    
    collections = db.get_all_collections()
    audio_items = db.get_all_news_audio()
    
    # Логирование для отладки
    print(f"API /data: получено {len(news_items)} новостей, {len(collections)} коллекций, {len(audio_items)} аудионовостей")
    
    response_data = {
        'news': [item.to_dict() for item in sorted_news],      
        'collections': [collection.to_dict() for collection in collections],
        'newsAudio': [item.to_dict() for item in audio_items]
    }
    
    return jsonify(response_data)

@api_bp.route('/news/<int:news_id>/view', methods=['POST'])
def increment_views(news_id):
    """Увеличивает счетчик просмотров для новости"""
    new_views = db.increment_news_views(news_id)
    
    if new_views is False:
        return jsonify({'error': 'Не удалось увеличить счетчик просмотров'}), 400
    
    return jsonify({'success': True, 'views': new_views})

# --------- Маршруты для комментариев ---------
@api_bp.route('/news/<int:news_id>/comments', methods=['GET'])
def get_news_comments(news_id):
    """Получение всех комментариев для новости"""
    comments = db.get_comments_for_news(news_id)
    
    return jsonify({
        'comments': comments
    })

@api_bp.route('/news/<int:news_id>/comments', methods=['POST'])
@login_required
def add_comment(news_id):
    """Добавление нового комментария"""
    data = request.json
    
    if not data or 'content' not in data:
        return jsonify({'error': 'Текст комментария обязателен'}), 400
    
    user_id = request.user['user_id']  # Получаем user_id из JWT-токена
    
    comment_id = db.add_comment(news_id, user_id, data['content'])
    
    if comment_id:
        # Получаем данные созданного комментария
        all_comments = db.get_comments_for_news(news_id)
        created_comment = next((c for c in all_comments if c['id'] == comment_id), None)
        
        return jsonify({
            'message': 'Комментарий успешно добавлен',
            'comment': created_comment
        }), 201
    
    return jsonify({'error': 'Ошибка при добавлении комментария'}), 500