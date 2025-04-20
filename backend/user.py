# user.py
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