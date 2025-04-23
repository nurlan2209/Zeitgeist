import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import './ErrorBoundary.css';

function ErrorBoundary() {
  const error = useRouteError();
  
  // Получаем информацию об ошибке
  const errorMessage = error?.message || 'Неизвестная ошибка';
  const errorStack = error?.stack || '';

  return (
    <div className="error-boundary">
      <div className="error-container">
        <h1>Что-то пошло не так</h1>
        <p className="error-message">
          {errorMessage}
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Технические детали</summary>
            <pre>{errorStack}</pre>
          </details>
        )}
        
        <div className="error-actions">
          <button 
            onClick={() => window.location.reload()}
            className="reload-button"
          >
            Перезагрузить страницу
          </button>
          
          <Link to="/" className="home-link">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;