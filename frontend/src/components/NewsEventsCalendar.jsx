import { useState, useEffect } from "react";
import { useNews } from "../service/NewsContext.jsx";
import NewsModal from "./NewsModal";
import "./NewsEventsCalendar.css";
import { Link } from 'react-router-dom';


function NewsEventsCalendar() {
  const { news, incrementViews } = useNews(); // Предполагаем, что есть метод incrementViews
  const [sortedNews, setSortedNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    if (!news || news.length === 0) return;
    
    // Для новостей без created_at, добавляем текущую дату
    const itemsWithDates = news.map(item => {
      if (!item.created_at) {
        return {
          ...item,
          created_at: new Date().toISOString()
        };
      }
      return item;
    });
    
    // Сортируем по времени добавления (created_at) от новых к старым
    const sorted = [...itemsWithDates].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    
    setSortedNews(sorted);
  }, [news]);

  // Форматирование даты и времени
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      time: date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };
  };

  const handleNewsClick = (newsItem) => {
    if (typeof incrementViews === 'function') {
      incrementViews(newsItem.id);
    }
  };
  // Закрытие модального окна
  const handleCloseModal = () => {
    setSelectedNews(null);
  };

  if (sortedNews.length === 0) {
    return <div className="news-events-empty">Нет новостей для отображения</div>;
  }

  return (
    <div className="news-events-container">
      <div className="news-events-timeline">
        {sortedNews.map((item) => {
          const { date, time } = formatDateTime(item.created_at);
          return (
            <div 
              key={item.id} 
              className="event-card-wrapper"
              onClick={() => handleNewsClick(item)}
            >
              <div className="event-date-header">{date}</div>
              <div className="event-card">
                <div className="event-time">{time}</div>
                <div className="event-content">
                  <h3 className="event-title">{item.title}</h3>
                  {item.author && <div className="event-author">{item.author}</div>}
                  <p className="event-description">
                    {item.description ? (
                      item.description.length > 100 
                        ? item.description.substring(0, 100) + "..." 
                        : item.description
                    ) : ""}
                  </p>
                  {item.views !== undefined && (
                    <div className="event-views">{item.views} просмотров</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Модальное окно */}
      {selectedNews && (
        <NewsModal 
          news={selectedNews} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default NewsEventsCalendar;