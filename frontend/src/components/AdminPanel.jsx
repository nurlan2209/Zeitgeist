// AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../service/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPanel.css';

// Admin components
import NewsManager from './admin/NewsManager';
import CollectionsManager from './admin/CollectionsManager';
import AudioManager from './admin/AudioManager';
import CommentsManager from './admin/CommentsManager'; // Import the new CommentsManager

const AdminPanel = () => {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('news');
  const navigate = useNavigate();

  // Check if user is authorized as admin
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    if (await logout()) {
      navigate('/');
    }
  };

  // Show loading screen if user is not authorized or not admin
  if (!user || !isAdmin) {
    return <div className="loading-panel">Проверка прав доступа...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Панель управления</h1>
          <Link to="/" className="back-to-site-button">
            ← Вернуться на сайт
          </Link>
        </div>
        <div className="user-info">
          <span>Пользователь: {user.username}</span>
          <button onClick={handleLogout} className="logout-button">Выйти</button>
        </div>
      </header>

      <nav className="admin-nav">
        <ul>
          <li>
            <button 
              className={activeTab === 'news' ? 'active' : ''}
              onClick={() => setActiveTab('news')}
            >
              Новости
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'collections' ? 'active' : ''}
              onClick={() => setActiveTab('collections')}
            >
              Коллекции
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'audio' ? 'active' : ''}
              onClick={() => setActiveTab('audio')}
            >
              Аудио
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'comments' ? 'active' : ''}
              onClick={() => setActiveTab('comments')}
            >
              Комментарии
            </button>
          </li>
        </ul>
      </nav>

      <main className="admin-content">
        {activeTab === 'news' && <NewsManager />}
        {activeTab === 'collections' && <CollectionsManager />}
        {activeTab === 'audio' && <AudioManager />}
        {activeTab === 'comments' && <CommentsManager />}
      </main>
    </div>
  );
};

export default AdminPanel;