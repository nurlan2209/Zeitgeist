import PropTypes from "prop-types";
import "./Component4.css";
import { useNews } from "../../service/NewsContext";

function Component4({ className = "" , newsId}) {
    const { getNewsById } = useNews();
    const newsItem = getNewsById(newsId);
    
    if (!newsItem) return null;
    
  return (
      <div className={`div4 ${className}`}>
          <img
              alt=""
              className="featured-image-icon"
              loading="lazy"
              src="/vector-9.svg"
          />

          <div className="featured-content">
              <div className="featured-image-placeholder" style={{backgroundImage: `url(${newsItem.image})`}} />

              <div className="featured-details">
                  <div className="featured-news-item">
                      <div className="featured-description">
                          <div className="theme">
                              <h2 className="israel-the1">
                              {newsItem.category}
                              </h2>

                              <div className="theme-image">
                                  <img
                                      alt=""
                                      className="small-image-icon"
                                      src="/vector-1-1.svg"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="featured-title">
                          <h1 className="their-time-is1">
                            {newsItem.title}
                          </h1>
                      </div>

                      <div className="the-murder-of1">
                          <h3 className="the-murder-of">
                            {newsItem.description}
                          </h3>
                      </div>

                      <div className="featured-author">
                          <div className="by-liel-leibovitz1">
                              BY {newsItem.author}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}

Component4.propTypes = {
  className: PropTypes.string,
};

export default Component4;
