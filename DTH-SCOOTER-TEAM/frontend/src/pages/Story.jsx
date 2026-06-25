// import { useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import TimelineScene from "../components/TimelineScene.jsx";
// import { initLenis } from "../utils/lenis.js";
// import "./Story.css";

// gsap.registerPlugin(ScrollTrigger);

// // Placeholder data — sẽ nối DB ở bước sau khi làm phần admin/model.
// // Cấu trúc này khớp với hướng model "TeamStory" + "milestones" đã thống nhất.

// const FOUNDER = {
//   name: "Nguyễn Tiến Hải",
//   image: "/images/founder.jpg",
//   birthday: "28 May 1982",
//   story:
//     "[Placeholder] Câu chuyện về người sáng lập DTH Scooter Team — vì sao bắt đầu, điều gì thúc đẩy, và tầm nhìn cho cộng đồng.",
// };

// const MILESTONES = [
//   {
//     key: "v1",
//     label: "V1",
//     year: "2023",
//     title: "Khởi đầu — NVX 155 VVA V1",
//     description:
//       "[Placeholder] Câu chuyện về bản V1 — điểm xuất phát, ý tưởng ban đầu, những thử nghiệm đầu tiên.",
//     image: "/images/v1-story.jpg",
//   },
//   {
//     key: "v2",
//     label: "V2",
//     year: "2024",
//     title: "Tiến hoá — NVX 155 VVA V2",
//     description:
//       "[Placeholder] Câu chuyện về bản V2 — những gì đã thay đổi, bài học rút ra từ V1, hướng đi mới.",
//     image: "/images/v2-story.jpg",
//   },
//   {
//     key: "v3",
//     label: "V3",
//     year: "2025",
//     title: "Hoàn thiện — NVX 155 VVA V3",
//     description:
//       "[Placeholder] Câu chuyện về bản V3 — dấu ấn riêng, độ hoàn thiện, và những gì còn ở phía trước.",
//     image: "/images/v3-story.jpg",
//   },
// ];

// export default function Story() {
//   const introRef = useRef(null);
//   const founderRef = useRef(null);
//   const timelineWrapRef = useRef(null);
//   const timelinePinRef = useRef(null);
//   const closingRef = useRef(null);

//   // progressRef: vị trí scroll THẬT, ghi bởi GSAP mỗi lần có scroll event.
//   // displayProgressRef: giá trị "đã làm mượt" (lerp), đuổi theo progressRef
//   // với độ trễ nhẹ — đây là giá trị THẬT SỰ dùng để vẽ (cả ảnh 3D và chữ).
//   // Không dùng useState vì cần đổi 60 lần/giây mà không re-render React.
//   const progressRef = useRef(0);
//   const displayProgressRef = useRef(0);

//   // milestoneTextRefs: DOM ref tới từng khối text V1/V2/V3 overlay lên canvas,
//   // để đổi opacity/blur dựa theo displayProgressRef.
//   const milestoneTextRefs = useRef([]);

//   useEffect(() => {
//     const lenis = initLenis();

//     const ctx = gsap.context(() => {
//       ScrollTrigger.create({
//         trigger: timelineWrapRef.current,
//         start: "top top",
//         end: "bottom bottom",
//         pin: timelinePinRef.current,
//         pinSpacing: false,
//         onUpdate: (self) => {
//           // Chỉ ghi giá trị THẬT vào progressRef — KHÔNG tính toán gì ở đây.
//           // Việc lerp + vẽ chữ được tách ra chạy trong rAF loop riêng bên dưới,
//           // để chữ cập nhật mỗi frame (60fps) giống hệt cách ảnh 3D cập nhật,
//           // thay vì chỉ cập nhật lúc có scroll event (gây cảm giác "giật cứng"
//           // so với ảnh 3D mượt hơn).
//           progressRef.current = self.progress;
//         },
//       });
//     });

//     // rAF loop riêng cho phần chữ — chạy song song với vòng lặp render của R3F,
//     // đảm bảo cả 2 hệ thống (ảnh 3D và chữ DOM) cùng tốc độ làm mượt.
//     let rafId;
//     const tick = () => {
//       let target = progressRef.current;
//       if (target >= 0.97) target = 1;
//       else if (target <= 0.03) target = 0;

//       displayProgressRef.current += (target - displayProgressRef.current) * 0.08;

//       const segment = displayProgressRef.current * 2.5 - 0.5;
//       milestoneTextRefs.current.forEach((el, i) => {
//         if (!el) return;
//         const dist = Math.abs(i - segment);
//         const opacity = Math.max(0, 1 - dist);
//         const blur = Math.min(10, dist * 10);
//         el.style.opacity = opacity;
//         el.style.filter = `blur(${blur}px)`;
//       });

//       rafId = requestAnimationFrame(tick);
//     };
//     rafId = requestAnimationFrame(tick);

//     return () => {
//       lenis.destroy();
//       ctx.revert();
//       cancelAnimationFrame(rafId);
//     };
//   }, []);

//   return (
//     <main className="story-main">
//       {/* ══ SECTION 1 — INTRO ══ */}
//       <section className="story-intro" ref={introRef}>
//         <p className="story-eyebrow">Our Story</p>
//         <h1 className="story-intro-title">
//           Mỗi chiếc xe<br />là một câu chuyện.
//         </h1>
//         <p className="story-intro-desc">
//           [Placeholder] Đoạn mở đầu kể DTH Scooter Team là ai, bắt đầu từ đâu,
//           và vì sao cộng đồng này được dựng lên xung quanh những chiếc NVX 155 VVA.
//         </p>
//         <div className="story-scroll-hint">
//           <div className="story-scroll-line" />
//           <span>Scroll</span>
//         </div>
//       </section>

//       {/* ══ SECTION 2 — FOUNDER ══ */}
//       <section className="story-founder" ref={founderRef}>
//         <div className="story-founder-img-wrap">
//           <img src={FOUNDER.image} alt={FOUNDER.name} className="story-founder-img" />
//         </div>
//         <div className="story-founder-content">
//           <p className="story-eyebrow">The Founder</p>
//           <h2 className="story-founder-name">{FOUNDER.name}</h2>
//           <p className="story-founder-meta">{FOUNDER.birthday}</p>
//           <p className="story-founder-text">{FOUNDER.story}</p>
//         </div>
//       </section>

//       {/* ══ SECTION 3 — TIMELINE (pin + 3D scroll-driven, layout 2 cột) ══
//           timelineWrapRef: khối CAO (300vh) để pin có "chỗ ăn" scroll thật.
//           timelinePinRef: khối con cao đúng 100vh, bị GSAP pin đứng yên bên trong khối cha. */}
//       <section className="story-timeline-wrap" ref={timelineWrapRef}>
//         <div className="story-timeline-pin" ref={timelinePinRef}>
//           <div className="story-timeline-header">
//             <p className="story-eyebrow">The Journey</p>
//             <h2 className="story-timeline-title">V1 → V2 → V3</h2>
//           </div>

//           <div className="story-timeline-body">
//             <div className="story-timeline-canvas">
//               <TimelineScene
//                 progressRef={progressRef}
//                 displayProgressRef={displayProgressRef}
//                 images={MILESTONES.map((m) => m.image)}
//               />
//             </div>

//             <div className="story-timeline-text">
//               {MILESTONES.map((m, i) => (
//                 <div
//                   key={m.key}
//                   className="story-milestone-text"
//                   ref={(el) => (milestoneTextRefs.current[i] = el)}
//                   style={{
//                     opacity: i === 0 ? 1 : 0,
//                     filter: i === 0 ? "blur(0px)" : "blur(10px)",
//                   }}
//                 >
//                   <span className="story-milestone-label">{m.label} — {m.year}</span>
//                   <h3 className="story-milestone-title">{m.title}</h3>
//                   <p className="story-milestone-desc">{m.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══ SECTION 4 — CLOSING ══ */}
//       <section className="story-closing" ref={closingRef}>
//         <h2 className="story-closing-title">
//           Hành trình vẫn đang tiếp diễn.
//         </h2>
//         <p className="story-closing-desc">
//           [Placeholder] Lời kết, lời mời cộng đồng tiếp tục theo dõi và đồng hành.
//         </p>
//         <Link to="/welcome" className="story-closing-link">
//           Vào Welcome →
//         </Link>
//       </section>
//     </main>
//   );
// }
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TimelineScene from "../components/TimelineScene.jsx";
import IntroParticles from "../components/IntroParticles.jsx";
import IntroTextParticles from "../components/IntroTextParticles.jsx";
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
    image: "/images/v1-story.jpg",
  },
  {
    key: "v2",
    label: "V2",
    year: "2024",
    title: "Tiến hoá — NVX 155 VVA V2",
    description:
      "[Placeholder] Câu chuyện về bản V2 — những gì đã thay đổi, bài học rút ra từ V1, hướng đi mới.",
    image: "/images/v2-story.jpg",
  },
  {
    key: "v3",
    label: "V3",
    year: "2025",
    title: "Hoàn thiện — NVX 155 VVA V3",
    description:
      "[Placeholder] Câu chuyện về bản V3 — dấu ấn riêng, độ hoàn thiện, và những gì còn ở phía trước.",
    image: "/images/v3-story.jpg",
  },
];

export default function Story() {
  const introWrapRef = useRef(null);
  const introPinRef = useRef(null);
  const introTitleRef = useRef(null);
  const introEyebrowRef = useRef(null);
  const founderRef = useRef(null);
  const timelineWrapRef = useRef(null);
  const timelinePinRef = useRef(null);
  const closingRef = useRef(null);

  const introProgressRef = useRef(0);
  const progressRef = useRef(0);
  const displayProgressRef = useRef(0);

  const milestoneTextRefs = useRef([]);

  useEffect(() => {
    const lenis = initLenis();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: introWrapRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: introPinRef.current,
        pinSpacing: false,
        onUpdate: (self) => {
          introProgressRef.current = self.progress;
          const p = self.progress;
          if (introEyebrowRef.current) {
            const eyebrowT = Math.min(1, p / 0.3);
            const eyebrowOpacity = eyebrowT;
            const BASE_OFFSET = -120;
            const slideOffset = (1 - eyebrowT) * 14;
            introEyebrowRef.current.style.opacity = eyebrowOpacity;
            introEyebrowRef.current.style.transform = `translateY(${BASE_OFFSET + slideOffset}px)`;
          }

          const MIN_OPACITY = 0.25;

          let sectionOpacity;
          if (p <= 0.9) {
            sectionOpacity = 1;
          } else {
            const fadeT = (p - 0.9) / 0.1;
            sectionOpacity = 1 - fadeT * (1 - MIN_OPACITY);
          }

          if (introPinRef.current) {
            introPinRef.current.style.opacity = sectionOpacity;
          }
          if (introPinRef.current) {
            introPinRef.current.style.opacity = sectionOpacity;
          }
        },
      });

      ScrollTrigger.create({
        trigger: timelineWrapRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: timelinePinRef.current,
        pinSpacing: false,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    });

    let rafId;
    const tick = () => {
      let target = progressRef.current;
      if (target >= 0.97) target = 1;
      else if (target <= 0.03) target = 0;

      displayProgressRef.current += (target - displayProgressRef.current) * 0.08;

      const segment = displayProgressRef.current * 2.5 - 0.5;
      milestoneTextRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(i - segment);
        const opacity = Math.max(0, 1 - dist);
        const blur = Math.min(10, dist * 10);
        el.style.opacity = opacity;
        el.style.filter = `blur(${blur}px)`;
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      lenis.destroy();
      ctx.revert();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="story-main">
      <section className="story-intro-wrap" ref={introWrapRef}>
        <div className="story-intro-pin" ref={introPinRef}>
          <div className="story-intro-particles">
            <IntroParticles progressRef={introProgressRef} />
          </div>

          {/* "OUR STORY" — dòng riêng, ở TRÊN, không particle. Animation
              fade + slide nhẹ theo introProgressRef. */}
          <p className="story-eyebrow story-intro-eyebrow" ref={introEyebrowRef} style={{ opacity: 0 }} >
            Basiccally, I am a Web Developer
          </p>

          {/* Khung particle RIÊNG cho tiêu đề + mô tả — chiều cao CỐ ĐỊNH
              (không phải full inset:0 như trước), đặt NGAY DƯỚI "Our Story"
              theo flow tự nhiên, để 2 phần không còn chồng lên nhau. */}
          <div className="story-intro-text-particles">
            <IntroTextParticles progressRef={introProgressRef} />
          </div>

          {/* Text gốc giữ sr-only cho accessibility/SEO — particle phía trên
              đã đảm nhận việc hiển thị thị giác. */}
          {/* <h1 className="story-intro-title sr-only" ref={introTitleRef}>
            Mỗi chiếc xe<br />là một câu chuyện.
          </h1> */}
        </div>
      </section>

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

      <section className="story-timeline-wrap" ref={timelineWrapRef}>
        <div className="story-timeline-pin" ref={timelinePinRef}>
          <div className="story-timeline-header">
            <p className="story-eyebrow">The Journey</p>
            <h2 className="story-timeline-title">V1 → V2 → V3</h2>
          </div>

          <div className="story-timeline-body">
            <div className="story-timeline-canvas">
              <TimelineScene
                progressRef={progressRef}
                displayProgressRef={displayProgressRef}
                images={MILESTONES.map((m) => m.image)}
              />
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