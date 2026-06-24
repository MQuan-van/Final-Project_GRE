import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { createCircleTexture } from "../utils/particleTexture.js";

const CANVAS_W = 2400;
const CANVAS_H = 1350;

function rasterizeRegion(drawFn, sampleStep) {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  drawFn(ctx);

  const data = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H).data;
  const points = [];
  for (let y = 0; y < CANVAS_H; y += sampleStep) {
    for (let x = 0; x < CANVAS_W; x += sampleStep) {
      const idx = (y * CANVAS_W + x) * 4;
      if (data[idx + 3] > 128) {
        points.push({
          x: (x / CANVAS_W - 0.5) * 2 * (CANVAS_W / CANVAS_H),
          y: -(y / CANVAS_H - 0.5) * 2,
        });
      }
    }
  }
  return points;
}

function useParticleAssembly(targets, progressRef) {
  const pointsRef = useRef(null);
  const count = targets.length;

  const startPositions = useMemo(() => {
    const arr = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      arr[i * 2] = (Math.random() - 0.5) * 16;
      arr[i * 2 + 1] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  const particleSpeeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = 0.6 + Math.random() * 0.8;
    return arr;
  }, [count]);

  const progressPerParticle = useRef(new Float32Array(count));
  const displayPositions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const p = progressRef.current;
    const assembleTarget = Math.min(1, p / 0.7);
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const current = progressPerParticle.current[i];
      const speed = Math.min(1, particleSpeeds[i] * delta * 2);
      progressPerParticle.current[i] = current + (assembleTarget - current) * speed;

      const t = progressPerParticle.current[i];
      const ease = t * t * (3 - 2 * t);

      const x = startPositions[i * 2] + (targets[i].x - startPositions[i * 2]) * ease;
      const y = startPositions[i * 2 + 1] + (targets[i].y - startPositions[i * 2 + 1]) * ease;

      displayPositions[i * 3] = x;
      displayPositions[i * 3 + 1] = y;
      displayPositions[i * 3 + 2] = 0;
    }

    posAttr.array.set(displayPositions);
    posAttr.needsUpdate = true;
  });

  return { pointsRef, displayPositions, count };
}

function TitleParticles({ progressRef, circleTexture }) {
  const targets = useMemo(
    () =>
      rasterizeRegion((ctx) => {
        ctx.font = `700 ${CANVAS_H * 0.1}px sans-serif`;
        ctx.fillText("Mỗi chiếc xe", CANVAS_W / 2, CANVAS_H * 0.58);
        ctx.fillText("là một câu chuyện.", CANVAS_W / 2, CANVAS_H * 0.7);
      }, 2),
    []
  );
  const { pointsRef, displayPositions, count } = useParticleAssembly(targets, progressRef);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={displayPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        color="#ffffff"
        map={circleTexture}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        opacity={1}
        sizeAttenuation
      />
    </points>
  );
}

export default function IntroTextParticles({ progressRef }) {
  const circleTexture = useMemo(() => createCircleTexture(), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <TitleParticles progressRef={progressRef} circleTexture={circleTexture} />
    </Canvas>
  );
}