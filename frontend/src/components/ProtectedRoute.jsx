// ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../service/AuthContext';

// Компонент для защиты маршрутов, требующих авторизации
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  // Показываем загрузку, пока проверяем авторизацию
  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Если пользователь авторизован, показываем защищенный контент
  return <Outlet />;
};

// Компонент для защиты маршрутов, требующих прав администратора
export const AdminRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  
  // Показываем загрузку, пока проверяем авторизацию
  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }
  
  // Если пользователь не авторизован или не админ, перенаправляем
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Если пользователь админ, показываем контент
  return <Outlet />;
};