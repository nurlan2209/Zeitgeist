# auth.py
from flask import Blueprint, jsonify, request, session
import database as db
from user import User
import secrets
import functools

auth_bp = Blueprint('auth', __name__)

# Генерируем случайный секретный ключ для сессий
SECRET_KEY = secrets.token_hex(16)

# Декоратор для защиты маршрутов, требующих авторизации
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Требуется авторизация'}), 401
        return view(**kwargs)
    return wrapped_view

# Декоратор для маршрутов, требующих прав администратора
def admin_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Требуется авторизация'}), 401
        
        user = db.get_user_by_id(session['user_id'])
        if not user or user.role != 'admin':
            return jsonify({'error': 'Требуются права администратора'}), 403
        
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
        # Сохраняем информацию о пользователе в сессии
        session.clear()
        session['user_id'] = user.id
        session['username'] = user.username
        session['role'] = user.role
        
        return jsonify({
            'message': 'Вход выполнен успешно',
            'user': user.to_dict()
        })
    
    return jsonify({'error': 'Неверное имя пользователя или пароль'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Маршрут для выхода пользователя"""
    session.clear()
    return jsonify({'message': 'Выход выполнен успешно'})

@auth_bp.route('/current_user', methods=['GET'])
def get_current_user():
    """Возвращает информацию о текущем пользователе"""
    if 'user_id' in session:
        user = db.get_user_by_id(session['user_id'])
        if user:
            return jsonify(user.to_dict())
    
    return jsonify({'user': None})

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
    
    # Определяем роль нового пользователя
    # Если запрос на создание админа, проверяем, что текущий пользователь - админ
    requested_role = data.get('role', 'user')
    
    if requested_role == 'admin' and ('user_id' not in session or not db.is_admin(session['user_id'])):
        # Если не админ пытается создать админа, устанавливаем роль 'user'
        role = 'user'
    else:
        role = requested_role
    
    # Создаем нового пользователя
    new_user = User(
        username=data['username'],
        email=data.get('email'),
        role=role
    )
    
    user_id = db.add_user(new_user, data['password'])
    
    if user_id:
        new_user.id = user_id
        return jsonify({
            'message': 'Пользователь успешно зарегистрирован',
            'user': new_user.to_dict()
        }), 201
    
    return jsonify({'error': 'Ошибка при регистрации пользователя'}), 500

# Добавляем функцию для проверки, есть ли у пользователя права администратора
@auth_bp.route('/check_admin', methods=['GET'])
@login_required
def check_admin():
    """Проверяет, имеет ли текущий пользователь права администратора"""
    user = db.get_user_by_id(session['user_id'])
    
    if user and user.role == 'admin':
        return jsonify({'isAdmin': True})
    
    return jsonify({'isAdmin': False})