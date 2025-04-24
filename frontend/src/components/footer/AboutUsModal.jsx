import { useState, useEffect, useRef } from "react";

function AboutUsModal({ onClose }) {
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
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const sidebarRef = useRef(null);

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

  const openAboutUs = () => {
    setIsAboutUsOpen(true);
    onClose(); // Закрываем сайдбар при открытии модального окна
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
            fontSize: '24px',
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
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                openAboutUs();
              }}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px'
              }}
            >
              О нас
            </a>
            <a href="#" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '16px'
            }}>Поддержать нас</a>
            <a href="#" style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '16px'
            }}>Связаться</a>
          </nav>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
            color: 'white',
            fontSize: '14px'
          }}>
            <a href="#" style={{ color: 'white' }}>Instagram</a>
          </div>

          <footer style={{
            fontSize: '12px',
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
      {isAboutUsOpen && (
        <AboutUsModal onClose={() => setIsAboutUsOpen(false)} />
      )}
    </>
  );
}

export default Sidebar;