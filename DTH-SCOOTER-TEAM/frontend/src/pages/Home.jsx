import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getScooters } from "../services/api.js";
import { scooterImages } from "../constants/images.js";
import "./Home.css";

function Home() {
  const [scooters, setScooters] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });

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
      }, 500);
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

    setTimeout(() => {
      setActiveIndex(newIndex);
      setTimeout(() => {
        setIsChanging(false);
      }, 50);

    }, 150);
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

  const scooterTitles = [
    "NVX 155 VVA V1",
    "NVX 155 VVA V2",
    "NVX 155 VVA V3",
  ];

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

    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = -((y / rect.height) - 0.5) * 3;

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

  // const prevImage =
  //   scooterImages[
  //     `scooter${Math.max(1, activeIndex)}`
  //   ];

  // const nextImage =
  //   scooterImages[
  //     `scooter${Math.min(3, activeIndex + 2)}`
  //   ];

  return (
    <main className="home-main">
      <div className="home-gradient-overlay" />
      <div className="home-linear-overlay" />

      <section className="home-section">
        <div className="home-grid">
          <div className="home-left-content">
            <div className="home-title-wrapper">
              <h1 className="home-title">
                DTH <br className="sm:hidden" /> Scooter Team
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
                    onClick={() => changeScooter(index)}                    className={`home-indicator ${
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
                  <div 
                    className="home-image-wrapper"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}>
                    <Link
                      to={`/gallery/${activeScooter._id}`}
                      className="home-main-image"
                    >
                      <img
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
                    </Link>

                    <h2 className="home-scooter-title">
                      {scooterTitles[activeIndex]}
                    </h2>
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
