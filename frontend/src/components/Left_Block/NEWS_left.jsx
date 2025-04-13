import PropTypes from "prop-types";
import "./NEWS_left.css";
import { useNews } from "../../service/NewsContext";

function NEWS_left({ className = "" , newsId}) {
    const { getNewsById } = useNews();
    const newsItem = getNewsById(newsId);

    if (!newsItem) return null;
  return (
      <div className={`news-right ${className}`}>
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
          </div>


          <b className="by-shayahmet-z">
              BY {newsItem.author}
          </b>

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
