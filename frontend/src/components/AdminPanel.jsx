import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../service/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPanel.css';

// Admin components
import NewsManager from './admin/NewsManager';
import CollectionsManager from './admin/CollectionsManager';
import AudioManager from './admin/AudioManager';
import CommentsManager from './admin/CommentsManager';

const AdminPanel = () => {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('news');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null); // Ref for the sidebar

  // Check if user is authorized as admin
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener when sidebar is open
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener on unmount or when sidebar closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    if (await logout()) {
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          <button className="hamburger-button" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </header>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <nav className={`admin-nav ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <ul>
          <li>
            <button 
              className={activeTab === 'news' ? 'active' : ''}
              onClick={() => {
                setActiveTab('news');
                setIsSidebarOpen(false);
              }}
            >
              Новости
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'collections' ? 'active' : ''}
              onClick={() => {
                setActiveTab('collections');
                setIsSidebarOpen(false);
              }}
            >
              Коллекции
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'audio' ? 'active' : ''}
              onClick={() => {
                setActiveTab('audio');
                setIsSidebarOpen(false);
              }}
            >
              Аудио
            </button>
          </li>
          <li>
            <button 
              className={activeTab === 'comments' ? 'active' : ''}
              onClick={() => {
                setActiveTab('comments');
                setIsSidebarOpen(false);
              }}
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