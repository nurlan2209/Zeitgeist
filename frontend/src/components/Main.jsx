import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useNews } from "../service/NewsContext.jsx";
import "./Main.css";

function Main({ className = "", newsId }) {
  const { getNewsById } = useNews();
  const newsItem = getNewsById(newsId);

  if (!newsItem) return null;

  // Function to truncate description text for smaller screens
  const truncateDescription = (text, maxLength = 250) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className={`main ${className}`}>
      <img
        alt=""
        className="main-article-background"
        src="/main-article-background.svg"
      />

      <Link to={`/news/${newsId}`} className="main-article-link">
        <div
          className="main-article-image" 
          style={{backgroundImage: `url(${newsItem.image})`}}
          aria-label={newsItem.title}
        />
      </Link>

      <div className="main-article-content">
        <div className="frame-group">
          <div className="main-article-title-wrapper">
            <div className="main-article-title">
              <h2 className="israel-the">
                {newsItem.category}
              </h2>
              <img
                alt=""
                className="title-icon"
                loading="lazy"
                src="/vector-1.svg"
              />
            </div>
          </div>

          <div className="main-article-description">
            <Link to={`/news/${newsId}`} className="main-article-title-link">
              <div className="description-container">
                <h1 className="their-time-is">
                  {newsItem.title}
                </h1>

                <p className="the-murder-of">
                  {truncateDescription(newsItem.description)}
                </p>
              </div>
              <div className="author-container">
                <p className="by-liel-leibovitz">
                  BY {newsItem.author}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Main.propTypes = {
  className: PropTypes.string,
  newsId: PropTypes.number.isRequired,
};

export default Main;