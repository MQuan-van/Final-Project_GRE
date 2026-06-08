
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
  // const scooterRef = useRef(null);
  const shineRef = useRef(null);
  const s1 = useRef(null); const s2 = useRef(null);
  const s3 = useRef(null); const s4 = useRef(null); const s5 = useRef(null);
  const r1 = useRef(null); const r2 = useRef(null); const r3 = useRef(null);
  const shineLoop = useRef(null);
  const reschedule = useRef(null);

  function startShine() {
    if (shineLoop.current) shineLoop.current.kill();
    shineLoop.current = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    shineLoop.current
      .set(shineRef.current, { left: '-40%', opacity: 1 })
      .to(shineRef.current, { left: '140%', duration: 1.2, ease: 'power1.inOut' })
      .set(shineRef.current, { left: '-40%' })
      .to(shineRef.current, { left: '140%', duration: 1.2, ease: 'power1.inOut', delay: 0.1 });
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
    [s1, s2, s3, s4, s5].forEach(r => {
      r.current?.setAttribute('stroke-dashoffset', '26');
    });
    [r1, r2, r3].forEach(r => gsap.set(r.current, { opacity: 0 }));

    // 1. DTH scramble
    scramble(dthRef.current, 'DTH SCOOTER TEAM', 2000, () => {

      // 2. Slashes vẽ
      [s1, s2, s3, s4, s5].forEach((r, i) => {
        gsap.to(r.current, {
          attr: { 'stroke-dashoffset': 0 },
          duration: 0.22, delay: i * 0.07, ease: 'power2.out'
        });
      });

      // 3. Rects pop in
      setTimeout(() => {
        gsap.to(r1.current, { opacity: 1, duration: 0.15 });
        setTimeout(() => gsap.to(r2.current, { opacity: 1, duration: 0.15 }), 100);
        setTimeout(() => gsap.to(r3.current, { opacity: 1, duration: 0.15 }), 200);
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
      <div className="welcome-logo">
        {/* DTH */}
        <div className="welcome-dth" ref={dthRef}>DTH SCOOTER TEAM</div>

        {/* Bar row */}
        <div className="welcome-bar-row">
          <svg width="290" height="32" viewBox="0 0 290 32" className="welcome-bar-svg">
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#880000"/>
                <stop offset="50%" stopColor="#ee0000"/>
                <stop offset="100%" stopColor="#aa0000"/>
              </linearGradient>
              <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#bbbbbb"/>
                <stop offset="50%" stopColor="#ffffff"/>
                <stop offset="100%" stopColor="#cccccc"/>
              </linearGradient>
            </defs>
            <line ref={s1} x1="6"   y1="28" x2="16"  y2="4" stroke="url(#rg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="26" strokeDashoffset="26"/>
            <line ref={s2} x1="20"  y1="28" x2="30"  y2="4" stroke="url(#rg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="26" strokeDashoffset="26"/>
            <line ref={s3} x1="34"  y1="28" x2="44"  y2="4" stroke="url(#rg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="26" strokeDashoffset="26"/>
            <line ref={s4} x1="48"  y1="28" x2="58"  y2="4" stroke="url(#rg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="26" strokeDashoffset="26"/>
            <rect ref={r1} x="64"  y="7"  width="22" height="16" rx="2" fill="url(#rg)" opacity="0"/>
            <rect ref={r2} x="92"  y="5"  width="80" height="20" rx="2.5" fill="url(#wg)" opacity="0"/>
            <rect ref={r3} x="178" y="7"  width="22" height="16" rx="2" fill="url(#rg)" opacity="0"/>
            <line ref={s5} x1="206" y1="28" x2="216" y2="4" stroke="url(#rg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="26" strokeDashoffset="26"/>
          </svg>
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