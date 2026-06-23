import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getScooters } from "../services/api.js";
import { scooterImages } from "../constants/images.js";
import "./Home.css";
import { initLenis } from "../utils/lenis.js";

gsap.registerPlugin(ScrollTrigger);

const FOUNDER_IMG = "/images/founder.jpg";

const VERSIONS = [
  { key: "scooter1", label: "V1", version: "NVX 155 VVA V1" },
  { key: "scooter2", label: "V2", version: "NVX 155 VVA V2" },
  { key: "scooter3", label: "V3", version: "NVX 155 VVA V3" },
];

function Home() {
  const [scooters, setScooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const heroRef = useRef(null);
  const heroLeftRef = useRef(null);
  const heroImgRef = useRef(null);
  const scooterSectionRef = useRef(null);
  const headerRef = useRef(null);
  const blobsRef = useRef([]);

  useEffect(() => {
    getScooters().then((data) => {
      setScooters(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;

    const lenis = initLenis();
    const ctx = gsap.context(() => {

      // ── Entrance animations ──
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

      // ── Hero scrub — chỉ kích hoạt khi scroll vào vùng trigger ──
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "30% top",
        end: "70% top",
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;

          // Left: trượt sang trái + fade
          gsap.set(heroLeftRef.current, {
            x: -200 * p,
            opacity: 1.5 - p * 2.75,
          });

          // Image: trượt sang phải + fade
          gsap.set(heroImgRef.current, {
            x: 200 * p,
            opacity: 1.5 - p * 2.75,
          });

          // Eyebrow: lên trên + fade
          gsap.set(".hero-eyebrow", {
            y: -200 * p,
            opacity: 1.5 - p * 2.75,
          });

          // Title: xuống dưới + fade
          gsap.set(".hero-title", {
            y: 200 * p,
            opacity: 1.5 - p * 2.75,
          });

          // Desc + tags + actions: xuống + fade
          gsap.set([".hero-desc", ".hero-tags", ".hero-actions"], {
            y: 200 * p,
            opacity: 1.5 - p * 2.75,
          });

          // Scroll hint: fade sớm hơn
          gsap.set(".scroll-hint", {
            opacity: Math.max(0, 1 - p * 3),
          });
        },
      });

      // ── Section 2 — set initial ──
      gsap.set(".section-eyebrow-line", { yPercent: 110, opacity: 0 });
      gsap.set(".section-title-chars", { yPercent: 100, opacity: 0, rotateX: -90 });
      gsap.set(".section-sub", { opacity: 0, letterSpacing: "0.5em" });
      gsap.set(".scooter-main-display", { opacity: 0, y: 30 });
      gsap.set(".scooter-card", { opacity: 0, y: 40 });

      // ── Section 2 — timeline ──
      gsap.timeline({
        scrollTrigger: {
          trigger: scooterSectionRef.current,
          start: "top 30%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      })
      .to(".section-eyebrow-line", {
        yPercent: 0, opacity: 1,
        duration: 0.65, ease: "power4.out",
      })
      .to(".section-title-chars", {
        yPercent: 0, opacity: 1, rotateX: 0,
        duration: 0.75, stagger: 0.04, ease: "power4.out",
      }, "-=0.35")
      .to(".section-sub", {
        opacity: 1, letterSpacing: "0.1em",
        duration: 0.9, ease: "power3.out",
      }, "-=0.5")
      .to(".scooter-main-display", {
        opacity: 1, y: 0,
        duration: 0.7, ease: "power3.out",
      }, "-=0.5")
      .to(".scooter-card", {
        opacity: 1, y: 0,
        duration: 0.55, stagger: 0.1, ease: "power3.out",
      }, "-=0.4");

    });

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, [loading]);


  if (loading) {
    return (
      <main className="home-main-loading">
        <div className="loading-spinner" />
      </main>
    );
  }

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

      {/* Header */}
      <header className="home-header" ref={headerRef}>

        <nav className="home-header-nav">
          <Link to="/">Story</Link>
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
            DTH Scooter Team is a community of NVX enthusiasts in Ho Chi Minh City.
            From fairings, wheels, and suspension setups to exhaust systems — every scooter tells a different story,
            built around refined aesthetics, quality craftsmanship, and a clean, compact design philosophy.
          </p>

          <div className="anim-child hero-tags">
            <span className="tag">NVX 155 VVA</span>
            <span className="tag">Street Build</span>
            <span className="tag">DTH SCOOTER TEAM</span>
          </div>

          <div className="anim-child hero-actions">
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
                <div className="birthday-date">28 May 1982</div>
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
          <div className="section-eyebrow-wrap">
            <p className="section-eyebrow-line">The Builds</p>
          </div>
          <div className="section-title-wrap">
            <h2 className="section-title-line">
              {"NVX 155 VVA".split("").map((char, i) => (
                <span
                  key={i}
                  className="section-title-chars"
                  style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
          </div>
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
                onClick={() => setActiveIdx(i)}
              >
                <div className="scooter-card-img-wrap">
                  <img src={imgs?.thumbnail} alt={v.version} className="scooter-card-img" />
                </div>
                <div className="scooter-card-info">
                  <span className="scooter-card-label">{v.label}</span>
                  <span className="scooter-card-version">{v.version}</span>
                </div>
                {sc && (
                  // <Link to={`/gallery/${sc._id}`} className="scooter-card-link">
                  <Link to={`/gallery/${sc.slug}`} className="scooter-card-link">
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
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;