import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Component3.css";
import { useNews } from "../../service/NewsContext";

function Component3({ className = "", newsId }) {
  const { getNewsById } = useNews();
  const newsItem = getNewsById(newsId);
  
  if (!newsItem) return null;
  
  return (
    <div className={`div3 ${className}`}>
      <Link to={`/news/${newsId}`} className="news-detail-link">
        <div className="image-placeholder" style={{backgroundImage: `url(${newsItem.image})`}} />
      </Link>

      <div className="side-image-news-details">
        <div className="news-category-tag">
          {newsItem.category}
        </div>

        <Link to={`/news/${newsId}`} className="news-title-link">
          <h2 className="news-item-title">
            {newsItem.title}
          </h2>
        </Link>
        
        <p className="news-item-description">
          {newsItem.description ? (
            newsItem.description.length > 100 
              ? newsItem.description.substring(0, 100) + "..." 
              : newsItem.description
          ) : ""}
        </p>
        
        <div className="news-author-info">
          BY {newsItem.author}
        </div>
      </div>
    </div>
  );
}
Component3.propTypes = {
  className: PropTypes.string,
  newsId: PropTypes.number.isRequired,
};

export default Component3;
