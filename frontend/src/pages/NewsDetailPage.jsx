import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNews } from '../service/NewsContext';
import Footer_but from '../components/footer/Footer_but';
import Sidebar from '../components/footer/Sidebar';
import Comments from '../components/Comments'; // Import the Comments component
import './NewsDetailPage.css';

function NewsDetailPage() {
  const { newsId } = useParams();
  const { getNewsById, incrementViews } = useNews();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Convert ID to number
  const numericId = parseInt(newsId, 10);
  
  // Get news data
  const newsItem = getNewsById(numericId);

  // Increment view counter when page loads
  useEffect(() => {
    if (numericId && incrementViews) {
      incrementViews(numericId);
    }
  }, [numericId, incrementViews]);

  // Format date
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

  // Sidebar handlers
  const handleToggle = (newState) => {
    setSidebarOpen(newState);
  };

  const handleClose = () => {
    setSidebarOpen(false);
  };

  // If news not found
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
      {/* Menu button and sidebar */}
      <div className="news-detail-header">
        <Link to="/" className="back-to-home">
          ← На главную
        </Link>
        <Footer_but onToggle={handleToggle} isMenuOpen={sidebarOpen} />
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={handleClose} />

      <div className="news-detail-container">
        {/* Category */}
        <div className="news-detail-category">{newsItem.category}</div>
        
        {/* Title */}
        <h1 className="news-detail-title">{newsItem.title}</h1>
        
        {/* Author and date info */}
        <div className="news-detail-meta">
          <span className="news-detail-author">By {newsItem.author}</span>
          <span className="news-detail-date">{formatDate(newsItem.date)}</span>
          {newsItem.views && (
            <span className="news-detail-views">{newsItem.views} просмотров</span>
          )}
        </div>

        {/* Image */}
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

        {/* Comments section */}
        <Comments newsId={numericId} />

        {/* Back button */}
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