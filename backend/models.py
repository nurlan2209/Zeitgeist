# models.py
from datetime import datetime

class NewsItem:
    def __init__(self, id=None, category=None, title=None, author=None, 
                 description=None, image=None, featured=False, url=None, 
                 date=None, time=None, created_at=None, views=0):
        self.id = id
        self.category = category
        self.title = title
        self.author = author
        self.description = description
        self.image = image
        self.featured = featured
        self.url = url
        self.date = date
        self.time = time
        self.created_at = created_at if created_at else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        self.views = views  # Добавляем поле views с значением по умолчанию 0

    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'image': self.image,
            'featured': self.featured,
            'url': self.url,
            'date': self.date,
            'time': self.time,
            'created_at': self.created_at,
            'views': self.views  # Добавляем в словарь
        }
    
    @staticmethod
    def from_dict(data):
        return NewsItem(
            id=data.get('id'),
            category=data.get('category'),
            title=data.get('title'),
            author=data.get('author'),
            description=data.get('description'),
            image=data.get('image'),
            featured=data.get('featured', False),
            url=data.get('url'),
            date=data.get('date'),
            time=data.get('time'),
            created_at=data.get('created_at'),
            views=data.get('views', 0)  # Получаем из словаря с значением по умолчанию 0
        )

class Collection:
    def __init__(self, id=None, title=None, description=None, image=None, newsIds=None):
        self.id = id
        self.title = title
        self.description = description
        self.image = image
        self.newsIds = newsIds or []
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image': self.image,
            'newsIds': self.newsIds
        }
    
    @staticmethod
    def from_dict(data):
        return Collection(
            id=data.get('id'),
            title=data.get('title'),
            description=data.get('description'),
            image=data.get('image'),
            newsIds=data.get('newsIds', [])
        )

class NewsAudio:
    def __init__(self, id=None, category=None, title=None, description=None, 
                 audioUrl=None, date=None, duration=None):
        self.id = id
        self.category = category
        self.title = title
        self.description = description
        self.audioUrl = audioUrl
        self.date = date
        self.duration = duration
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'title': self.title,
            'description': self.description,
            'audioUrl': self.audioUrl,
            'date': self.date,
            'duration': self.duration
        }
    
    @staticmethod
    def from_dict(data):
        return NewsAudio(
            id=data.get('id'),
            category=data.get('category'),
            title=data.get('title'),
            description=data.get('description'),
            audioUrl=data.get('audioUrl'),
            date=data.get('date'),
            duration=data.get('duration')
        )