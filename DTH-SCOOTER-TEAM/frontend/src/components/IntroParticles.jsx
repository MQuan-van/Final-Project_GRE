import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { createCircleTexture } from "../utils/particleTexture.js";

const PARTICLE_COUNT = 400;

function ParticleField({ progressRef }) {
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
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ParticleField progressRef={progressRef} />
    </Canvas>
  );
}