import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNews } from "../../service/NewsContext";
import './NewsAudioPlayer.css';

function NewsAudioPlayer({ className = "" }) {
  // Используем контекст
  const newsContext = useNews();
  
  const [newsAudio, setNewsAudio] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Отладочная информация, чтобы понять, что содержится в контексте
  useEffect(() => {
    console.log("NewsContext data:", newsContext);
    
    // Проверяем контекст на наличие данных
    if (newsContext) {
      if (newsContext.newsAudio && Array.isArray(newsContext.newsAudio)) {
        // Если newsAudio присутствует непосредственно в контексте
        console.log("Found newsAudio in context:", newsContext.newsAudio);
        setNewsAudio(newsContext.newsAudio);
        setLoading(false);
      } else {
        // Пробуем получить из JSON-данных
        try {
          // Импортируем данные напрямую
          const jsonData = require('./newsData.json');
          if (jsonData.newsAudio && Array.isArray(jsonData.newsAudio)) {
            console.log("Found newsAudio in JSON:", jsonData.newsAudio);
            setNewsAudio(jsonData.newsAudio);
            setLoading(false);
          } else {
            setError("newsAudio array not found in JSON file");
            setLoading(false);
          }
        } catch (e) {
          console.error("Error importing newsData.json:", e);
          setError("Error loading audio news data");
          setLoading(false);
        }
      }
    }
      
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [newsContext]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          setIsPlaying(false);
        });
        
        progressIntervalRef.current = setInterval(() => {
          if (audioRef.current) {
            const calculated = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(isNaN(calculated) ? 0 : calculated);
          }
        }, 1000);
      } else {
        audioRef.current.pause();
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }
  }, [isPlaying, currentAudioIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentAudioIndex < newsAudio.length - 1) {
      setCurrentAudioIndex(currentAudioIndex + 1);
      setProgress(0);
      if (isPlaying) {
        setIsPlaying(false);
        setTimeout(() => setIsPlaying(true), 100);
      }
    }
  };

  const handlePrevious = () => {
    if (currentAudioIndex > 0) {
      setCurrentAudioIndex(currentAudioIndex - 1);
      setProgress(0);
      if (isPlaying) {
        setIsPlaying(false);
        setTimeout(() => setIsPlaying(true), 100);
      }
    }
  };

  const handleAudioEnd = () => {
    if (currentAudioIndex < newsAudio.length - 1) {
      handleNext();
    } else {
      setIsPlaying(false);
      setProgress(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={`news-audio-player ${className}`}>
      <div className="audio-player-background" />

      <div className="audio-player-title-container">
        <h2 className="audio-player-title">
          Listen to Zeitgeist
        </h2>
      </div>

      <div className="audio-player-separator-wrapper">
        <div className="audio-player-separator" />
      </div>

      {loading ? (
        <div className="audio-player-loading">Loading news...</div>
      ) : error ? (
        <div className="audio-player-error">{error}</div>
      ) : newsAudio && newsAudio.length > 0 ? (
        <>
          <div className="audio-player-content">
            <div className="audio-news-info">
              <div className="audio-news-category">
                {newsAudio[currentAudioIndex]?.category || "NEWS"}
              </div>

              <div className="audio-news-title">
                {newsAudio[currentAudioIndex]?.title || "News title unavailable"}
              </div>
            </div>
          </div>

          <div className="audio-news-summary">
            <div className="audio-news-description">
              {newsAudio[currentAudioIndex]?.description || "No description available"}
            </div>
          </div>

          <div className="audio-player-controls">
            <button className="control-button previous" onClick={handlePrevious} disabled={currentAudioIndex === 0}>
              &#8592;
            </button>
            <button className="control-button play-pause" onClick={handlePlayPause}>
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button className="control-button next" onClick={handleNext} disabled={currentAudioIndex === newsAudio.length - 1}>
              &#8594;
            </button>
          </div>

          <div className="audio-progress-container">
            <div className="audio-progress-bar">
              <div className="audio-progress" style={{ width: `${progress}%` }} />
            </div>
            <div className="audio-time">
              {audioRef.current && (
                <>
                  <span>{formatTime(audioRef.current.currentTime)}</span>
                  <span> / </span>
                  <span>{formatTime(audioRef.current.duration)}</span>
                </>
              )}
            </div>
          </div>

          <div className="audio-news-footer">
            <div className="audio-news-date-container">
              <div className="audio-news-date">
                {newsAudio[currentAudioIndex]?.date || "Date unavailable"}
              </div>
            </div>
            <div className="date-separator" />
          </div>

          <audio
            ref={audioRef}
            src={newsAudio[currentAudioIndex]?.audioUrl}
            onEnded={handleAudioEnd}
            style={{ display: 'none' }}
          />
        </>
      ) : (
        <div className="audio-player-no-content">
          <p>No audio news available</p>
          <p>Check console logs for debugging info</p>
        </div>
      )}
    </div>
  );
}

NewsAudioPlayer.propTypes = {
  className: PropTypes.string,
};

export default NewsAudioPlayer;