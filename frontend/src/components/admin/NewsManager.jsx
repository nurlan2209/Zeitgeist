// NewsManager.jsx
import React, { useState, useEffect } from 'react';
import NewsForm from './NewsForm';
import { useAuth } from '../../service/AuthContext';

// URL API для административных операций
const ADMIN_API_URL = 'http://127.0.0.1:5000/admin';
const API_URL = 'http://127.0.0.1:5000/api';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const { user, isAdmin } = useAuth();

  // Загружаем список новостей
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/news`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при загрузке данных');
      }
    } catch (err) {
      console.error('Ошибка при загрузке новостей:', err);
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем новости при монтировании компонента
  useEffect(() => {
    fetchNews();
  }, []);

  // Функция для создания новой новости
  const handleCreate = () => {
    setCurrentNews({
      title: '',
      category: '',
      description: '',
      author: '',
      image: '',
      featured: false,
      url: '',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5)
    });
    setShowForm(true);
  };

  // Функция для редактирования существующей новости
  const handleEdit = (newsItem) => {
    setCurrentNews({ ...newsItem });
    setShowForm(true);
  };

  // Функция для удаления новости
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }
    
    try {
      const response = await fetch(`${ADMIN_API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        // Обновляем список новостей после удаления
        fetchNews();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при удалении новости');
      }
    } catch (err) {
      console.error('Ошибка при удалении новости:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  // Функция для сохранения новости (создание или обновление)
  const handleSave = async (newsData) => {
    try {
      const isNew = !newsData.id;
      const url = isNew
        ? `${ADMIN_API_URL}/news`
        : `${ADMIN_API_URL}/news/${newsData.id}`;
      // Добавляем отладочный вывод
      console.log('Отправка запроса на сохранение новости:', {
        url,
        method: isNew ? 'POST' : 'PUT',
        token: localStorage.getItem('authToken'),
        data: newsData
      });

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(newsData),
        credentials: 'include',
      });
      if (response.ok) {
        // Закрываем форму и обновляем список новостей
        setShowForm(false);
        fetchNews();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при сохранении новости');
      }
    } catch (err) {
      console.error('Ошибка при сохранении новости:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  if (loading && news.length === 0) {
    return <div className="loading-message">Загрузка новостей...</div>;
  }

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h2>Управление новостями</h2>
        <button onClick={handleCreate} className="add-button">
          Добавить новость
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Категория</th>
            <th>Заголовок</th>
            <th>Автор</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {news.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                Новости не найдены
              </td>
            </tr>
          ) : (
            news.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.date}</td>
                <td className="action-buttons">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="edit-button"
                  >
                    🖌️
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <NewsForm 
          newsItem={currentNews}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default NewsManager;