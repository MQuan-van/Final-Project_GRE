import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScooterById } from "../services/api.js";
import "./Gallery.css";

function Gallery() {
  const { id } = useParams();
  const [scooter, setScooter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScooter = async () => {
      const data = await getScooterById(id);
      setScooter(data);
      setLoading(false);
    };

    loadScooter();
  }, [id]);

  if (loading) {
    return (
      <main className="gallery-main-loading">
        <div className="gallery-loading-spinner" />
      </main>
    );
  }

  const images = scooter.images || [];

  return (
    <main className="gallery-main">
      <section className="gallery-section">
        <header className="gallery-header">
          <Link to="/" className="gallery-back-link">
            <span className="gallery-back-arrow">↖</span>
            <span>Back</span>
          </Link>
          <span className="gallery-version">{scooter.version}</span>
        </header>

        <div className="gallery-title-section">
          <h1 className="gallery-title">
            {scooter.name}
          </h1>
          <p className="gallery-description">
            {scooter.description}
          </p>
        </div>

        <div className="gallery-grid">
          {images.map((image) => (
            <article key={image._id || image.imageUrl} className="gallery-card">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="gallery-card-image"
              />
              <div className="gallery-card-content">
                <h2 className="gallery-card-title">{image.title}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Gallery;
