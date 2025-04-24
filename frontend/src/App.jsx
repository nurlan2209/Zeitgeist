import { useEffect } from "react";
import React from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./service/AuthContext";
import { NewsProvider } from "./service/NewsContext";
import Desktop from "./pages/Desktop";
import NewsDetailPage from "./pages/NewsDetailPage";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

// Защищенный маршрут для админ-панели
const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;
  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Zeitgeist";
        metaDescription = "Актуальные новости и события";
        break;
      case "/admin":
        title = "Админ-панель";
        metaDescription = "Управление новостным контентом";
        break;
      case "/login":
        title = "Вход в систему";
        metaDescription = "Авторизация на портале";
        break;
      default:
        if (pathname.startsWith('/news/')) {
          title = "Новость | Zeitgeist";
          metaDescription = "Подробная информация о новости";
        }
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      {/* Маршрут для админ-панели */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
        errorElement={<ErrorBoundary />}
      />
      
      {/* Маршрут для входа */}
      <Route path="/login" element={<Login />} errorElement={<ErrorBoundary />} />
      
      {/* Маршрут для детальной страницы новости */}
      <Route 
        path="/news/:newsId" 
        element={
          <NewsProvider>
            <NewsDetailPage />
          </NewsProvider>
        } 
        errorElement={<ErrorBoundary />}
      />
      
      {/* Основной маршрут */}
      <Route element={<Desktop />} path="/" errorElement={<ErrorBoundary />} />
      
      {/* Маршрут для страницы "Не найдено" */}
      <Route path="*" element={<NotFound />} errorElement={<ErrorBoundary />} />
    </Routes>
  );
}

export default App;