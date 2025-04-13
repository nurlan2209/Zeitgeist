import PropTypes from "prop-types";
import "./FrameComponent.css";
import { useNews } from "../../service/NewsContext";

function FrameComponent({ className = "", newsId}) {
    const { getNewsById } = useNews();
    const newsItem = getNewsById(newsId);
    
    if (!newsItem) return null;
    

  return (
      <div className={`repeated-news-structure-parent ${className}`}>
          <div className="repeated-news-structure">
              <div className="nested-news-item">
                  <div className="nested-news-details">
                      <div className="nested-news-elements">
                          <div className="title3">
                              <div className="nested-news-title-container">
                                  <h2 className="news3">
                                    {newsItem.category}
</h2>
                              </div>

                              <div className="news-line6" />
                          </div>
                      </div>

                      <div className="nested-news-author-info">
                          <h1 className="news-title">
                              {newsItem.title}
                          </h1>

                          <h3 className="description3">
                              {newsItem.descreption}
                          </h3>

                          <b className="by-shayahmet-z4">
                              BY {newsItem.author}
                          </b>
                          <b className="by-shayahmet-z4">
                              BY {newsItem.date}
                          </b>
                      </div>
                  </div>
              </div>

              <img
                  alt=""
                  className="second-nested-news-item"
                  loading="lazy"
                  src="/vector-16.svg"
              />
          </div>

          <div className="third-nested-news">
              <div className="third-nested-news-container">
                  <div className="third-nested-news-content">
                      <div className="third-nested-item">
                          <div className="third-nested-elements">
                              <div className="third-news-details">
                                  <div className="title3">
                                      <h2 className="news">
                                        {newsItem.category}
                                  </h2>

                                      <div className="news-line6" />
                                  </div>
                              </div>

                              <div className="third-news-author">
                                  <h1 className="titels6">
                                      {newsItem.title}
                              </h1>

                                  <h3 className="description4">
                                      {newsItem.descreption}
                              </h3>
                              </div>
                          </div>

                          <b className="by-shayahmet-z5">
                              BY {newsItem.author}
                          </b>
                      </div>
                  </div>

                  <img
                      alt=""
                      className="second-nested-news-item"
                      loading="lazy"
                      src="/vector-16.svg"
                  />
              </div>
          </div>

          <div className="side-news-block">
              <div className="side-news-background" />

              <div className="side-news-content1">
                  <div className="side-news-container">
                      <div className="title5">
                          <h2 className="news">
                             {newsItem.category}
                          </h2>

                          <div className="news-line6" />
                      </div>

                      <div className="side-news-names">
                          <h1 className="titels7">
                              {newsItem.title}
                          </h1>

                          <h3 className="description5">
                              {newsItem.descreption}
                          </h3>
                      </div>
                  </div>

                  <b className="by-shayahmet-z5">
                      BY {newsItem.author}
                  </b>
              </div>
          </div>

          <div className="repeated-news-structure1">
              <img
                  alt=""
                  className="second-nested-news-item"
                  loading="lazy"
                  src="/vector-16.svg"
              />

              <div className="second-nested-news-details-wrapper">
                  <div className="second-nested-news-details">
                      <div className="second-nested-news-elements">
                          <div className="title5">
                              <h2 className="news">
                                {newsItem.category}
                              </h2>

                              <div className="news-line6" />
                          </div>

                          <h1 className="titels8">
                              {newsItem.title}
                          </h1>
                      </div>

                      <div className="second-nested-description">
                          <h3 className="description6">
                              {newsItem.descreption}
                          </h3>
                      </div>

                      <b className="by-shayahmet-z5">
                          BY {newsItem.author}
                      </b>
                  </div>
              </div>
          </div>
      </div>
  );
}

FrameComponent.propTypes = {
  className: PropTypes.string,
  newsId: PropTypes.number.isRequired,
};

export default FrameComponent;
