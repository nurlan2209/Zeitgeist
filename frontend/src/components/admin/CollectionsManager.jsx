// CollectionsManager.jsx
import React, { useState, useEffect } from 'react';
import CollectionForm from './CollectionForm';
import { useAuth } from '../../service/AuthContext';


// URL API для административных операций
const ADMIN_API_URL = 'http://127.0.0.1:5000/admin';
const API_URL = 'http://127.0.0.1:5000/api';


const CollectionsManager = () => {
  const [collections, setCollections] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const { user, isAdmin, logout } = useAuth();

  // Загружаем список коллекций и новостей
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Получаем коллекции
      const collectionsResponse = await fetch(`${API_URL}/collections`, {
        credentials: 'include',
      });
      
      if (collectionsResponse.ok) {
        const collectionsData = await collectionsResponse.json();
        setCollections(collectionsData.collections || []);
      }
      
      // Получаем новости для формы выбора
      const newsResponse = await fetch(`${API_URL}/news`, {
        credentials: 'include',
      });
      
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        setNews(newsData.news || []);
      }
      
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Функция для создания новой коллекции
  const handleCreate = () => {
    setCurrentCollection({
      title: '',
      description: '',
      image: '',
      newsIds: []
    });
    setShowForm(true);
  };

  // Функция для редактирования существующей коллекции
  const handleEdit = (collection) => {
    setCurrentCollection({ ...collection });
    setShowForm(true);
  };

  // Функция для удаления коллекции
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту коллекцию?')) {
      return;
    }
    
    try {
      const response = await fetch(`${ADMIN_API_URL}/collections/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        // Обновляем список коллекций после удаления
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при удалении коллекции');
      }
    } catch (err) {
      console.error('Ошибка при удалении коллекции:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  // Функция для сохранения коллекции (создание или обновление)
  const handleSave = async (collectionData) => {
    try {
      const isNew = !collectionData.id;
      const url = isNew 
        ? `${ADMIN_API_URL}/collections` 
        : `${ADMIN_API_URL}/collections/${collectionData.id}`;
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(collectionData),
        credentials: 'include',
      });
      
      if (response.ok) {
        // Закрываем форму и обновляем список коллекций
        setShowForm(false);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при сохранении коллекции');
      }
    } catch (err) {
      console.error('Ошибка при сохранении коллекции:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  if (loading && collections.length === 0) {
    return <div className="loading-message">Загрузка коллекций...</div>;
  }

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h2>Управление коллекциями</h2>
        <button onClick={handleCreate} className="add-button">
          Добавить коллекцию
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Заголовок</th>
            <th>Описание</th>
            <th>Новостей</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {collections.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-message">
                Коллекции не найдены
              </td>
            </tr>
          ) : (
            collections.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.newsIds?.length || 0}</td>
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
        <CollectionForm 
          collection={currentCollection}
          newsList={news}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CollectionsManager;