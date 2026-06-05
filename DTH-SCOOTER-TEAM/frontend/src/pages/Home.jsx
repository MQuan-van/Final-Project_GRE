import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { getScooters } from "../services/api.js";
import { scooterImages } from "../constants/images.js";
import "./Home.css";
    // import { motion } from "framer-motion";
import { motion, useMotionValue, useSpring } from "framer-motion";

function Home() {
  const [scooters, setScooters] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const detailRefs = useRef([]);
  const navigate = useNavigate();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
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
      }, 150);
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

    const rotateYValue = ((x / rect.width) - 0.5) * 12;
    const rotateXValue = -((y / rect.height) - 0.5) * 12;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
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
            </div>
          </div>
          <div className="home-right-content">
            {activeScooter && (
              <>
                <div className="home-showcase">
                  <div className="home-indicators-vertical">
                    {scooters.map((scooter, index) => (
                      <button
                        key={scooter._id}
                        type="button"
                        onClick={() => changeScooter(index)}
                        className={`home-indicator ${
                          index === activeIndex ? "active" : ""
                        }`}
                      >
                        {`NVX VVA 155 V${index + 1}`}
                      </button>
                    ))}
                  </div>
                  <div
                    className="home-image-wrapper"
                      onMouseEnter={() => setIsHover(true)}
                      onMouseMove={handleMouseMove}
                  >
                    {/* IMAGE */}
                    <div className="home-main-image">
                      <motion.img
                        layoutId={`image-${activeScooter._id}`}
                        src={currentImage?.thumbnail}
                        alt={activeScooter?.version}
                        className={isChanging ? "changing" : ""}

                        style={{
                          rotateX,
                          rotateY,
                          transformPerspective: 1200,
                          transformStyle: "preserve-3d",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 18,
                        }}
                      />
                    </div>
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
