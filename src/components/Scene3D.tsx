import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// =======================================================================
// HIGH-END PROCEDURAL PBR TEXTURES (DIFFUSE + TANGENT NORMAL + ROUGHNESS)
// =======================================================================
function createPbrCeramicTextures() {
  const size = 1024;

  // 1. Diffuse Canvas (Silky White Porcelain with Artisanal Stoneware Speckles)
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const diffCtx = diffCanvas.getContext('2d')!;

  // 2. Height Canvas for Normal Map Calculation
  const heightCanvas = document.createElement('canvas');
  heightCanvas.width = size;
  heightCanvas.height = size;
  const heightCtx = heightCanvas.getContext('2d')!;

  // 3. Roughness Canvas
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;

  // Base fill
  diffCtx.fillStyle = '#FCFCFE';
  diffCtx.fillRect(0, 0, size, size);

  heightCtx.fillStyle = '#808080';
  heightCtx.fillRect(0, 0, size, size);

  roughCtx.fillStyle = '#5A5A5A'; // base roughness ~0.35
  roughCtx.fillRect(0, 0, size, size);

  // Micro porcelain grain
  for (let i = 0; i < 4500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const g = Math.floor(Math.random() * 22 + 233);
    diffCtx.fillStyle = `rgba(${g}, ${g}, ${g}, 0.22)`;
    diffCtx.fillRect(x, y, 1.2, 1.2);
  }

  // Realistic stoneware speckles of varying sizes
  for (let i = 0; i < 780; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2.8 + 0.7;
    const alpha = Math.random() * 0.55 + 0.15;
    const tone = Math.random() > 0.4 ? 120 : 170;
    const gray = Math.floor(Math.random() * 40 + tone);

    // Diffuse dot
    diffCtx.beginPath();
    diffCtx.arc(x, y, r, 0, Math.PI * 2);
    diffCtx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`;
    diffCtx.fill();

    // Height elevation for bump
    heightCtx.beginPath();
    heightCtx.arc(x, y, r * 1.15, 0, Math.PI * 2);
    heightCtx.fillStyle = `rgba(${Math.floor(gray * 0.8)}, ${Math.floor(gray * 0.8)}, ${Math.floor(gray * 0.8)}, ${alpha * 0.6})`;
    heightCtx.fill();

    // Slightly glossier on speckles
    roughCtx.beginPath();
    roughCtx.arc(x, y, r, 0, Math.PI * 2);
    roughCtx.fillStyle = 'rgba(70, 70, 70, 0.4)';
    roughCtx.fill();
  }

  // Generate Tangent-Space Normal Map via Sobel filter from Height Canvas
  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = size;
  normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext('2d')!;
  const heightImgData = heightCtx.getImageData(0, 0, size, size).data;
  const normalImgData = normalCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const xLeft = ((y * size + Math.max(0, x - 1)) * 4);
      const xRight = ((y * size + Math.min(size - 1, x + 1)) * 4);
      const yUp = ((Math.max(0, y - 1) * size + x) * 4);
      const yDown = ((Math.min(size - 1, y + 1) * size + x) * 4);

      const dX = (heightImgData[xRight] - heightImgData[xLeft]) / 255.0;
      const dY = (heightImgData[yDown] - heightImgData[yUp]) / 255.0;

      // Normal vector [ -dX * strength, -dY * strength, 1 ]
      const strength = 1.8;
      let nx = -dX * strength;
      let ny = -dY * strength;
      let nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len;
      ny /= len;
      nz /= len;

      normalImgData.data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      normalImgData.data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      normalImgData.data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      normalImgData.data[idx + 3] = 255;
    }
  }
  normalCtx.putImageData(normalImgData, 0, 0);

  // Convert to Three.js Textures
  const diffuseMap = new THREE.CanvasTexture(diffCanvas);
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.RepeatWrapping;
  diffuseMap.repeat.set(2, 2);

  const normalMap = new THREE.CanvasTexture(normalCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(2, 2);

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(2, 2);

  return { diffuseMap, normalMap, roughnessMap };
}

// =======================================================================
// DYNAMIC 2D KAWAII FACE ENGINE (VIBRANT, SWEET & ULTRA-EXPRESSIVE)
// =======================================================================
class KawaiiFaceRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;

  blinkProgress = 0; // 0 = open, 1 = closed
  expression: 'neutral' | 'happy' | 'wink' | 'talking' | 'starEyes' | 'love' | 'curious' = 'neutral';
  mouthOpen = 0;
  lookX = 0;
  lookY = 0;
  blushPulse = 1.0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 512;
    this.ctx = this.canvas.getContext('2d')!;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.generateMipmaps = true;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
  }

  update(params: {
    blink: number;
    expression: 'neutral' | 'happy' | 'wink' | 'talking' | 'starEyes' | 'love' | 'curious';
    mouth: number;
    lookX: number;
    lookY: number;
    isSpeaking: boolean;
    time: number;
  }) {
    this.blinkProgress = params.blink;
    this.expression = params.expression;
    this.mouthOpen = params.mouth;
    this.lookX = params.lookX;
    this.lookY = params.lookY;
    this.blushPulse = 0.85 + Math.sin(params.time * 3.2) * 0.15 + (params.isSpeaking ? 0.28 : 0);

    this.draw(params.time);
    this.texture.needsUpdate = true;
  }

  private draw(time: number) {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 - 10;
    const eyeSpacing = 138;

    // -------------------------------------------------------------
    // 1. KAWAII ROSY BLUSH CHEEKS WITH MULTI-LAYER GLOW
    // -------------------------------------------------------------
    const drawBlush = (x: number, y: number, isRight: boolean) => {
      ctx.save();
      const grad = ctx.createRadialGradient(x, y, 3, x, y, 56);
      grad.addColorStop(0, `rgba(255, 90, 155, ${0.95 * this.blushPulse})`);
      grad.addColorStop(0.42, `rgba(255, 125, 180, ${0.58 * this.blushPulse})`);
      grad.addColorStop(0.85, `rgba(255, 160, 210, ${0.18 * this.blushPulse})`);
      grad.addColorStop(1, 'rgba(255, 180, 220, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(x, y, 56, 30, 0.04, 0, Math.PI * 2);
      ctx.fill();

      // Cute anime blush diagonal lines //
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * this.blushPulse})`;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 18, y - 9);
      ctx.lineTo(x - 7, y + 9);
      ctx.moveTo(x - 4, y - 9);
      ctx.lineTo(x + 7, y + 9);
      ctx.stroke();

      // Cute floating sparkle or hearts over blush
      if (this.expression === 'love') {
        ctx.fillStyle = '#FF7597';
        ctx.shadowColor = '#FF94B2';
        ctx.shadowBlur = 14;
        const hx = isRight ? x + 24 : x - 24;
        const hy = y - 22 + Math.sin(time * 5.0) * 3;
        ctx.beginPath();
        ctx.arc(hx - 3.5, hy, 4, 0, Math.PI * 2);
        ctx.arc(hx + 3.5, hy, 4, 0, Math.PI * 2);
        ctx.moveTo(hx - 7, hy + 2);
        ctx.lineTo(hx, hy + 9);
        ctx.lineTo(hx + 7, hy + 2);
        ctx.fill();
      } else if (this.expression === 'starEyes' || this.expression === 'happy' || this.blushPulse > 1.05) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 12;
        const sparkX = isRight ? x + 24 : x - 24;
        const sparkY = y - 16 + Math.sin(time * 6.0) * 2;
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    drawBlush(cx - eyeSpacing - 58, cy + 92, false);
    drawBlush(cx + eyeSpacing + 58, cy + 92, true);

    // -------------------------------------------------------------
    // 2. KAWAII EYES (CRISP CAPSULES WITH SPARKLES & EMOTIONS)
    // -------------------------------------------------------------
    const drawEye = (x: number, y: number, isRightEye: boolean) => {
      ctx.save();

      // A. STAR EYES EMOTION: Dazzling 4-point rotating anime stars (★ ★)
      if (this.expression === 'starEyes') {
        ctx.translate(x, y);
        const rot = Math.sin(time * 3.2) * 0.12;
        ctx.rotate(rot);

        const rOuter = 48;
        const rInner = 15;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4 - Math.PI / 2;
          const r = i % 2 === 0 ? rOuter : rInner;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.lineWidth = 14;
        ctx.strokeStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(255, 255, 255, 1.0)';
        ctx.shadowBlur = 28;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Warm golden core in center
        ctx.fillStyle = '#FDE68A';
        ctx.beginPath();
        ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
        ctx.fill();

        // Tiny floating sparkle glints around the star
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(rOuter * 0.72, -rOuter * 0.65, 4, 0, Math.PI * 2);
        ctx.arc(-rOuter * 0.65, rOuter * 0.65, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return;
      }

      // B. LOVE EMOTION: Glowing Sweet Heart Eyes (♥ ♥)
      if (this.expression === 'love') {
        ctx.translate(x, y - 4);
        ctx.beginPath();
        ctx.moveTo(0, 16);
        ctx.bezierCurveTo(-26, -4, -32, -32, 0, -24);
        ctx.bezierCurveTo(32, -32, 26, -4, 0, 16);
        ctx.closePath();

        ctx.lineWidth = 14;
        ctx.strokeStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(255, 180, 210, 1.0)';
        ctx.shadowBlur = 26;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
        ctx.fill();

        // Specular glint
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-9, -16, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return;
      }

      // C. CURIOUS EMOTION: Inquisitive arch eyebrow over left eye
      if (this.expression === 'curious' && !isRightEye) {
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 11;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(x, y - 96, 32, Math.PI * 1.25, Math.PI * 1.85);
        ctx.stroke();
        ctx.restore();
      }

      const isWinking = this.expression === 'wink' && !isRightEye;
      const isHappySquint = this.expression === 'happy';

      // D. Happy Squint / Wink Smile Arch: ^-^
      if (isHappySquint || isWinking) {
        ctx.beginPath();
        const archW = 48;
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(255, 255, 255, 1.0)';
        ctx.shadowBlur = 24;

        ctx.arc(x, y + 10, archW, Math.PI * 1.15, Math.PI * 1.85, false);
        ctx.stroke();

        // Extra cute wink star twinkle
        if (isWinking) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 16;
          const sx = x - 42;
          const sy = y - 26;
          ctx.beginPath();
          ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return;
      }

      // E. Normal Capsule Eye with blinking compression
      const scaleY = Math.max(0.06, 1 - this.blinkProgress * 0.94);
      const eyeW = this.expression === 'curious' && !isRightEye ? 90 : 82;
      const eyeH = 164 * scaleY;
      const r = eyeW / 2;

      // Cursor parallax tracking inside the eye
      const shiftX = this.lookX * 16;
      const shiftY = this.lookY * 12;

      ctx.translate(x, y);

      // Outer Stadium / Capsule Eye Outline
      ctx.beginPath();
      ctx.moveTo(-r, -eyeH / 2 + r);
      ctx.lineTo(-r, eyeH / 2 - r);
      ctx.arc(0, eyeH / 2 - r, r, Math.PI, 0, true);
      ctx.lineTo(r, -eyeH / 2 + r);
      ctx.arc(0, -eyeH / 2 + r, r, 0, Math.PI, true);
      ctx.closePath();

      // Bold crisp white stroke with rich glow
      ctx.lineWidth = 20;
      ctx.strokeStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(255, 255, 255, 1.0)';
      ctx.shadowBlur = 24;
      ctx.stroke();

      // Luminous inner fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fill();

      // Clean single specular glint inside the eye
      if (scaleY > 0.4) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(-14 + shiftX * 0.5, -eyeH * 0.22 + shiftY * 0.5, 14 * scaleY, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    drawEye(cx - eyeSpacing, cy, false);
    drawEye(cx + eyeSpacing, cy, true);

    // -------------------------------------------------------------
    // 3. KAWAII CUTE MOUTH (Dynamic Speaking / Joyful Open Smile)
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(cx, cy + 92);

    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowBlur = 18;

    const isCheerfulOpen = this.expression === 'starEyes' || this.expression === 'love' || this.mouthOpen > 0.1;

    if (isCheerfulOpen) {
      // Cheerful open talking mouth with bouncy pink tongue
      const openH = Math.max(16, 26 * Math.max(this.mouthOpen, 0.7));
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.moveTo(-18, -2);
      ctx.quadraticCurveTo(0, openH, 18, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cute pink tongue
      ctx.fillStyle = 'rgba(255, 110, 160, 0.98)';
      ctx.beginPath();
      ctx.arc(0, openH * 0.62, 7.5, 0, Math.PI);
      ctx.fill();
    } else if (this.expression === 'curious') {
      // Cute rounded surprised mouth `o`
      ctx.beginPath();
      ctx.arc(0, 4, 7, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Resting anime cat smile `‿`
      ctx.beginPath();
      const smileW = 19;
      ctx.moveTo(-smileW, -2);
      ctx.quadraticCurveTo(0, 13, smileW, -2);
      ctx.stroke();
    }
    ctx.restore();
  }

  dispose() {
    this.texture.dispose();
  }
}

// =======================================================================
// ORGANIC PLASMA COLOR-MORPHING SHADER WITH PROJECTED 2D FACE
// =======================================================================
const OrganicKawaiiFaceShader = {
  uniforms: {
    uTime: { value: 0 },
    uIsSpeaking: { value: 0 },
    uFaceTexture: { value: null as THREE.Texture | null },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vLocalPosition;

    void main() {
      vLocalPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIsSpeaking;
    uniform sampler2D uFaceTexture;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vLocalPosition;

    // Cosine rainbow palette: a + b*cos(2*PI*(c*t + d))
    vec3 pal(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Smooth time cycle (~8s full spectrum loop)
      float t = uTime * 0.125;

      // Organic fluid plasma swirl inside the sphere
      float swirl = sin(vLocalPosition.x * 3.5 + uTime * 0.8) * cos(vLocalPosition.y * 3.5 + uTime * 0.6) * 0.15;
      float modulatedT = t + swirl;

      // Luxurious Spline Color Keys
      vec3 colA = vec3(0.58, 0.44, 0.68);
      vec3 colB = vec3(0.42, 0.48, 0.54);
      vec3 colC = vec3(1.0, 1.0, 1.0);
      vec3 colD = vec3(0.78, 0.12, 0.54); // Anchored on Spline Royal Violet
      vec3 base = pal(modulatedT, colA, colB, colC, colD);

      // Studio overhead lighting falloff (bright velvet dome illumination)
      float topFalloff = clamp(normal.y * 0.58 + 0.48, 0.0, 1.0);
      vec3 faceColor = mix(base * 0.78, base * 1.38 + vec3(0.12, 0.08, 0.16), topFalloff);

      // Studio specular glint (upper-left)
      vec3 lightDir = normalize(vec3(0.4, 0.85, 0.75));
      vec3 halfVec = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfVec), 0.0), 34.0);
      faceColor += vec3(0.98, 0.95, 1.0) * spec * 0.55;

      // Ethereal Fresnel Rim Aura (soft iridescence edge)
      float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
      fresnel = pow(fresnel, 2.2);
      vec3 rim = mix(vec3(0.98, 0.94, 1.0), base * 1.45, 0.35);
      faceColor = mix(faceColor, rim, fresnel * 0.56);

      // Speaking cheerful energy pulse
      faceColor += vec3(0.08, 0.05, 0.12) * (sin(uTime * 14.0) * 0.5 + 0.5) * uIsSpeaking;

      // -----------------------------------------------------------------
      // PROJECTED 2D KAWAII FACE WITH SOFT GLOW BLOOM BLENDING
      // -----------------------------------------------------------------
      if (vLocalPosition.z > 0.04) {
        vec2 faceUv = vec2(
          (vLocalPosition.x / 0.48) * 0.5 + 0.5,
          (vLocalPosition.y / 0.28) * 0.5 + 0.5
        );

        if (faceUv.x >= 0.0 && faceUv.x <= 1.0 && faceUv.y >= 0.0 && faceUv.y <= 1.0) {
          vec4 faceTex = texture2D(uFaceTexture, faceUv);

          // Additive outer bloom around eyes and mouth
          float bloom = faceTex.a * 0.4;
          faceColor += vec3(1.0, 0.95, 1.0) * bloom;

          // Blend crisp face features onto surface
          faceColor = mix(faceColor, faceTex.rgb, faceTex.a);
        }
      }

      gl_FragColor = vec4(faceColor, 1.0);
    }
  `,
};

// =======================================================================
// MASTER 3D ROBOT COMPONENT (ADVANCED LIGHTING, PHYSICS & EFFECTS)
// =======================================================================
const RobotKawaiiMaster = ({ isSpeaking = false }: { isSpeaking?: boolean }) => {
  const rootRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const faceLightRef = useRef<THREE.PointLight>(null);

  // Interaction & animation states
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const clickProgress = useRef(0);

  // Expression & animation timers
  const expressionTimer = useRef(0);
  const currentExpression = useRef<'neutral' | 'happy' | 'wink' | 'talking' | 'starEyes' | 'love' | 'curious'>('neutral');
  const blinkTimer = useRef(0);
  const isBlinking = useRef(false);
  const isDoubleBlink = useRef(false);

  // Procedural assets
  const faceRenderer = useMemo(() => new KawaiiFaceRenderer(), []);
  const pbrTextures = useMemo(() => createPbrCeramicTextures(), []);
  const faceShader = useMemo(() => {
    const mat = new THREE.ShaderMaterial(OrganicKawaiiFaceShader);
    mat.uniforms.uFaceTexture.value = faceRenderer.texture;
    return mat;
  }, [faceRenderer]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.current.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      faceRenderer.dispose();
      pbrTextures.diffuseMap.dispose();
      pbrTextures.normalMap.dispose();
      pbrTextures.roughnessMap.dispose();
      faceShader.dispose();
    };
  }, [faceRenderer, pbrTextures, faceShader]);

  const handlePointerDown = useCallback(() => {
    setIsClicked(true);
    clickProgress.current = 1.0;
    currentExpression.current = Math.random() > 0.5 ? 'starEyes' : 'love';
    setTimeout(() => {
      setIsClicked(false);
      currentExpression.current = 'neutral';
    }, 1800);
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // 1. Mouse Lerp Interpolation
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // 2. Emotion State Machine
    expressionTimer.current += delta;
    if (isSpeaking) {
      currentExpression.current = 'talking';
    } else if (isClicked) {
      // Retain starEyes / love triggered on click
    } else if (expressionTimer.current > 4.6) {
      const rand = Math.random();
      if (rand > 0.78) {
        currentExpression.current = 'starEyes';
      } else if (rand > 0.58) {
        currentExpression.current = 'happy';
      } else if (rand > 0.42) {
        currentExpression.current = 'wink';
      } else if (rand > 0.26) {
        currentExpression.current = 'curious';
      } else if (rand > 0.14) {
        currentExpression.current = 'love';
      } else {
        currentExpression.current = 'neutral';
      }
      expressionTimer.current = 0;
      setTimeout(() => {
        if (!isSpeaking && !isClicked) currentExpression.current = 'neutral';
      }, 1900);
    }

    // 3. Smooth Blinking with Occasional Anime Double-Blink
    blinkTimer.current += delta;
    let blinkVal = 0;
    if (blinkTimer.current > 3.4) {
      isBlinking.current = true;
      const cycleDuration = isDoubleBlink.current ? 0.44 : 0.22;
      const prog = (blinkTimer.current - 3.4) / cycleDuration;
      if (!isDoubleBlink.current) {
        if (prog <= 0.5) blinkVal = prog * 2;
        else if (prog <= 1.0) blinkVal = (1 - prog) * 2;
        else {
          isBlinking.current = false;
          blinkTimer.current = 0;
          isDoubleBlink.current = Math.random() > 0.65;
        }
      } else {
        const subProg = (prog * 2) % 1;
        blinkVal = subProg < 0.5 ? subProg * 2 : (1 - subProg) * 2;
        if (prog >= 1.0) {
          isBlinking.current = false;
          blinkTimer.current = 0;
          isDoubleBlink.current = false;
        }
      }
    }

    // 4. Talking & Expression Mouth Animation
    const mouthOpen = isSpeaking ? (Math.sin(t * 16.0) * 0.5 + 0.5) * 0.95 : isClicked ? 0.8 : 0;

    // 5. Update Dynamic 2D Kawaii Face
    faceRenderer.update({
      blink: blinkVal,
      expression: currentExpression.current,
      mouth: mouthOpen,
      lookX: mx,
      lookY: my,
      isSpeaking,
      time: t,
    });

    // 6. Update Color-Changing Shader & Dynamic Face Light Color
    if (faceShader) {
      faceShader.uniforms.uTime.value = t;
      faceShader.uniforms.uIsSpeaking.value = isSpeaking ? 1.0 : 0.0;
      faceShader.uniforms.uFaceTexture.value = faceRenderer.texture;
    }

    // Dynamic point light that casts changing colors onto collar and ears
    if (faceLightRef.current) {
      const hue = (t * 0.125) % 1.0;
      faceLightRef.current.color.setHSL(hue, 0.85, 0.65);
      faceLightRef.current.intensity = 1.6 + (isSpeaking ? 0.8 : 0);
    }

    // 7. Click Jump Physics (Bouncy joyful anime hop)
    if (clickProgress.current > 0) {
      clickProgress.current = Math.max(0, clickProgress.current - delta * 1.5);
    }
    const clickVal = 1 - clickProgress.current;
    const clickHop = clickProgress.current > 0
      ? Math.sin(clickVal * Math.PI) * 0.14 + Math.max(0, Math.sin(clickVal * Math.PI * 2) * 0.04)
      : 0;
    const clickTwist = clickProgress.current > 0
      ? Math.sin(clickVal * Math.PI * 2) * 0.12
      : 0;

    // 8. Pure Sphere Floating, Hovering & Living Breathing (Organic Flying Orb)
    if (rootRef.current) {
      const breathe = 1.0 + Math.sin(t * 2.5) * 0.025;
      rootRef.current.scale.set(0.95 * breathe, 0.95 * breathe, 0.95 * breathe);

      const hoverFloat = Math.sin(t * 1.6) * 0.045 + Math.sin(t * 3.2) * 0.015;
      const hoverDriftX = Math.sin(t * 1.2) * 0.02;
      const speechBob = isSpeaking ? Math.sin(t * 14.0) * 0.02 : 0;
      rootRef.current.position.y = hoverFloat + speechBob + clickHop;
      rootRef.current.position.x = hoverDriftX;

      // Inquisitive orientation towards mouse cursor
      const targetRotY = mx * 0.45;
      const targetRotX = -my * 0.30;
      const curiousRoll = (currentExpression.current === 'curious' ? 0.1 : 0) + Math.sin(t * 1.4) * 0.03;
      const targetRotZ = -mx * 0.12 + curiousRoll + clickTwist;

      rootRef.current.rotation.y += (targetRotY - rootRef.current.rotation.y) * 0.10;
      rootRef.current.rotation.x += (targetRotX - rootRef.current.rotation.x) * 0.10;
      rootRef.current.rotation.z += (targetRotZ - rootRef.current.rotation.z) * 0.08;
    }
  });

  return (
    <group
      ref={rootRef}
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
    >
      {/* Dynamic Point Light from glowing sphere */}
      <pointLight ref={faceLightRef} position={[0, 0, 0.4]} distance={2.8} decay={2} intensity={2.0} />

      {/* ================= PURA BOLITA MÁGICA 3D (ESFERA PLASMA + CARITA KAWAII + CÚPULA DE CRISTAL) ================= */}
      <group ref={headGroupRef} position={[0, 0, 0]}>
        {/* A. INNER PLASMA COLOR-CHANGING SPHERE WITH KAWAII FACE PROJECTED */}
        <mesh material={faceShader}>
          <sphereGeometry args={[0.82, 64, 64]} />
        </mesh>

        {/* B. OUTER CRYSTAL CLEAR GLASS HELMET WITH CLEARCOAT GLOSS */}
        <mesh>
          <sphereGeometry args={[0.88, 64, 64]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.04}
            metalness={0.05}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
            transparent={true}
            opacity={0.34}
            reflectivity={0.98}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

// =======================================================================
// EXPORTED SCENE CONTAINER (MAGICAL SPARKLES, CONTACT SHADOWS & STUDIO RIG)
// =======================================================================
export function Scene3D({
  isSpeaking = false,
  className = '',
}: {
  isSpeaking?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`w-full h-full relative overflow-hidden flex items-center justify-center select-none cursor-pointer ${className}`}
      title="Haz clic en el robot para interactuar"
    >
      <Canvas
        camera={{ position: [0, 0.05, 3.7], fov: 38 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1}
      >
        {/* Soft Studio Lighting Setup */}
        <ambientLight intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[3.2, 5.0, 4.0]} intensity={1.8} color="#FFFFFF" />
        <directionalLight position={[-3.2, 2.2, 2.5]} intensity={0.9} color="#F5F3FF" />
        <directionalLight position={[0, 4.5, -2.8]} intensity={0.8} color="#EDE9FE" />
        <directionalLight position={[0, -2.5, 2.0]} intensity={0.4} color="#FFFFFF" />

        {/* Realistic Studio Contact Shadow on Ground (scaled to 3.24 for 0.9x model) */}
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.48}
          scale={3.24}
          blur={2.4}
          far={3.5}
          color="#3A2A48"
        />

        {/* Ambient Magical Floating Stardust Sparkles */}
        <Sparkles
          count={isSpeaking ? 42 : 28}
          scale={[3.2, 3.2, 2.2]}
          size={isSpeaking ? 3.0 : 2.2}
          speed={0.5}
          color="#E9D5FF"
        />
        <Sparkles
          count={14}
          scale={[2.4, 2.4, 1.8]}
          size={1.8}
          speed={0.7}
          color="#FDE68A"
        />

        {/* Natural Organic Floating Group */}
        <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.22}>
          <RobotKawaiiMaster isSpeaking={isSpeaking} />
        </Float>
      </Canvas>
    </div>
  );
}
