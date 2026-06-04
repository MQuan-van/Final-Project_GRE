import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScooterById } from "../services/api.js";
import "./Gallery.css";
import { motion } from "framer-motion";

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

  // if (loading) {
  //   return (
  //     <main className="gallery-main-loading">
  //       <div className="gallery-loading-spinner" />
  //     </main>
  //   );
  // }
  if (loading) {
    return (
      <main className="gallery-main-loading">
        <div className="gallery-loading-spinner" />
      </main>
    );
}  const images = scooter.images || [];
console.log(scooter._id);  
return (
    <motion.main
        className="gallery-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 3 }}
      >
      <motion.section className="gallery-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}

              >
        <motion.header className="gallery-header">
          <Link to="/" className="gallery-back-link">
            <span className="gallery-back-arrow">↖</span>
            <span>Back</span>
          </Link>
          {/* <motion.span
            layoutId={`title-${scooter._id}`}
            className="gallery-version"
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              }}
            >
              {scooter.version}
          </motion.span> */}
        </motion.header>

        <div className="gallery-title-section">
          <motion.h1
            layoutId={`title-${scooter._id}`}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="gallery-title"
          >
            {scooter.version}
          </motion.h1>
          <motion.img
            layoutId={`image-${scooter._id}`}
            src={scooter.thumbnail}
            alt={scooter.version}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            className="gallery-hero-image"
          />
          <motion.p
            className="gallery-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.5
            }}
          >
            {scooter.description}
          </motion.p>
        </div>

        <motion.div className="gallery-grid"
                      initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.6
              }}
            >
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
        </motion.div>
      </motion.section>
    </motion.main>
  );
}

export default Gallery;
