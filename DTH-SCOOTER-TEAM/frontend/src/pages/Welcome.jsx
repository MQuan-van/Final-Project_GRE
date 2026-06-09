
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./Welcome.css";

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

function scramble(el, target, ms, done) {
  let f = 0, tot = Math.floor(ms / 16);
  el.style.opacity = 1;
  const iv = setInterval(() => {
    f++;
    const prog = f / tot;
    const rev = Math.floor(prog * target.length);
    let r = '';
    for (let i = 0; i < target.length; i++) {
      if (target[i] === ' ') { r += ' '; continue; }
      r += i < rev ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = r;
    if (f >= tot) { clearInterval(iv); el.textContent = target; if (done) done(); }
  }, 8);
}

export default function Welcome() {
  const navigate = useNavigate();
  const dthRef = useRef(null);
  const shineRef = useRef(null);
  const centerLine = useRef(null);
  const lineShine = useRef(null);
  const shineLoop = useRef(null);
  const reschedule = useRef(null);

  function startShine() {
    if (shineLoop.current) shineLoop.current.kill();

    // Main screen shine
    shineLoop.current = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    shineLoop.current
      .set(shineRef.current, { left: '-40%', opacity: 1 })
      .to(shineRef.current, { left: '140%', duration: 1.2, ease: 'power1.inOut' })
      .set(shineRef.current, { left: '-40%' })
      .to(shineRef.current, { left: '140%', duration: 1.2, ease: 'power1.inOut', delay: 0.1 });

    // Line shine — đốm trắng chạy trên line đỏ, sync cùng timing
    gsap.set(lineShine.current, { opacity: 1 });
    gsap.fromTo(lineShine.current,
      { attr: { x1: -100, x2:-20 } },
      {
        attr: { x1: 1400, x2: 1480 },
        duration: 1.8,
        ease: 'power1.inOut',
        repeat: -1,
        repeatDelay: 2,
      }
    );
  }

  function scheduleRescramble() {
    reschedule.current = setTimeout(() => {
      scramble(dthRef.current, 'DTH SCOOTER TEAM', 2000, () => {
        scheduleRescramble();
      });
    }, 10000);
  }

  function playIntro() {
    // Reset initial states
    gsap.set(dthRef.current, { opacity: 0 });
    // gsap.set(scooterRef.current, { opacity: 0 });
    gsap.set(shineRef.current, { left: '-40%', opacity: 0 });
    gsap.set(centerLine.current, {
      attr: { 'stroke-dashoffset': '1400' }
    });
    // 1. DTH scramble
    scramble(dthRef.current, 'DTH SCOOTER TEAM', 2000, () => {
      setTimeout(() => {
        // gsap.to(centerLine.current, {
        //   attr: {
        //     "stroke-dashoffset": 0
        //   },
        //   duration: 0.8,
        //   ease: "power2.out"
        // });
        gsap.to(centerLine.current, {
          attr: { 'stroke-dashoffset': 0 },
          duration: 0.8,
          ease: "power2.out"
        });
      }, 380);
      // 5. Shine loop
        setTimeout(startShine, 300);
        scheduleRescramble();
    });
  }

  useEffect(() => {
    playIntro();
    return () => {
      clearTimeout(reschedule.current);
      if (shineLoop.current) shineLoop.current.kill();
    };
  }, []);

  return (
    <main className="welcome-main">
      <div className="welcome-shine" ref={shineRef} />

      {/* Logo center */}
      <div className="welcome-logo"> {/* DTH */}
        <div className="welcome-text-wrap">
          <div className="welcome-dth" ref={dthRef}>DTH SCOOTER TEAM</div>{/* Bar row */}
          <div className="welcome-bar-row">
            <svg width="100%" 
              height="32" 
              viewBox="0 0 1400 32" 
              preserveAspectRatio="none" 
              className="welcome-bar-svg">
              <defs>
                <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#880000"/>
                  <stop offset="50%" stopColor="#ee0000"/>
                  <stop offset="100%" stopColor="#aa0000"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <line
                ref={centerLine}
                x1="0"
                y1="16"
                x2="1400"
                y2="16"
                stroke="red"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="1400"
                strokeDashoffset="1400"
              />
              <line
                ref={lineShine}
                x1="100"
                y1="16"
                x2="0"
                y2="16"
                stroke="#fff"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0"
                filter="url(#glow)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Nav footer giữ nguyên */}
      <footer className="wel-nav">
        <div className="nav-left">
          <a href="https://github.com/MQuan-van/Final-Project_GRE.git"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-text="GitHub">GitHub</a>
        </div>
        <div className="nav-center">
          <a href="https://www.facebook.com/profile.php?id=61574902900658"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-text="Facebook">Facebook</a>
          <a href="https://www.tiktok.com/@_dth568"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-text="Tiktok">Tiktok</a>
          <a href="https://www.facebook.com/nguyen.tien.hai.454888"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-text="Contact">Contact</a>
        </div>
        <div className="nav-right">
          <div className="nav-item" data-text="Home" onClick={() => navigate("/Home")}>Home</div>
        </div>
      </footer>
    </main>
  );
}