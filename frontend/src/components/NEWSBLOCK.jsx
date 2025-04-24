import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useNews } from "../service/NewsContext.jsx";
import "./NEWSBLOCK.css";

function NEWSBLOCK({ className = "", newsId }) {
  const { getNewsById } = useNews();
  const newsItem = getNewsById(newsId);

  if (!newsItem) return null;

  // Форматирование времени добавления
  const formatCreatedAt = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long"
    }) + ", " + date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Link to={`/news/${newsId}`} className="news-block-link">
      <div className={`news-block ${className}`}>
        <h2 className="news1">
          {newsItem.category}
        </h2>

        <div className="news-line2" />
        <h1 className="titels1">
          {newsItem.title}
        </h1>

        {/* Добавляем время публикации статьи */}
        {newsItem.created_at && (
          <div className="news-created-at">
            {formatCreatedAt(newsItem.created_at)}
          </div>
        )}

        <h3 className="description">
          {newsItem.description}
        </h3>

        <b className="author">
          BY {newsItem.author}
        </b>
      </div>
    </Link>
  );
}

NEWSBLOCK.propTypes = {
  className: PropTypes.string,
  newsId: PropTypes.number.isRequired,
};

export default NEWSBLOCK;