import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TimelineScene from "../components/TimelineScene.jsx";
import { initLenis } from "../utils/lenis.js";
import "./Story.css";

gsap.registerPlugin(ScrollTrigger);

const FOUNDER = {
  name: "Nguyễn Tiến Hải",
  image: "/images/founder.jpg",
  birthday: "28 May 1982",
  story:
    "[Placeholder] Câu chuyện về người sáng lập DTH Scooter Team — vì sao bắt đầu, điều gì thúc đẩy, và tầm nhìn cho cộng đồng.",
};

const MILESTONES = [
  {
    key: "v1",
    label: "V1",
    year: "2023",
    title: "Khởi đầu — NVX 155 VVA V1",
    description:
      "[Placeholder] Câu chuyện về bản V1 — điểm xuất phát, ý tưởng ban đầu, những thử nghiệm đầu tiên.",
  },
  {
    key: "v2",
    label: "V2",
    year: "2024",
    title: "Tiến hoá — NVX 155 VVA V2",
    description:
      "[Placeholder] Câu chuyện về bản V2 — những gì đã thay đổi, bài học rút ra từ V1, hướng đi mới.",
  },
  {
    key: "v3",
    label: "V3",
    year: "2025",
    title: "Hoàn thiện — NVX 155 VVA V3",
    description:
      "[Placeholder] Câu chuyện về bản V3 — dấu ấn riêng, độ hoàn thiện, và những gì còn ở phía trước.",
  },
];

export default function Story() {
  const introRef = useRef(null);
  const founderRef = useRef(null);
  const timelineWrapRef = useRef(null);
  const timelinePinRef = useRef(null);
  const closingRef = useRef(null);

  const progressRef = useRef(0);
  const milestoneTextRefs = useRef([]);

  useEffect(() => {
    const lenis = initLenis();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: timelineWrapRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: timelinePinRef.current,
        pinSpacing: false,

        onUpdate: (self) => {
          progressRef.current = self.progress;

          // Dùng ĐÚNG công thức segment/dist như TimelineScene.jsx (ảnh 3D) để
          // 2 hệ thống đồng bộ hoàn toàn. CLAMP progress gần 0/1 về đúng 0/1
          // tuyệt đối — đảm bảo mốc đầu/cuối luôn rõ nét hoàn toàn khi dừng
          // scroll, không phụ thuộc độ trễ easing của Lenis.
          let pClamped = self.progress;
          if (pClamped >= 0.97) pClamped = 1;
          else if (pClamped <= 0.03) pClamped = 0;
          const segment = pClamped * 2.5 - 0.5;
          milestoneTextRefs.current.forEach((el, i) => {
            if (!el) return;
            const dist = Math.abs(i - segment);
            const opacity = Math.max(0, 1 - dist);
            const blur = Math.min(10, dist * 10); // dist=0 -> nét hẳn, dist>=1 -> blur 10px
            el.style.opacity = opacity;
            el.style.filter = `blur(${blur}px)`;
          });
        },
      });
    });

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <main className="story-main">
      {/* ══ SECTION 1 — INTRO ══ */}
      <section className="story-intro" ref={introRef}>
        <p className="story-eyebrow">Our Story</p>
        <h1 className="story-intro-title">
          Mỗi chiếc xe<br />là một câu chuyện.
        </h1>
        <p className="story-intro-desc">
          [Placeholder] Đoạn mở đầu kể DTH Scooter Team là ai, bắt đầu từ đâu,
          và vì sao cộng đồng này được dựng lên xung quanh những chiếc NVX 155 VVA.
        </p>
        <div className="story-scroll-hint">
          <div className="story-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ══ SECTION 2 — FOUNDER ══ */}
      <section className="story-founder" ref={founderRef}>
        <div className="story-founder-img-wrap">
          <img src={FOUNDER.image} alt={FOUNDER.name} className="story-founder-img" />
        </div>
        <div className="story-founder-content">
          <p className="story-eyebrow">The Founder</p>
          <h2 className="story-founder-name">{FOUNDER.name}</h2>
          <p className="story-founder-meta">{FOUNDER.birthday}</p>
          <p className="story-founder-text">{FOUNDER.story}</p>
        </div>
      </section>

      {/* ══ SECTION 3 — TIMELINE (pin + 3D scroll-driven, layout 2 cột) ══
          timelineWrapRef: khối CAO (300vh) để pin có "chỗ ăn" scroll thật.
          timelinePinRef: khối con cao đúng 100vh, bị GSAP pin đứng yên bên trong khối cha. */}
      <section className="story-timeline-wrap" ref={timelineWrapRef}>
        <div className="story-timeline-pin" ref={timelinePinRef}>
          <div className="story-timeline-header">
            <p className="story-eyebrow">The Journey</p>
            <h2 className="story-timeline-title">V1 → V2 → V3</h2>
          </div>

          <div className="story-timeline-body">
            <div className="story-timeline-canvas">
              <TimelineScene progressRef={progressRef} />
            </div>

            <div className="story-timeline-text">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.key}
                  className="story-milestone-text"
                  ref={(el) => (milestoneTextRefs.current[i] = el)}
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    filter: i === 0 ? "blur(0px)" : "blur(10px)",
                  }}
                >
                  <span className="story-milestone-label">{m.label} — {m.year}</span>
                  <h3 className="story-milestone-title">{m.title}</h3>
                  <p className="story-milestone-desc">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — CLOSING ══ */}
      <section className="story-closing" ref={closingRef}>
        <h2 className="story-closing-title">
          Hành trình vẫn đang tiếp diễn.
        </h2>
        <p className="story-closing-desc">
          [Placeholder] Lời kết, lời mời cộng đồng tiếp tục theo dõi và đồng hành.
        </p>
         <Link to="/welcome" className="story-closing-link">
          Vào Welcome →
        </Link>
      </section>
    </main>
  );
}