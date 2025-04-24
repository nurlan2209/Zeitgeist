import PropTypes from "prop-types";
import "./Component2.css";
import { useNews } from "../../service/NewsContext";

function Component2({ className = "", newsId }) {
  const { getNewsById } = useNews();
  const newsItem = getNewsById(newsId);

  if (!newsItem) return null;

  return (
    <div className={`div2 ${className}`}>
      <div className="first-news-container flex-container">
        <div className="first-news-content flex-container">
          <div className="first-news-item flex-container">
            <div className="first-news-details flex-container">
              <div className="first-news-heading flex-container">
                <div className="title flex-container">
                  <h2 className="news_text-base">{newsItem.category}</h2>
                  <div className="news-line" />
                </div>
              </div>
              <div className="first-news-author flex-container">
                <h1 className="news-title text-base">{newsItem.title}</h1>
                <b className="news-author text-base">BY {newsItem.author}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img alt="" className="second-news-image" loading="lazy" src="/vector-8.svg" />
    </div>
  );
}

Component2.propTypes = {
  className: PropTypes.string,
  newsId: PropTypes.number.isRequired,
};

export default Component2;