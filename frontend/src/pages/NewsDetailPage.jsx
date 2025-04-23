import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNews } from '../service/NewsContext';
import Footer_but from '../components/footer/Footer_but';
import Sidebar from '../components/footer/Sidebar';
import './NewsDetailPage.css';

function NewsDetailPage() {
  const { newsId } = useParams();
  const { getNewsById, incrementViews } = useNews();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Конвертируем ID в число
  const numericId = parseInt(newsId, 10);
  
  // Получаем данные новости
  const newsItem = getNewsById(numericId);

  // Увеличиваем счетчик просмотров при загрузке страницы
  useEffect(() => {
    if (numericId && incrementViews) {
      incrementViews(numericId);
    }
  }, [numericId, incrementViews]);

  // Форматируем дату
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return dateString;
    }
  };

  // Обработчик для сайдбара
  const handleToggle = (newState) => {
    setSidebarOpen(newState);
  };

  const handleClose = () => {
    setSidebarOpen(false);
  };

  // Если новость не найдена
  if (!newsItem) {
    return (
      <div className="not-found-container">
        <h1>Новость не найдена</h1>
        <p>Запрашиваемая новость не существует или была удалена.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      {/* Кнопка меню и сайдбар */}
      <div className="news-detail-header">
        <Link to="/" className="back-to-home">
          ← На главную
        </Link>
        <Footer_but onToggle={handleToggle} isMenuOpen={sidebarOpen} />
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={handleClose} />

      <div className="news-detail-container">
        {/* Категория */}
        <div className="news-detail-category">{newsItem.category}</div>
        
        {/* Заголовок */}
        <h1 className="news-detail-title">{newsItem.title}</h1>
        
        {/* Информация об авторе и дате */}
        <div className="news-detail-meta">
          <span className="news-detail-author">By {newsItem.author}</span>
          <span className="news-detail-date">{formatDate(newsItem.date)}</span>
          {newsItem.views && (
            <span className="news-detail-views">{newsItem.views} просмотров</span>
          )}
        </div>

        {/* Изображение */}
        {newsItem.image && (
          <div className="news-detail-image-container">
            <img 
              src={newsItem.image} 
              alt={newsItem.title} 
              className="news-detail-image" 
            />
          </div>
        )}
        <div className="news-detail-content">
          <p className="news-detail-description">{newsItem.description}</p>
        </div>

        {/* Кнопка возврата */}
        <div className="news-detail-actions">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Вернуться к списку новостей
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewsDetailPage;