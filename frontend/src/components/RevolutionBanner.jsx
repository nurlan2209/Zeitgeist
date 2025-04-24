import { useNews } from "../service/NewsContext";
import NEWSBLOCK from "./NEWSBLOCK";
import NewsEventsCalendar from "./NewsEventsCalendar";
import Collection from "./Collection/Collection";
import Component2 from "./Left_Block/Component2";
import Component3 from "./Left_Block/Component3";
import Component4 from "./Right_Block/Component4";
import PropTypes from "prop-types";
import "./RevolutionBanner.css";

function RevolutionBanner({ className = "" }) {
  const { loading, news } = useNews();

  if (loading) {
    return <div>Loading news content...</div>;
  }

  // Функция для определения коротких новостей (где описание меньше определенной длины)
  const isShortNews = (newsItem) => newsItem.description.length < 100 && newsItem.title.length < 30;
  
  // Получаем все короткие новости
  const shortNews = news.filter(isShortNews);
  
  // Если коротких новостей недостаточно, добавляем самые короткие из оставшихся
  if (shortNews.length < 7) {
    const remainingNews = news
      .filter(item => !isShortNews(item))
      .sort((a, b) => a.description.length - b.description.length);
    
    shortNews.push(...remainingNews.slice(0, 7 - shortNews.length));
  }
  
  // Распределяем короткие новости на разные компоненты
  const swiperNewsIds = shortNews.slice(0, 3).map(item => item.id || 1);
  const component2NewsId = shortNews[7]?.id;
  const component3NewsId = shortNews[6]?.id;
  
  // Если каким-то новостям не хватило ID, используем резервные
  const fallbackNewsId = news.find(item => !swiperNewsIds.includes(item.id) &&
                                          item.id !== component2NewsId &&
                                          item.id !== component3NewsId)?.id || 1;

  return (
    <section className={`revolution-banner ${className}`}>
      <div className="news-block-container">
        <div className="twitter-name">
          {/* Слайдер с первыми 5 короткими новостями */}
          <NewsEventsCalendar newsIds={swiperNewsIds} />
        </div>

        <div className="collection-block">
          <Collection collectionId={1} />

          <div className="side-news-block1">
            <div className="side-news-container1">
              <div className="side-news-content2">
                {component2NewsId ? (
                  <Component2 newsId={component2NewsId} />
                ) : (
                  <Component2 newsId={fallbackNewsId} />
                )}
                {component3NewsId ? (
                  <Component3 newsId={component3NewsId} />
                ) : (
                  <Component3 newsId={fallbackNewsId} />
                )}
              </div>

              <div className="main-side-news">
                {component2NewsId ? (
                  <Component4 newsId={component2NewsId} />
                ) : (
                  <Component4 newsId={fallbackNewsId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

RevolutionBanner.propTypes = {
  className: PropTypes.string,
};

export default RevolutionBanner;