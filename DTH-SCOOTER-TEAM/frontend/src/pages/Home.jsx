import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { getScooters } from "../services/api.js";
import { scooterImages } from "../constants/images.js";
import "./Home.css";
import { initLenis } from "../utils/lenis.js";


const FOUNDER_IMG = "/images/founder.jpg";

const VERSIONS = [
  { key: "scooter1", label: "V1", version: "NVX 155 VVA V1" },
  { key: "scooter2", label: "V2", version: "NVX 155 VVA V2" },
  { key: "scooter3", label: "V3", version: "NVX 155 VVA V3" },
];

const TOTAL_STEPS = 4; // 0=hero, 1=V1, 2=V2, 3=V3

function Home() {
  const [scooters, setScooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  const heroRef = useRef(null);
  const heroLeftRef = useRef(null);
  const heroImgRef = useRef(null);
  const scooterSectionRef = useRef(null);
  const headerRef = useRef(null);
  const blobsRef = useRef([]);
  const isAnimating = useRef(false);

  useEffect(() => {
    getScooters().then((data) => {
      setScooters(data);
      setLoading(false);
    });
  }, []);

  // Entrance animation
  useEffect(() => {
    if (loading) return;

    gsap.to(blobsRef.current, {
      opacity: 1, duration: 2, stagger: 0.3, ease: "power2.out",
    });
    gsap.to(headerRef.current, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1,
    });
    const leftChildren = heroLeftRef.current?.querySelectorAll(".anim-child");
    gsap.to(leftChildren, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.13, ease: "power4.out", delay: 0.3,
    });
    gsap.to(heroImgRef.current, {
      opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.5,
    });
  }, [loading]);

  // Section transition khi step thay đổi
  useEffect(() => {
    if (loading) return;
    const hero = heroRef.current;
    const scooter = scooterSectionRef.current;

    if (step === 0) {
      gsap.to(hero, { y: "0%", duration: 0.9, ease: "power3.inOut" });
      gsap.to(scooter, { y: "100%", duration: 0.9, ease: "power3.inOut" });
    } else {
      gsap.to(hero, { y: "-100%", duration: 0.9, ease: "power3.inOut" });
      gsap.to(scooter, { y: "0%", duration: 0.9, ease: "power3.inOut" });
    }

    const timer = setTimeout(() => {
      isAnimating.current = false;
    }, 950);
    return () => clearTimeout(timer);
  }, [step, loading]);

  // Scroll hijack
  useEffect(() => {
    if (loading) return;
    const onWheel = (e) => {
      if (isAnimating.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      setStep((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= TOTAL_STEPS) return prev;
        isAnimating.current = true;
        return next;
      });
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [loading]);
  // Smooth scroll
  useEffect(() => {
    if (loading) return;
    const lenis = initLenis();
    return () => lenis.destroy();
  }, [loading]);

  if (loading) {
    return (
      <main className="home-main-loading">
        <div className="loading-spinner" />
      </main>
    );
  }

  const activeIdx = step === 0 ? 0 : step - 1;
  const activeScooter = scooters[activeIdx] || scooters[0];

  return (
    <main className="home-main">
      {/* Noise grain */}
      <div className="home-noise" />

      {/* Ambient blobs */}
      <div className="home-ambient">
        <div className="ambient-blob blob-1" ref={(el) => (blobsRef.current[0] = el)} />
        <div className="ambient-blob blob-2" ref={(el) => (blobsRef.current[1] = el)} />
      </div>

      {/* Progress dots */}
      <div className="progress-dots">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <button
            key={i}
            className={`progress-dot${step === i ? " active" : ""}`}
            onClick={() => {
              if (!isAnimating.current) {
                isAnimating.current = true;
                setStep(i);
              }
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="home-header" ref={headerRef}>
        <div className="home-header-logo">DTH Scooter Team</div>
        <nav className="home-header-nav">
          <div className="home-header-dot" />
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* ══ SECTION 1 — HERO ══ */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-left" ref={heroLeftRef}>
          <p className="anim-child hero-eyebrow">Founder of DTH Scooter Team</p>

          <h1 className="anim-child hero-title">
            Refined by Time<br />
            <span className="accent">Driven</span><br />
            by Innovation.
          </h1>

          <p className="anim-child hero-desc">
            DTH Scooter Team là cộng đồng những anh em mê NVX độ tại HCMC.
            Từ dàn áo, mâm, phuộc đến pô — mỗi chiếc xe là một câu chuyện riêng,
            được tạo ra bằng đam mê thật sự trên đường phố Sài Gòn.
          </p>

          <div className="anim-child hero-tags">
            <span className="tag">NVX 155 VVA</span>
            <span className="tag">Street Build</span>
            <span className="tag">DTH SCOOTER TEAM</span>
          </div>

          <div className="anim-child hero-actions">
            <button
              className="btn-primary"
              onClick={() => {
                if (!isAnimating.current) {
                  isAnimating.current = true;
                  setStep(1);
                }
              }}
            >
              Xem xe
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a
              href="https://www.facebook.com/nguyen.tien.hai.454888"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Fanpage
            </a>
          </div>
        </div>

        {/* Right — Founder image */}
        <div className="hero-right" ref={heroImgRef}>
          <div className="founder-img-wrap">
            <img src={FOUNDER_IMG} alt="Founder DTH" className="founder-img" />
            <div className="birthday-badge">
              <span className="birthday-icon">🎂</span>
              <div>
                <div className="birthday-label">Birthday</div>
                <div className="birthday-date">28 May</div>
              </div>
            </div>
            <div className="frame-line frame-tl" />
            <div className="frame-line frame-br" />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ SECTION 2 — SCOOTERS ══ */}
      <section className="scooter-section" ref={scooterSectionRef}>
        <div className="scooter-section-header">
          <p className="section-eyebrow">The Builds</p>
          <h2 className="section-title">NVX 155 VVA</h2>
          <p className="section-sub">Scroll để xem từng phiên bản</p>
        </div>

        {/* Main display */}
        <div className="scooter-main-display">
          {VERSIONS.map((v, i) => {
            const imgs = scooterImages[v.key];
            return (
              <img
                key={v.key}
                src={imgs?.thumbnail}
                alt={v.version}
                className={`scooter-main-img${i === activeIdx ? " visible" : ""}`}
              />
            );
          })}
          <div className="scooter-version-overlay">{VERSIONS[activeIdx]?.version}</div>
        </div>

        {/* Cards */}
        <div className="scooter-cards">
          {VERSIONS.map((v, i) => {
            const imgs = scooterImages[v.key];
            const sc = scooters[i];
            return (
              <div
                key={v.key}
                className={`scooter-card${i === activeIdx ? " active" : ""}`}
                onClick={() => {
                  if (!isAnimating.current) {
                    isAnimating.current = true;
                    setStep(i + 1);
                  }
                }}
              >
                <div className="scooter-card-img-wrap">
                  <img src={imgs?.thumbnail} alt={v.version} className="scooter-card-img" />
                </div>
                <div className="scooter-card-info">
                  <span className="scooter-card-label">{v.label}</span>
                  <span className="scooter-card-version">{v.version}</span>
                </div>
                {sc && (
                  <Link to={`/gallery/${sc._id}`} className="scooter-card-link">
                    Gallery →
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="scooter-dots">
          {VERSIONS.map((_, i) => (
            <button
              key={i}
              className={`dot${i === activeIdx ? " active" : ""}`}
              onClick={() => {
                if (!isAnimating.current) {
                  isAnimating.current = true;
                  setStep(i + 1);
                }
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;