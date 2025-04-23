import React from 'react';
import { useNews } from '../service/NewsContext';
import Component3 from './Left_Block/Component3';
import './NewsGrid.css';

const NewsGrid = () => {
  const { news, loading } = useNews();
  
  if (loading) {
    return <div className="loading">Loading news...</div>;
  }
  
  // Первая строка: первые 3 новости
  const topNews = news.slice(0, 3);
  
  // Вторая строка: следующие 3 новости
  const middleNews = news.slice(3, 6);
  
  // Третья строка: новости 7-9
  const bottomNews = news.slice(6, 9);
  
  // Специальная новость с изображением
  const featuredNews = news.length > 9 ? news[9] : null;
  
  return (
    <div className="news-grid-wrapper">
      <div className="container">
        {/* Первая строка новостей */}
        <div className="news-row">
          {topNews.map(newsItem => (
            <Component3 
              key={newsItem.id} 
              newsId={newsItem.id} 
              className="news-grid-item"
            />
          ))}
        </div>
        
        {/* Вторая строка новостей */}
        <div className="news-row">
          {middleNews.map(newsItem => (
            <Component3 
              key={newsItem.id} 
              newsId={newsItem.id}
              className="news-grid-item" 
            />
          ))}
        </div>
        
        {/* Специальная новость с изображением */}
        {featuredNews && (
          <div className="featured-news-container">
            <div className="featured-news-category">
              ISRAEL & THE MIDDLE EAST
            </div>
            <h2 className="featured-news-title">THEIR TIME IS UP</h2>
            <p className="featured-news-excerpt">
              The murder of the Bibas children caps off an 18-month catalog of horrors that has told us exactly who our Palestinian neighbors are. Backed by a friend in the White House, Israel must secure its future through strong unilateral action.
            </p>
            <div className="featured-news-author">
              BY LIEL LEIBOVITZ
            </div>
            <div className="featured-news-image">
              <img src={featuredNews.image || "/featured-image.jpg"} alt={featuredNews.title} />
            </div>
          </div>
        )}
        
        {/* Третья строка новостей */}
        <div className="news-row">
          {bottomNews.map(newsItem => (
            <Component3 
              key={newsItem.id} 
              newsId={newsItem.id}
              className="news-grid-item" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsGrid;