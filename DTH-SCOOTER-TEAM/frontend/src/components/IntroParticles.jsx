
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { createCircleTexture } from "../utils/particleTexture.js";

const PARTICLE_COUNT = 800;

function ParticleField({ progressRef, dragRotationRef, velocityRef, isDragging }) {
  const pointsRef = useRef(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const basePositions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  const orbitAngles = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i] = Math.random() * Math.PI * 2;
    }
    return arr;
  }, []);

  const displayPositions = useMemo(
    () => new Float32Array(basePositions),
    [basePositions]
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;

    let orbitProgress, orbitFade;
    if (p <= 0.7) {
      orbitProgress = p / 0.7;
      orbitFade = orbitProgress;
    } else if (p <= 0.85) {
      orbitProgress = 1;
      orbitFade = 1 - (p - 0.7) / 0.15;
    } else {
      orbitProgress = 1;
      orbitFade = 0;
    }

    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const baseX = basePositions[idx];
      const baseY = basePositions[idx + 1];
      const baseZ = basePositions[idx + 2];

      const driftAmount = 1 - orbitFade * 0.6;
      const driftX = Math.sin(t * 0.3 + i) * 0.15 * driftAmount;
      const driftY = Math.cos(t * 0.25 + i * 1.3) * 0.12 * driftAmount;

      const angle = orbitAngles[i] + orbitProgress * Math.PI * 2 * 0.3;
      const orbitX = Math.cos(angle) * 0.6 * orbitFade;
      const orbitY = Math.sin(angle) * 0.4 * orbitFade;

      displayPositions[idx] = baseX + driftX + orbitX;
      displayPositions[idx + 1] = baseY + driftY + orbitY;
      displayPositions[idx + 2] = baseZ;
    }

    posAttr.array.set(displayPositions);
    posAttr.needsUpdate = true;

    // INERTIA: nếu KHÔNG đang kéo, tiếp tục cộng vận tốc còn lại vào góc
    // xoay (giống đang "trôi theo đà"), rồi giảm dần vận tốc đó mỗi frame
    // bằng hệ số DAMPING (0.92 = mất ~8% tốc độ mỗi frame) cho tới khi gần
    // 0 thì dừng hẳn.
    if (!isDragging.current) {
      const DAMPING = 0.99;
      dragRotationRef.current.y += velocityRef.current.y;
      dragRotationRef.current.x += velocityRef.current.x;
      dragRotationRef.current.x = Math.max(-1, Math.min(1, dragRotationRef.current.x));

      velocityRef.current.x *= DAMPING;
      velocityRef.current.y *= DAMPING;

      if (Math.abs(velocityRef.current.x) < 0.0001) velocityRef.current.x = 0;
      if (Math.abs(velocityRef.current.y) < 0.0001) velocityRef.current.y = 0;
    }

    pointsRef.current.rotation.y = dragRotationRef.current.y;
    pointsRef.current.rotation.x = dragRotationRef.current.x;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={displayPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#ef233c"
        map={circleTexture}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function IntroParticles({ progressRef }) {
  const dragRotationRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    const deltaY = dx * 0.005;
    const deltaX = dy * 0.005;

    dragRotationRef.current.y += deltaY;
    dragRotationRef.current.x += deltaX;
    dragRotationRef.current.x = Math.max(-1, Math.min(1, dragRotationRef.current.x));

    velocityRef.current = { x: deltaX, y: deltaY };

    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ width: "100%", height: "100%", cursor: "grab" }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ParticleField
          progressRef={progressRef}
          dragRotationRef={dragRotationRef}
          velocityRef={velocityRef}
          isDragging={isDragging}
        />
      </Canvas>
    </div>
  );
}