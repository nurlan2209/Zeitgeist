import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../service/AuthContext";

function AboutUsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#131517',
          color: 'white',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80%',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ 
          fontSize: '24px', 
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          paddingBottom: '10px'
        }}>
          О нас
        </h2>
        <p style={{ 
          fontSize: '16px', 
          lineHeight: '1.6',
          marginBottom: '15px'
        }}>
          Zeitgeist — это новостной сайт, который помогает следить за актуальными событиями в мире. Мы рассказываем о главных темах дня, разбираем их с разных сторон и даем понятное объяснение того, что происходит.
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: 'white',
            color: '#131517',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

function Sidebar({ isOpen, onClose, children }) {
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".footer-but")
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = () => {
    onClose();
  };

  const openAboutUsModal = () => {
    setIsAboutUsModalOpen(true);
    onClose(); // Закрываем сайдбар при открытии модального окна
  };

  const handleLogout = async () => {
    await logout();
    onClose(); // Закрываем сайдбар после выхода
  };

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`sidebar ${isOpen ? "open" : ""}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100%',
          backgroundColor: '#131517',
          color: 'white',
          padding: '20px',
          boxShadow: '0 0 15px rgba(0,0,0,0.2)',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="sidebar-content">
          <h1 style={{
            fontSize: '28px',
            marginBottom: '30px',
            fontWeight: 'bold'
          }}>
            Zeitgeist
          </h1>

          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Элементы авторизации */}
            <div style={{
              marginBottom: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '20px'
            }}>
              {user ? (
                <>
                  <div style={{
                    fontSize: '18px',
                    marginBottom: '15px'
                  }}>
                    Привет, {user.username}!
                  </div>
                  
                  {/* Ссылка на админ-панель (если пользователь админ) */}
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={onClose}
                      style={{
                        display: 'block',
                        backgroundColor: '#4a9aff',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        fontSize: '16px',
                        textAlign: 'center',
                        marginBottom: '10px'
                      }}
                    >
                      Админ-панель
                    </Link>
                  )}
                  
                  {/* Кнопка выхода */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: '1px solid #ff4a4a',
                      color: '#ff4a4a',
                      padding: '10px 15px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Выйти
                  </button>
                </>
              ) : (
                /* Ссылка на страницу входа */
                <Link 
                  to="/login" 
                  onClick={onClose}
                  style={{
                    display: 'block',
                    backgroundColor: '#4a9aff',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}
                >
                  Войти в систему
                </Link>
              )}
            </div>

            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                openAboutUsModal();
              }}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '20px'
              }}
            >
              О нас
            </a>
            <a href="https://web.whatsapp.com/send?phone=77779844335" target="_blank" rel="noopener noreferrer" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '20px'
            }}>Связаться</a>
          </nav>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
            color: 'white',
            fontSize: '18px'
          }}>
            <a href="https://www.instagram.com/marat1ovvnaa" target="_blank" rel="noopener noreferrer" style={{ 
              color: 'white', 
              textDecoration: 'none' 
            }}>Instagram</a>
          </div>

          <footer style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)'
          }}>
            Zeitgeist
            <br />
            Шаяхмет Енлік © 2025. Все права защищены.
          </footer>
        </div>
      </div>
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
      <AboutUsModal 
        isOpen={isAboutUsModalOpen} 
        onClose={() => setIsAboutUsModalOpen(false)} 
      />
    </>
  );
}

export default Sidebar;