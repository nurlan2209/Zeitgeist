// Пример обновления для NewsContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// Создаем контекст для новостей
const NewsContext = createContext();

// Хук для использования контекста новостей в компонентах
export const useNews = () => useContext(NewsContext);

// Провайдер контекста новостей
export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newsAudio, setNewsAudio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/data');
        
        if (!response.ok) {
          throw new Error(`Ошибка при загрузке данных: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setNews(data.news || []);
        setCollections(data.collections || []);
        setNewsAudio(data.newsAudio || []);
        setError(null);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Получение новости по ID
  const getNewsById = useCallback((id) => {
    return news.find(item => item.id === id) || null;
  }, [news]);

  // Получение коллекции по ID
  const getCollectionById = useCallback((id) => {
    return collections.find(item => item.id === id) || null;
  }, [collections]);

  // Увеличение счетчика просмотров новости
  const incrementViews = useCallback(async (newsId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/news/${newsId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка при увеличении просмотров: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Обновляем локальное состояние новостей
      setNews(prevNews => prevNews.map(item => {
        if (item.id === newsId) {
          return {
            ...item,
            views: result.views
          };
        }
        return item;
      }));
      
      return result.views;
    } catch (err) {
      console.error(`Ошибка при увеличении просмотров для новости ID ${newsId}:`, err);
      return false;
    }
  }, []);

  // Значение провайдера
  const value = {
    news,
    collections,
    newsAudio,
    loading,
    error,
    getNewsById,
    getCollectionById,
    incrementViews
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};

NewsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default NewsContext;