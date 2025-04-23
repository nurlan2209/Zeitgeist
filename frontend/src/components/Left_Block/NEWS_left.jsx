
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./NEWS_left.css";
import { useNews } from "../../service/NewsContext.jsx";

function NEWS_left({ className = "" , newsId}) {
    const { getNewsById } = useNews();
    const newsItem = getNewsById(newsId);

    if (!newsItem) return null;
  return (
      <div className={`news-right ${className}`}>
          <Link to={`/news/${newsId}`} className="news-left-link">
            <div className="news-item">
                <div className="news-content">
                    <a className="news">
                        {newsItem.category}
                    </a>

                    <div className="news-lines" />
                </div>

                <h1 className="titels">
                    {newsItem.title}
                </h1>
                <b className="by-shayahmet-z">
                    BY {newsItem.author}
                </b>
            </div>
          </Link>
          <img
                alt=""
                className="news-icon"
                loading="lazy"
                src="/vector-5.svg"
            />
      </div>
  );
}

NEWS_left.propTypes = {
  className: PropTypes.string,
  newsId: PropTypes.number.isRequired,
};

export default NEWS_left;
