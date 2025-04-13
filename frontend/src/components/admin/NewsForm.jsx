// NewsForm.jsx
import React, { useState } from 'react';

const NewsForm = ({ newsItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: newsItem.id || null,
    category: newsItem.category || '',
    title: newsItem.title || '',
    description: newsItem.description || '',
    author: newsItem.author || '',
    image: newsItem.image || '',
    featured: newsItem.featured || false,
    url: newsItem.url || '',
    date: newsItem.date || new Date().toISOString().slice(0, 10),
    time: newsItem.time || new Date().toTimeString().slice(0, 5)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
          <h3>{formData.id ? 'Редактирование новости' : 'Добавление новости'}</h3>
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
            <label htmlFor="author">Автор</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Путь к изображению</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Дата</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Время</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Выделить новость
            </label>
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

export default NewsForm;