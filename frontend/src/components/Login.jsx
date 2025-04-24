// Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../service/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const { user, login, error, loading, register } = useAuth();
  const navigate = useNavigate();

  // Если пользователь уже авторизован, перенаправляем его
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginMode) {
      // Вход в систему
      if (await login(username, password)) {
        navigate('/');
      }
    } else {
      // Регистрация
      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      
      if (await register(username, password, email)) {
        // После успешной регистрации автоматически входим
        if (await login(username, password)) {
          navigate('/');
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <Link to="/" className="back-button">← Вернуться на главную</Link>
        <h1 className="site-title">Zeitgeist</h1>
      </div>
      
      <div className="auth-form-wrapper">
        <h2>{isLoginMode ? 'Вход в систему' : 'Регистрация'}</h2>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Вход
          </button>
          <button 
            className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Регистрация
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLoginMode}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLoginMode}
              />
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading 
              ? 'Загрузка...' 
              : isLoginMode 
                ? 'Войти' 
                : 'Зарегистрироваться'
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;