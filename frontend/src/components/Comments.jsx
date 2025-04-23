// components/Comments.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../service/AuthContext';
import './Comments.css';

function Comments({ newsId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  // Fetch comments when component mounts or newsId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/api/news/${newsId}/comments`);
        
        if (!response.ok) {
          throw new Error(`Ошибка загрузки комментариев: ${response.statusText}`);
        }
        
        const data = await response.json();
        setComments(data.comments || []);
        setError(null);
      } catch (err) {
        console.error("Ошибка загрузки комментариев:", err);
        setError("Не удалось загрузить комментарии. Попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };
    
    if (newsId) {
      fetchComments();
    }
  }, [newsId]);
  
  // Handle new comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/news/${newsId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (!response.ok) {
        throw new Error('Не удалось отправить комментарий');
      }
      
      const data = await response.json();
      
      // Add the new comment to the list
      setComments([data.comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error("Ошибка при отправке комментария:", err);
      setError("Не удалось отправить комментарий. Попробуйте позже.");
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="comments-section">
      <h2 className="comments-title">Комментарии</h2>
      
      {/* Comment form - only show if user is logged in */}
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            className="comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            required
          />
          <button type="submit" className="comment-submit">
            Отправить
          </button>
        </form>
      ) : (
        <div className="login-to-comment">
          <p>Войдите в систему, чтобы оставить комментарий</p>
        </div>
      )}
      
      {/* Error message */}
      {error && <div className="comment-error">{error}</div>}
      
      {/* Comments list */}
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">Загрузка комментариев...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.username}</span>
                <span className="comment-date">{formatDate(comment.created_at)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        ) : (
          <div className="no-comments">Нет комментариев. Будьте первым!</div>
        )}
      </div>
    </div>
  );
}

export default Comments;