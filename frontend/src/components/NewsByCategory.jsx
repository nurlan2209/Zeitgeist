import React from "react";
import PropTypes from "prop-types";
import { useNews } from "../service/NewsContext";
import "./NewsByCategory.css";

const NewsCategory = ({ category, articles }) => {
  return (
    <div className="fnews-category">
      <div className="fcategory-header">
        <h2 className="fcategory-title">{category}</h2>
      </div>
      <div className="fcategory-articles">
        {articles.map((article) => (
          <div key={article.id} className="article-item">
            <h3 className="farticle-title">{article.title}</h3>
            <p className="farticle-author">BY {article.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function NewsByCategory() {
  const { loading, news } = useNews();

  // Group news by their categories
  const getNewsByCategory = () => {
    const categories = {};
    
    news.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    return categories;
  };

  if (loading) {
    return <div className="loading-news">Loading news content...</div>;
  }

  const newsByCategory = getNewsByCategory();

  return (
    <div className="fnews-by-category-container">
      <div className="fnews-categories-grid">
        {Object.keys(newsByCategory).map((category) => (
          <NewsCategory
            key={category}
            category={category}
            articles={newsByCategory[category].slice(0, 3)}
          />
        ))}
      </div>
    </div>
  );
}

NewsCategory.propTypes = {
  category: PropTypes.string.isRequired,
  articles: PropTypes.array.isRequired
};

export default NewsByCategory;