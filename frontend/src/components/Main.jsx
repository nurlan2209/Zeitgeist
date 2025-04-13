import PropTypes from "prop-types";
import { useNews } from "../service/NewsContext";
import "./Main.css";

function Main({ className = "", newsId}) {
    const { getNewsById } = useNews();
    const newsItem = getNewsById(newsId);

    if (!newsItem) return null;


  return (
      <div className={`main ${className}`}>
          <img
              alt=""
              className="main-article-background"
              src="/main-article-background.svg"
          />

          <div className="main-article-image" style={{backgroundImage: `url(${newsItem.image})`}} />

          <div className="main-article-content">
              <div className="frame-group">
                  <div className="main-article-title-wrapper">
                      <div className="main-article-title">
                          <img
                              alt=""
                              className="title-icon"
                              loading="lazy"
                              src="/vector-1.svg"
                          />

                          <h2 className="israel-the">
                            {newsItem.category}
                          </h2>
                      </div>
                  </div>

                  <div className="main-article-description">
                      <div className="description-container">
                          <h1 className="their-time-is">
                          {newsItem.title}
                          </h1>

                          <p className="the-murder-of">
                          {newsItem.description}
                          </p>
                      </div>

                      <div className="author-container">
                          <p className="by-liel-leibovitz">
                            BY {newsItem.author}
                          </p>
                      </div>
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
