import PropTypes from "prop-types";
import "./Component3.css";
import { useNews } from "../../service/NewsContext";

function Component3({ className = "" , newsId}) {
    const { getNewsById } = useNews();
    const newsItem = getNewsById(newsId);
    
    if (!newsItem) return null;
    
  return (
      <div className={`div3 ${className}`}>
          <div className="image-placeholder" style={{backgroundImage: `url(${newsItem.image})`}} />

          <div className="side-image-news-details">
              <div className="title2">
                  <h2 className="news">
                      {newsItem.category}
                  </h2>

                  <div className="news-line5" />
              </div>

              <div className="image-news-author">
                  <h1 className="titels4">
                      {newsItem.title}
                  </h1>
                  <div className="news-line6" >
                    <b className="by-shayahmet-zx1">
                        BY {newsItem.author}
                    </b>
                    <a href={newsItem.url}>
                        Подробнее
                    </a>
                </div>
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
