import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Состояние для статуса администратора
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Проверяем токен и статус администратора при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser(token);
      checkAdminStatus(token);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/auth/current_user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Ошибка получения текущего пользователя:', err);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAdmin(false);
    }
  };

  const checkAdminStatus = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/auth/check_admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setIsAdmin(data.isAdmin); // Устанавливаем isAdmin как булево значение
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Ошибка проверки статуса администратора:', err);
      setIsAdmin(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        await checkAdminStatus(data.token); // Проверяем статус администратора после входа
        return data;
      } else {
        setError(data.error || 'Ошибка входа');
        return null;
      }
    } catch (err) {
      setError('Ошибка сервера');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        await checkAdminStatus(data.token); // Проверяем статус администратора после регистрации
        return data;
      } else {
        setError(data.error || 'Ошибка регистрации');
        return null;
      }
    } catch (err) {
      setError('Ошибка сервера');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST'
      });
    } catch (err) {
      console.error('Ошибка выхода:', err);
    }
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);