# user.py
import hashlib
import os

class User:
    def __init__(self, id=None, username=None, password_hash=None, email=None, role='user'):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.email = email
        self.role = role  # 'user' или 'admin'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }
    
    @staticmethod
    def from_dict(data):
        return User(
            id=data.get('id'),
            username=data.get('username'),
            password_hash=data.get('password_hash'),
            email=data.get('email'),
            role=data.get('role', 'user')
        )
    
    @staticmethod
    def hash_password(password):
        """Создает хеш пароля с солью"""
        salt = os.urandom(32)  # 32 байта соли
        key = hashlib.pbkdf2_hmac(
            'sha256',  # Используем алгоритм хеширования SHA-256
            password.encode('utf-8'),  # Переводим пароль в байты
            salt,  # Соль
            100000,  # Количество итераций
            dklen=128  # Длина выходного ключа
        )
        # Сохраняем соль и ключ вместе
        return salt + key
    
    @staticmethod
    def verify_password(stored_password, provided_password):
        """Проверяет, совпадает ли введенный пароль с хешем"""
        salt = stored_password[:32]  # Первые 32 байта - это соль
        stored_key = stored_password[32:]  # Остальное - ключ
        
        # Вычисляем ключ из предоставленного пароля
        key = hashlib.pbkdf2_hmac(
            'sha256',
            provided_password.encode('utf-8'),
            salt,
            100000,
            dklen=128
        )
        
        # Сравниваем ключи
        return key == stored_key