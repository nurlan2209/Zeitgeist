import PropTypes from "prop-types";
import { useNews } from "../../service/NewsContext";
import "./Collection.css";

function Collection({ className = "", collectionId = 1 }) {
  const { getCollectionById } = useNews();
  const collection = getCollectionById(collectionId);

  if (!collection) return null;

  return (
    <div className={`collection flex-container ${className}`}>
      <div className="collection-container flex-container">
        <div className="collection-content flex-container">
          <div className="collection-description flex-container">
            <div className="collection1 text-base">Collection</div>
            <h1 className="ukraine text-base">{collection.title}</h1>
          </div>
          <div className="ukraine-description flex-container">
            <div className="few-countries-over-container text-base">
              <h2>Few countries over the last 100 years can match Ukraine’s achievements in art, music, literature, and science; fewer still have suffered as much violence, war, and tragedy. Before it had a Jewish president and became a battlefield for the future of freedom and democracy, Ukraine occupied a central place in Jewish history for centuries—and still does today. As it fights a war for survival, Ukraine remains one of the most important countries for Jews, Americans, the West, and the world.</h2>
            </div>
          </div>
        </div>
      </div>
      <img
        alt={collection.title}
        className="collection-image-icon"
        loading="lazy"
        src={collection.image}
      />
    </div>
  );
}

Collection.propTypes = {
  className: PropTypes.string,
  collectionId: PropTypes.number,
};

export default Collection;