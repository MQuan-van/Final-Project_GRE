import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Bước 3 (bản sửa): 3 mesh đặt CẠNH NHAU theo trục X (không nối đuôi theo Z
// như bản cũ — đó là nguyên nhân camera phải "đâm xuyên" qua ảnh gây méo/lag).
// Camera giờ đứng yên một chỗ, KHÔNG di chuyển — chỉ các mesh tự trượt ngang
// (translateX) + xoay nhẹ quanh Y theo scroll progress. Nhẹ hơn nhiều vì
// camera tĩnh giúp WebGL không phải tính toán lại view matrix liên tục.

function MilestonePlane({ image, index, progressRef }) {
  const texture = useTexture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  const meshRef = useRef(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progressRef.current;

    // segment chạy từ -0.5 (p=0, trước V1) tới đúng 2.0 (p=1, đúng tại V3) —
    // đảm bảo mốc đầu (V1) và mốc cuối (V3) đạt "dist=0" (rõ/đúng vị trí hoàn
    // toàn) đúng lúc bắt đầu/kết thúc scroll.
    //
    // CLAMP: khi progress đã rất gần 0 hoặc 1 (do Lenis có easing/lag riêng,
    // giá trị thực tế hiển thị có thể không chính xác đúng 0/1 tuyệt đối),
    // ép cứng segment về đúng mốc target — đảm bảo khung hình cuối luôn đứng
    // yên hoàn toàn đúng vị trí, không còn lệch/xoay dư khi dừng scroll.
    let pClamped = p;
    if (p >= 0.97) pClamped = 1;
    else if (p <= 0.03) pClamped = 0;
    const segment = pClamped * 2.5 - 0.5;
    const dist = index - segment;

    const x = dist * 3.2;
    const rotY = Math.max(-0.5, Math.min(0.5, dist * 0.5));
    const scale = Math.max(0.7, 1 - Math.abs(dist) * 0.18);
    const opacity = Math.max(0, 1 - Math.abs(dist) * 0.6);

    meshRef.current.position.x = x;
    meshRef.current.rotation.y = rotY;
    meshRef.current.scale.setScalar(scale);
    meshRef.current.material.opacity = opacity;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.4, 3.2]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

const MILESTONE_IMAGES = [
  "/images/v1-story.jpg",
  "/images/v2-story.jpg",
  "/images/v3-story.jpg",
];

export default function TimelineScene({ progressRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ toneMapping: THREE.NoToneMapping }}
    >
      {/* meshBasicMaterial hiển thị texture đúng màu gốc, không cần ánh sáng —
          khác với meshStandardMaterial vốn luôn tính phản xạ theo góc chiếu sáng
          (đây chính là nguyên nhân khiến ảnh trước đó bị tối/đẫm màu). */}

      <Suspense fallback={null}>
        {MILESTONE_IMAGES.map((src, i) => (
          <MilestonePlane key={src} image={src} index={i} progressRef={progressRef} />
        ))}
      </Suspense>
    </Canvas>
  );
}