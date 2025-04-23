// components/admin/CommentsManager.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../service/AuthContext';

// API URL constants
const ADMIN_API_URL = 'http://127.0.0.1:5000/admin';

const CommentsManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useAuth();

  // Load all comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ADMIN_API_URL}/comments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при загрузке комментариев');
      }
    } catch (err) {
      console.error('Ошибка при загрузке комментариев:', err);
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  // Load comments when component mounts
  useEffect(() => {
    fetchComments();
  }, []);

  // Delete a comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      return;
    }
    
    try {
      const response = await fetch(`${ADMIN_API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        // Update the comments list after deletion
        fetchComments();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Ошибка при удалении комментария');
      }
    } catch (err) {
      console.error('Ошибка при удалении комментария:', err);
      alert('Ошибка соединения с сервером');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && comments.length === 0) {
    return <div className="loading-message">Загрузка комментариев...</div>;
  }

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h2>Управление комментариями</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Автор</th>
            <th>Новость</th>
            <th>Комментарий</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                Комментарии не найдены
              </td>
            </tr>
          ) : (
            comments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.id}</td>
                <td>{comment.username}</td>
                <td>{comment.news_title}</td>
                <td className="comment-text-cell">
                  {comment.content.length > 100 
                    ? `${comment.content.substring(0, 100)}...` 
                    : comment.content}
                </td>
                <td>{formatDate(comment.created_at)}</td>
                <td className="action-buttons">
                  <button 
                    onClick={() => handleDelete(comment.id)} 
                    className="delete-button"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommentsManager;