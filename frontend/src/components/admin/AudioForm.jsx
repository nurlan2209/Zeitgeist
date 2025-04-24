// AudioForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../service/AuthContext';

const AudioForm = ({ audioItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: audioItem.id || null,
    category: audioItem.category || '',
    title: audioItem.title || '',
    description: audioItem.description || '',
    audioUrl: audioItem.audioUrl || '',
    date: audioItem.date || '',
    duration: audioItem.duration || 0
  });
  const { user, isAdmin, logout } = useAuth();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h3>{formData.id ? 'Редактирование аудионовости' : 'Добавление аудионовости'}</h3>
          <button onClick={onCancel} className="close-button">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Заголовок</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Выберите категорию</option>
              <option value="NEWS">NEWS</option>
              <option value="CULTURE">CULTURE</option>
              <option value="BUSINESS">BUSINESS</option>
              <option value="TECHNOLOGY">TECHNOLOGY</option>
              <option value="SPORTS">SPORTS</option>
              <option value="POLITICS">POLITICS</option>
              <option value="HEALTH">HEALTH</option>
              <option value="ENTERTAINMENT">ENTERTAINMENT</option>
              <option value="SCIENCE">SCIENCE</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="audioUrl">URL аудио</label>
            <input
              type="text"
              id="audioUrl"
              name="audioUrl"
              value={formData.audioUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Дата</label>
            <input
              type="text"
              id="date"
              name="date"
              placeholder="Например: March 28, 2025"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Длительность (сек)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="0"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Отмена
            </button>
            <button type="submit" className="save-button">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AudioForm;