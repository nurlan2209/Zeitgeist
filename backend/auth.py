# auth.py
from flask import Blueprint, jsonify, request
import database as db
from user import User
import secrets
import functools
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

# Секретный ключ для JWT
SECRET_KEY = secrets.token_hex(32)

# Функция для генерации JWT-токена
def generate_token(user_id, username, role):
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)  # Токен истекает через 1 день
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Декоратор для защиты маршрутов, требующих авторизации
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Требуется токен авторизации'}), 401
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user = payload  # Сохраняем данные пользователя в запросе
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Токен истек'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Недействительный токен'}), 401
        
        return view(**kwargs)
    return wrapped_view

# Декоратор для маршрутов, требующих прав администратора
def admin_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Требуется токен авторизации'}), 401
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            if payload.get('role') != 'admin':
                return jsonify({'error': 'Требуются права администратора'}), 403
            request.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Токен истек'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Недействительный токен'}), 401
        
        return view(**kwargs)
    return wrapped_view

@auth_bp.route('/login', methods=['POST'])
def login():
    """Маршрут для входа пользователя"""
    data = request.json
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Имя пользователя и пароль обязательны'}), 400
    
    user = db.validate_user(data['username'], data['password'])
    
    if user:
        # Генерируем JWT-токен
        token = generate_token(user.id, user.username, user.role)
        return jsonify({
            'message': 'Вход выполнен успешно',
            'user': user.to_dict(),
            'token': token
        })
    
    return jsonify({'error': 'Неверное имя пользователя или пароль'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Маршрут для выхода пользователя"""
    # На клиенте нужно удалить токен из localStorage
    return jsonify({'message': 'Выход выполнен успешно'})

@auth_bp.route('/current_user', methods=['GET'])
@login_required
def get_current_user():
    """Возвращает информацию о текущем пользователе"""
    user = db.get_user_by_id(request.user['user_id'])
    if user:
        return jsonify(user.to_dict())
    
    return jsonify({'error': 'Пользователь не найден'}), 404

@auth_bp.route('/register', methods=['POST'])
def register():
    """Маршрут для регистрации нового пользователя
    
    Обычные пользователи могут регистрироваться сами.
    Только администраторы могут создавать других администраторов.
    """
    data = request.json
    
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Имя пользователя и пароль обязательны'}), 400
    
    # Проверяем, существует ли пользователь с таким именем
    existing_user = db.get_user_by_username(data['username'])
    if existing_user:
        return jsonify({'error': 'Пользователь с таким именем уже существует'}), 400
    
    # Проверяем длину пароля
    if len(data['password']) < 8:
        return jsonify({'error': 'Пароль должен содержать минимум 8 символов'}), 400
    
    # Определяем роль нового пользователя
    requested_role = data.get('role', 'user')
    role = 'user'  # По умолчанию всегда user
    
    if requested_role == 'admin':
        # Проверяем, что текущий пользователь - администратор
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Только администратор может создавать администраторов'}), 403
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            if payload.get('role') != 'admin':
                return jsonify({'error': 'Только администратор может создавать администраторов'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Недействительный токен'}), 401
    
        role = 'admin'
    
    # Создаем нового пользователя
    new_user = User(
        username=data['username'],
        email=data.get('email'),
        role=role
    )
    
    try:
        user_id = db.add_user(new_user, data['password'])
    except Exception as e:
        print(f"Ошибка при регистрации пользователя: {e}")
        return jsonify({'error': 'Ошибка при регистрации пользователя'}), 500
    
    if user_id:
        new_user.id = user_id
        # Генерируем JWT-токен для нового пользователя
        token = generate_token(new_user.id, new_user.username, new_user.role)
        return jsonify({
            'message': 'Пользователь успешно зарегистрирован',
            'user': new_user.to_dict(),
            'token': token
        }), 201
    
    return jsonify({'error': 'Ошибка при регистрации пользователя'}), 500

@auth_bp.route('/check_admin', methods=['GET'])
@login_required
def check_admin():
    """Проверяет, имеет ли текущий пользователь права администратора"""
    return jsonify({'isAdmin': request.user.get('role') == 'admin'})