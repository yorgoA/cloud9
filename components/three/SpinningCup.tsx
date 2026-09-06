"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type CupTexture =
  | { type: "photo"; src: string }
  | { type: "bands"; colors: [number, string][] };

/**
 * Tracks how far `el` has scrolled through the viewport, as 0→1.
 * Uses getBoundingClientRect so it works regardless of which ancestor
 * element is the actual scroll container (this app scrolls its <main>,
 * not the window).
 */
function watchSectionProgress(el: HTMLElement, onChange: (progress: number) => void) {
  const scrollParent = el.closest("main");

  function update() {
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const raw = (viewportH - rect.top) / (viewportH + rect.height);
    onChange(Math.min(1, Math.max(0, raw)));
  }

  update();
  const target: HTMLElement | Window = scrollParent ?? window;
  target.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => {
    target.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}

function drawBandTexture(bands: [number, string][], label?: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bands.forEach(([stop, color]) => grad.addColorStop(stop, color));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (let i = 0; i < 5; i++) {
    const x = 60 + i * 90 + (i % 2) * 20;
    const y = 40 + (i % 3) * 18;
    ctx.beginPath();
    ctx.roundRect(x, y, 54, 54, 8);
    ctx.fill();
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 64px system-ui, sans-serif";
  ctx.fillText("cloud", canvas.width / 2, canvas.height * 0.68);
  ctx.fillText("nine", canvas.width / 2, canvas.height * 0.78);
  ctx.font = "600 20px system-ui, sans-serif";
  ctx.fillText(label ?? "COFFEE SHOP", canvas.width / 2, canvas.height * 0.85);

  return canvas;
}

function loadTexture(texture: CupTexture): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    if (texture.type === "bands") {
      const tex = new THREE.Texture(drawBandTexture(texture.colors));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      resolve(tex);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      resolve(tex);
    };
    img.src = texture.src;
  });
}

export function SpinningCup({
  texture,
  className,
}: {
  texture: CupTexture;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const fadeRef = useRef(1); // 1 = fully visible; drops to 0 then climbs back on texture swap

  // One-time scene setup.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 6.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-3, -1, -3);
    scene.add(fill);

    // The photo only covers the front of the cup, so the cylinder is built as a
    // partial arc (not a full 360deg wrap) and rotation is kept within that arc.
    const thetaLength = Math.PI * 0.75;
    const geometry = new THREE.CylinderGeometry(1, 0.85, 2.3, 64, 1, true, -thetaLength / 2, thetaLength);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let progress = 0;
    const stopWatching = watchSectionProgress(container, (p) => {
      progress = p;
    });

    function resize() {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / (clientHeight || 1);
      camera.updateProjectionMatrix();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frameId: number;
    function animate() {
      mesh.rotation.y = (progress - 0.5) * 0.7;
      mesh.rotation.x = Math.sin(progress * Math.PI) * 0.06;
      mesh.position.y = Math.sin(progress * Math.PI * 2) * 0.04;
      fadeRef.current = Math.min(1, fadeRef.current + 0.06);
      material.opacity = fadeRef.current;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      stopWatching();
      resizeObserver.disconnect();
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
    // Scene is built once; texture swaps are handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap the texture on the existing material whenever it changes, without
  // tearing down the renderer (keeps hover-driven swaps cheap and smooth).
  useEffect(() => {
    let cancelled = false;
    loadTexture(texture).then((tex) => {
      if (cancelled || !materialRef.current) {
        tex.dispose();
        return;
      }
      const old = materialRef.current.map;
      materialRef.current.map = tex;
      materialRef.current.needsUpdate = true;
      fadeRef.current = 0.15;
      old?.dispose();
    });
    return () => {
      cancelled = true;
    };
  }, [texture]);

  return <div ref={containerRef} className={className} />;
}
