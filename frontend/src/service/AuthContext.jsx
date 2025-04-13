// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// URL API для аутентификации
const AUTH_API_URL = 'http://localhost:5000/auth';

// Создаем контекст
const AuthContext = createContext();

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);

// Провайдер контекста аутентификации
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка текущего пользователя при загрузке
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${AUTH_API_URL}/current_user`, {
          method: 'GET',
          credentials: 'include',  // Важно для отправки cookies с сессией
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.id) {
            setUser(data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Ошибка при проверке пользователя:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  // Функция для входа
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',  // Важно для сохранения cookies с сессией
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        return true;
      } else {
        setError(data.error || 'Ошибка при входе');
        return false;
      }
    } catch (err) {
      console.error('Ошибка при входе:', err);
      setError('Ошибка соединения с сервером');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция для регистрации
  const register = async (username, password, email) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password,
          email,
          role: 'user' // Регистрируем всегда как обычного пользователя
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        setError(data.error || 'Ошибка при регистрации');
        return false;
      }
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      setError('Ошибка соединения с сервером');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция для выхода
  const logout = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${AUTH_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setUser(null);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Функция для проверки, является ли пользователь администратором
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Предоставляем данные и функции через контекст
  const value = {
    user,
    loading,
    error,
    login,
    register, // Добавляем функцию регистрации
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;