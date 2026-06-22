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
  const reschedule = useRef(null);

  function scheduleRescramble() {
    reschedule.current = setTimeout(() => {
      scramble(dthRef.current, 'DTH SCOOTER TEAM', 3000, () => {
        scheduleRescramble();
      });
    }, 4000);
  }

  function playIntro() {
    gsap.set(dthRef.current, { opacity: 0 });
    
    scramble(dthRef.current, 'DTH SCOOTER TEAM', 3000, () => {
      scheduleRescramble();
    });
  }

  useEffect(() => {
    playIntro();
    return () => {
      clearTimeout(reschedule.current);
    };
  }, []);

  return (
    <main className="welcome-main">
      <div className="welcome-shine" ref={shineRef} />

      <div className="welcome-logo">
        <div className="welcome-text-wrap">
          <div className="welcome-dth" ref={dthRef}>DTH SCOOTER TEAM</div>
        </div>
      </div>

      <footer className="wel-nav">
        <div className="nav-left">
          <a href="https://github.com/MQuan-van/Final-Project_GRE.git"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-label="Code">GitHub</a>
        </div>

        <div className="nav-center">
          <a href="https://www.facebook.com/profile.php?id=61574902900658"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-label="DTH WORKSHOP">Facebook
          </a>

          <a href="https://www.tiktok.com/@_dth568"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-label="DTH TIKTOK">Tiktok
          </a>

          <a href="https://www.facebook.com/nguyen.tien.hai.454888"
            target="_blank" rel="noopener noreferrer"
            className="nav-item" data-label="DTH'S OWNER">Contact
          </a>

        </div>
        <div className="nav-right">
          <div className="nav-item" data-label="NEXT" onClick={() => navigate("/Home")}>Home</div>
        </div>
      </footer>
    </main>
  );
}