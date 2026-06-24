import * as THREE from "three";

// createCircleTexture: tạo 1 texture tròn, viền mềm (radial gradient) bằng
// canvas runtime — không cần file ảnh. pointsMaterial không có map sẽ luôn
// vẽ mỗi điểm là 1 ô VUÔNG cứng (đây là lý do chữ ghép từ particle trông
// như pixel-art vuông trước đó) — gắn texture này làm "map" sẽ khiến mỗi
// particle hiển thị tròn, mềm, mượt hơn nhiều.
export function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.7)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}