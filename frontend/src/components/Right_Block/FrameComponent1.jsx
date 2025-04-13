import NEWS_left from "../Left_Block/NEWS_left";
import Kurs from "../Listen/Kurs";
import Main from "../Main";
import NewsAudioPlayer from "../Listen/NewsAudioPlayer";
import PropTypes from "prop-types";
import "./FrameComponent1.css";
import { useNews } from "../../service/NewsContext";

function FrameComponent1({ className = "" }) {
    const { loading, news } = useNews();

    if (loading) {
      return <div>Loading news content...</div>;
    }

    // Получаем неиспользуемые короткие новости, исключая те, что уже распределены в RevolutionBanner
    const isShortNews = (newsItem) => newsItem.description.length < 100 && newsItem.title.length < 100;
    
    // Предположим, что первые 7 коротких новостей уже используются в RevolutionBanner
    const usedNewsIds = news.filter(isShortNews).slice(0, 7).map(item => item.id);
    
    // Находим новости, которые ещё не использовались
    const unusedNews = news.filter(item => !usedNewsIds.includes(item.id));
    
    // Если нет неиспользованных новостей, берем любые
    if (unusedNews.length === 0) {
      unusedNews.push(...news.slice(0, 3));
    }
    
    // Распределяем уникальные новости для каждого компонента
    const newsLeftId = unusedNews[0]?.id || 1;
    const mainNewsId = unusedNews[1]?.id || 2;
    const sideNewsId = unusedNews[2]?.id || 3;

    return (
      <section className={`news-right-container-parent ${className}`}>
          <div className="news-right-container">
              <div className="news-right-parent">
                  <NEWS_left newsId={newsLeftId} />
                  <Kurs property1="Variant2" />
              </div>
          </div>

          <Main newsId={mainNewsId} />

          <div className="banner-content">
              <div className="news-right1">
                  <div className="side-news-item">
                      <div className="side-news-content">
                          <div className="side-news-header">
                              {/* Используем sideNewsItem вместо topNewsItems[0] */}
                              <h2 className="news7">
                                  {news.find(item => item.id === sideNewsId)?.category || "NEWS"}
                              </h2>

                              <div className="news-line1" />
                          </div>

                          <h1 className="titels6">
                              {news.find(item => item.id === sideNewsId)?.title || "Default Title"}
                          </h1>
                      </div>

                  </div>

                  <b className="by-shayahmet-z8">
                      BY {news.find(item => item.id === sideNewsId)?.author || "Author"}
                  </b>

                  <img
                      alt=""
                      className="side-news-icon"
                      src="/vector-5.svg"
                  />
              </div>

              <NewsAudioPlayer />
          </div>
      </section>
    );
}

FrameComponent1.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent1;