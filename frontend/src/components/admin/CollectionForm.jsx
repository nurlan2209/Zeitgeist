// CollectionForm.jsx
import React, { useState } from 'react';

import { useAuth } from '../../service/AuthContext';

const CollectionForm = ({ collection, newsList, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: collection.id || null,
    title: collection.title || '',
    description: collection.description || '',
    image: collection.image || '',
    newsIds: collection.newsIds || []
  });
    const { user, isAdmin, logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNewsSelection = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(parseInt(options[i].value, 10));
      }
    }
    
    setFormData({
      ...formData,
      newsIds: selectedValues
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
          <h3>{formData.id ? 'Редактирование коллекции' : 'Добавление коллекции'}</h3>
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
            <label htmlFor="newsIds">Новости в коллекции</label>
            <select
              id="newsIds"
              name="newsIds"
              multiple
              size="8"
              value={formData.newsIds}
              onChange={handleNewsSelection}
              className="multi-select"
            >
              {newsList.map(newsItem => (
                <option key={newsItem.id} value={newsItem.id}>
                  {newsItem.title} ({newsItem.category})
                </option>
              ))}
            </select>
            <small className="form-help">
              Для выбора нескольких новостей удерживайте Ctrl (или Command на Mac)
            </small>
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

export default CollectionForm;