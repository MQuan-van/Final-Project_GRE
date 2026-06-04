import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { getScooters } from "../services/api.js";
import { scooterImages } from "../constants/images.js";
import "./Home.css";
import { motion } from "framer-motion";

function Home() {
  const [scooters, setScooters] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const detailRefs = useRef([]);
  const navigate = useNavigate();
  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });
  const scrollToCurrentDetail  = () => {
    detailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleViewDetails = () => {
    navigate(`/gallery/${activeScooter._id}`);
  };

  useEffect(() => {
    const loadScooters = async () => {
      const data = await getScooters();
      setScooters(data);
      setLoading(false);
    };

    loadScooters();
  }, []);

  // xử lý để lấy scooter đang active dựa trên activeIndex, nếu không có thì lấy scooter đầu tiên làm mặc định
  useEffect(() => {
    const handleWheel = (e) => {
      if (scooters.length === 0) return;

      if (isScrolling) return;

      setIsScrolling(true);

      if (e.deltaY > 0) {
        changeScooter(
          Math.min(activeIndex + 1, scooters.length - 1)
        );
      } else {
        changeScooter(
          Math.max(activeIndex - 1, 0)
        );
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 50);
    };
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scooters.length, activeIndex, isScrolling]);

  const [isChanging, setIsChanging] = useState(false);  
  const changeScooter = (newIndex) => {
    if (newIndex === activeIndex) return;

    setIsChanging(true);

    requestAnimationFrame(() => {
      setActiveIndex(newIndex);

      setTimeout(() => {
        setIsChanging(false);
      }, 600); // đủ thời gian animation chạy
    });
  };

  const activeScooter = useMemo(() => {
    return scooters[activeIndex] || scooters[0];  
  }, [activeIndex, scooters]);
  // sự kiện lăn chuột sẽ thay đổi activeIndex để chuyển ảnh
  const currentImage =
  activeIndex === 0
    ? scooterImages.scooter1
    : activeIndex === 1
    ? scooterImages.scooter2
    : scooterImages.scooter3;

  // const scooterTitles = [
  //   "NVX 155 VVA V1",
  //   "NVX 155 VVA V2",
  //   "NVX 155 VVA V3",
  // ];

  if (loading) {
    return (
      <main className="home-main-loading">
        <div className="loading-spinner" />
      </main>
    );
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = -((y / rect.height) - 0) ;

    setRotate({
      x: rotateX,
      y: rotateY,
    });
  };
  const handleMouseLeave = () => {
    setRotate({
      x: 0,
      y: 0,
    });
  };
console.log(activeScooter._id);  return (
    <main className="home-main">
      <div className="home-gradient-overlay" />
      <div className="home-linear-overlay" />

      <section className="home-section">
        <div className="home-grid">
          <div className="home-left-content">
            <div className="home-title-wrapper">
              <h1 className="home-title">
                DTH Scooter Team
              </h1>
            </div>

            <div className="home-tags">
              {["FANPAGE", "TIKTOK"].map((tag) => (
                <span
                  key={tag}         
                  className="home-tag"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="home-buttons">
              <Link
                to={`/gallery/${activeScooter._id}`}
                className="home-btn-gallery"
              >
                Explore Gallery
              </Link>
              <div className="home-indicators">
                 {scooters.map((scooter, index) => (
                  <button
                    key={scooter._id}
                    type="button"
                    onClick={() => changeScooter(index)}
                    className={`home-indicator ${
                      index === activeIndex ? "active" : ""
                    }`}
                  >
                    V{index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="home-right-content">
            {activeScooter && (
              <>
                <div className="home-showcase">
                  <div className="home-thumbnails">
                    {[1, 2, 3].map((num, index) => (
                      <div
                        key={num}
                        className={`home-thumb ${
                          activeIndex === index ? "active" : ""
                        }`}
                          onClick={() => changeScooter(index)}                      >
                        <img
                          src={scooterImages[`scooter${num}`]?.thumbnail}
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                  {/* <div className="home-image-wrapper"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}>
                      <div className="home-main-image"
                        onClick={handleViewDetails} >
                        <motion.img
                              layoutId={`image-${activeScooter._id}`}
                              transition={{
                                duration: 0.9,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                        className={isChanging ? "changing" : ""}
                        src={currentImage?.thumbnail}
                        alt={activeScooter?.version}
                                                style={{
                            transform: `
                              perspective(1200px)
                              rotateX(${rotate.x}deg)
                              rotateY(${rotate.y}deg)
                              scale(1)
                            `,
                          }}
                      />
                      <div className="home-hover-details">
                        View Details →
                      </div>
                    </div>
                    <motion.h2
                      layoutId={`title-${activeScooter._id}`}
                      transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="home-scooter-title"
                    >
                      {activeScooter.version}
                    </motion.h2>
                  </div> */}
                  <div
                    className="home-image-wrapper"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >

                    {/* IMAGE */}
                    <div className="home-main-image" onClick={handleViewDetails}>
                      <motion.img
                        layoutId={`image-${activeScooter._id}`}
                        transition={{
                          duration: 0.9,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={isChanging ? "changing" : ""}
                        src={currentImage?.thumbnail}
                        alt={activeScooter?.version}
                        style={{
                          transform: `
                            perspective(1200px)
                            rotateX(${rotate.x}deg)
                            rotateY(${rotate.y}deg)
                            scale(1)
                          `,
                        }}
                      />

                      <div className="home-hover-details">
                        View Details →
                      </div>
                    </div>

                    {/* TITLE - QUAN TRỌNG NHẤT */}
                    <motion.h2
                      layoutId={`title-${activeScooter._id}`}
                      transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="home-scooter-title"
                    >
                      {activeScooter.version}
                    </motion.h2>

                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
export default Home;
