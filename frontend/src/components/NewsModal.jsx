import { useEffect } from "react";
import PropTypes from "prop-types";
import "./NewsModal.css";

function NewsModal({ news, onClose }) {
  // Обработка нажатия Escape для закрытия модального окна
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEsc);
    
    // Запрещаем прокрутку страницы, когда модальное окно открыто
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Предотвращение закрытия при клике внутри контента модального окна
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal-content" onClick={handleContentClick}>
        <button className="news-modal-close" onClick={onClose}>×</button>
        
        {news.category && (
          <div className="news-modal-category">{news.category}</div>
        )}
        
        <h2 className="news-modal-title">{news.title}</h2>
        
        <div className="news-modal-meta">
          {news.author && (
            <span className="news-modal-author">By {news.author}</span>
          )}
          {news.created_at && (
            <span className="news-modal-date">
              {formatDate(news.created_at)}
            </span>
          )}
          <span className="news-modal-views">
            {news.views || 0} просмотров
          </span>
        </div>
        
        {news.image && (
          <div className="news-modal-image">
            <img src={news.image} alt={news.title} />
          </div>
        )}
        
        <div className="news-modal-description">
          {news.description}
        </div>
        
        {news.url && (
          <div className="news-modal-footer">
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="news-modal-link"
            >
              Читать полную статью
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

NewsModal.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.number,
    category: PropTypes.string,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
    created_at: PropTypes.string,
    views: PropTypes.number
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default NewsModal;