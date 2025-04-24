// AudioManager.jsx
import React, { useState, useEffect } from 'react';
import AudioForm from './AudioForm';
import { useAuth } from '../../service/AuthContext';

// URL API для административных операций
const ADMIN_API_URL = 'http://127.0.0.1:5000/admin';
const API_URL = 'http://127.0.0.1:5000/api';

const AudioManager = () => {
  const [audioItems, setAudioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const token = localStorage.getItem('authToken');
    const { user, isAdmin, logout } = useAuth();

  // Загружаем список аудионовостей
  const fetchAudioItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/audio`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setAudioItems(data.newsAudio || []);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при загрузке данных');
      }
    } catch (err) {
      console.error('Ошибка при загрузке аудионовостей:', err);
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем аудионовости при монтировании компонента
  useEffect(() => {
    fetchAudioItems();
  }, []);

  // Функция для создания новой аудионовости
  const handleCreate = () => {
    setCurrentAudio({
      title: '',
      category: '',
      description: '',
      audioUrl: '',
      date: '',
      duration: 0
    });
    setShowForm(true);
  };

  // Функция для редактирования существующей аудионовости
  const handleEdit = (audioItem) => {
    setCurrentAudio({ ...audioItem });
    setShowForm(true);
  };

  // Функция для удаления аудионовости
  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту аудионовость?')) {
      return;
    }
    
    try {
      const response = await fetch(`${ADMIN_API_URL}/audio/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        // Обновляем список аудионовостей после удаления
        fetchAudioItems();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при удалении аудионовости');
      }
    } catch (err) {
      console.error('Ошибка при удалении аудионовости:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  // Функция для сохранения аудионовости (создание или обновление)
  const handleSave = async (audioData) => {
    try {
      const isNew = !audioData.id;
      const url = isNew 
        ? `${ADMIN_API_URL}/audio` 
        : `${ADMIN_API_URL}/audio/${audioData.id}`;
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(audioData),
        credentials: 'include',
      });
      
      if (response.ok) {
        // Закрываем форму и обновляем список аудионовостей
        setShowForm(false);
        fetchAudioItems();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при сохранении аудионовости');
      }
    } catch (err) {
      console.error('Ошибка при сохранении аудионовости:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  if (loading && audioItems.length === 0) {
    return <div className="loading-message">Загрузка аудионовостей...</div>;
  }

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h2>Управление аудионовостями</h2>
        <button onClick={handleCreate} className="add-button">
          Добавить аудионовость
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Категория</th>
            <th>Заголовок</th>
            <th>Дата</th>
            <th>Длительность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {audioItems.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                Аудионовости не найдены
              </td>
            </tr>
          ) : (
            audioItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td>{item.title}</td>
                <td>{item.date}</td>
                <td>{item.duration} сек.</td>
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
        <AudioForm 
          audioItem={currentAudio}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default AudioManager;