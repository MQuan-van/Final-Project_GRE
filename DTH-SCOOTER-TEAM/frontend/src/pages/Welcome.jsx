
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
  const trap1Ref = useRef(null);
  const trap2Ref = useRef(null);
  const trap3Ref = useRef(null);
  const trap4Ref = useRef(null);
  const trap5Ref = useRef(null);
  const trapLineRef = useRef(null);
  const shineLoop = useRef(null);
  const reschedule = useRef(null);

  // function startShine() {
  //   if (shineLoop.current) shineLoop.current.kill();

  //   shineLoop.current = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    
  //   // Durations tăng dần cho 5 hình thang
  //   const durations = [0.6, 0.75, 0.9, 1.05, 1.2];
  //   const trapRefs = [trap1Ref, trap2Ref, trap3Ref, trap4Ref, trap5Ref];
    
  //   // Reset và vẽ từng hình thang
  //   trapRefs.forEach((ref, idx) => {
  //     gsap.set(ref.current, { attr: { 'stroke-dashoffset': ref.current.getAttribute('stroke-dasharray') } });
  //     shineLoop.current.to(ref.current, {
  //       attr: { 'stroke-dashoffset': 0 },
  //       duration: durations[idx],
  //       ease: 'power2.out',
  //     }, idx * 0.1); // Offset mỗi hình 0.1s
  //   });
    
  //   // Line chạy sau
  //   gsap.set(trapLineRef.current, { attr: { 'stroke-dashoffset': trapLineRef.current.getAttribute('stroke-dasharray') } });
  //   shineLoop.current.to(trapLineRef.current, {
  //     attr: { 'stroke-dashoffset': 0 },
  //     duration: 0.8,
  //     ease: 'power2.out',
  //   }, durations.length * 0.1);
  // }

  function scheduleRescramble() {
    reschedule.current = setTimeout(() => {
      scramble(dthRef.current, 'DTH SCOOTER TEAM', 2000, () => {
        scheduleRescramble();
      });
    }, 10000);
  }
  function playIntro() {
    gsap.set(dthRef.current, { opacity: 0 });
    gsap.set(shineRef.current, { left: '-40%', opacity: 0 });

    // Reset tất cả hình thang VỀ TRẠNG THÁI ẨN ban đầu
    const trapRefs = [trap1Ref, trap2Ref, trap3Ref, trap4Ref, trap5Ref];
    trapRefs.forEach((ref) => {
      if (ref.current) {
        const dashArray = ref.current.getAttribute('stroke-dasharray');
        gsap.set(ref.current, {
          attr: { 'stroke-dashoffset': dashArray } // Ẩn hoàn toàn
        });
      }
    });
    if (trapLineRef.current) {
      const dashArray = trapLineRef.current.getAttribute('stroke-dasharray');
      gsap.set(trapLineRef.current, {
        attr: { 'stroke-dashoffset': dashArray }
      });
    }

    // Text scramble trước
    scramble(dthRef.current, 'DTH SCOOTER TEAM', 2000, () => {
      // Chờ 1 giây rồi chạy hình thang
      setTimeout(() => {
        startShine();
        scheduleRescramble();
      }, 1000);
    });
  }

  function startShine() {
    if (shineLoop.current) shineLoop.current.kill();
    shineLoop.current = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    const durations = [0.6, 0.75, 0.9, 1.05, 1.2];
    const trapRefs = [trap1Ref, trap2Ref, trap3Ref, trap4Ref, trap5Ref];

    // trapRefs.forEach((ref, idx) => {
    //   const dashArray = ref.current.getAttribute('stroke-dasharray');
    //   shineLoop.current.to(ref.current, 
    //     { attr: { 'stroke-dashoffset': dashArray } }, // FROM (ẩn)
    //     {
    //       attr: { 'stroke-dashoffset': 0 }, // TO (hiện)
    //       duration: durations[idx],
    //       ease: 'power2.out',
    //     }, idx * 0.1);
    // });
    trapRefs.forEach((ref, idx) => {
      shineLoop.current.to(ref.current, {
        attr: { 'stroke-dashoffset': 0 },  // TO (hiện)
        duration: durations[idx],
        ease: 'power2.out',
      }, idx * 0.1);
    });
    
    // Line chạy sau
    const lineDashArray = trapLineRef.current.getAttribute('stroke-dasharray');
      shineLoop.current.to(trapLineRef.current,
        { attr: { 'stroke-dashoffset': lineDashArray } },
        {
          attr: { 'stroke-dashoffset': 0 },
          duration: 0.8,
          ease: 'power2.out',
        }, durations.length * 0.1);
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

      <div className="welcome-logo">
        <div className="welcome-text-wrap">
          <div className="welcome-dth" ref={dthRef}>DTH SCOOTER TEAM</div>
          <div className="welcome-bar-row">
            <svg width="100%" 
              height="90" 
              viewBox="0 0 1400 90" 
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

              {/* Hình thang 1 - nhỏ nhất */}
              <polygon
                ref={trap1Ref}
                points="0,30 40,30 30,60 0,60"
                stroke="url(#rg)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="120"
                strokeDashoffset="120"
              />
              
              {/* Hình thang 2 */}
              <polygon
                ref={trap2Ref}
                points="60,20 120,20 100,70 60,70"
                stroke="url(#rg)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="150"
                strokeDashoffset="150"
              />
              
              {/* Hình thang 3 */}
              <polygon
                ref={trap3Ref}
                points="150,10 220,10 190,80 150,80"
                stroke="url(#rg)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="180"
                strokeDashoffset="180"
              />
              
              {/* Hình thang 4 */}
              <polygon
                ref={trap4Ref}
                points="260,0 340,0 300,90 260,90"
                stroke="url(#rg)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="210"
                strokeDashoffset="210"
              />
              
              {/* Hình thang 5 - lớn nhất */}
              <polygon
                ref={trap5Ref}
                points="380,-10 470,-10 410,100 380,100"
                stroke="url(#rg)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="240"
                strokeDashoffset="240"
              />
            </svg>
          </div>
        </div>
      </div>

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