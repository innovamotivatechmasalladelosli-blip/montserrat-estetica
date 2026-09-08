import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const KawaiiOrb = () => {
  const orbRef = useRef<THREE.Group>(null);
  const innerLight1 = useRef<THREE.Mesh>(null);
  const innerLight2 = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile to lower resolution for performance
    setIsMobile(window.innerWidth < 768);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef.current) {
      // Breathing squash and stretch
      orbRef.current.scale.y = 1 + Math.sin(t * 3) * 0.03;
      orbRef.current.scale.x = 1 - Math.sin(t * 3) * 0.015;
      orbRef.current.scale.z = 1 - Math.sin(t * 3) * 0.015;
      
      // Target rotation based on mouse + gentle idle sway
      const targetX = mouse.current.y * 0.4 + Math.cos(t * 1.2) * 0.1;
      const targetY = mouse.current.x * 0.5 + Math.sin(t * 0.8) * 0.15;
      
      // Smooth interpolation
      orbRef.current.rotation.x += (targetX - orbRef.current.rotation.x) * 0.08;
      orbRef.current.rotation.y += (targetY - orbRef.current.rotation.y) * 0.08;
    }

    // Animate inner floating lights
    if (innerLight1.current && innerLight2.current) {
      innerLight1.current.position.set(
        Math.sin(t * 0.8) * 0.5,
        Math.cos(t * 1.2) * 0.5,
        Math.sin(t * 1.5) * 0.5
      );
      innerLight2.current.position.set(
        Math.cos(t * 1.0) * 0.6,
        Math.sin(t * 0.9) * 0.6,
        Math.cos(t * 1.3) * 0.6
      );
    }
  });

  return (
    <Float speed={3} rotationIntensity={0} floatIntensity={1.5}>
      <group ref={orbRef}>
        {/* Main Body - Frosted Glass Translucent Shell */}
        <mesh>
          <sphereGeometry args={[isMobile ? 1.2 : 1.4, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
          <meshPhysicalMaterial 
            color="#FFF4E0"
            transmission={0.9}
            opacity={1}
            transparent={true}
            roughness={0.15}
            ior={1.5}
            thickness={2}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Inner Glowing Cores / Lights - AI Energy */}
        <mesh ref={innerLight1}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color="#00f3ff" /> {/* AI Cyan */}
        </mesh>
        <mesh ref={innerLight2}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshBasicMaterial color="#ffffff" /> {/* Pure bright white */}
        </mesh>
        
        {/* Actual light source to illuminate the inside */}
        <pointLight position={[0, 0, 0]} distance={5} intensity={3} color="#00f3ff" />
        
        {/* Face Elements */}
        <group scale={isMobile ? 0.85 : 1}>
          {/* Left Eye */}
          <mesh position={[-0.35, 0.15, 1.35]} scale={[0.08, 0.16, 0.05]} rotation={[0, -0.2, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#4A3C31" />
          </mesh>
          
          {/* Right Eye */}
          <mesh position={[0.35, 0.15, 1.35]} scale={[0.08, 0.16, 0.05]} rotation={[0, 0.2, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#4A3C31" />
          </mesh>
          
          {/* Blush Left */}
          <mesh position={[-0.6, -0.05, 1.25]} scale={[0.16, 0.08, 0.05]} rotation={[0, -0.4, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#E8B4B8" transparent opacity={0.6} />
          </mesh>
          
          {/* Blush Right */}
          <mesh position={[0.6, -0.05, 1.25]} scale={[0.16, 0.08, 0.05]} rotation={[0, 0.4, 0]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#E8B4B8" transparent opacity={0.6} />
          </mesh>

          {/* Tiny Smile */}
          <mesh position={[0, -0.05, 1.39]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.05, 0.015, 16, 32, Math.PI]} />
            <meshBasicMaterial color="#4A3C31" />
          </mesh>
        </group>
      </group>
    </Float>
  );
};

export function Scene3D() {
  // Se calcula en el primer render (no en un efecto): las opciones `gl` solo se leen
  // al crear el contexto WebGL, así que un valor tardío no se aplicaría nunca.
  const [isMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-100">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          alpha: true,
          // En móvil el antialias + "high-performance" dispara el coste de GPU y
          // provoca pérdidas de contexto en gamas medias.
          antialias: !isMobile,
          powerPreference: isMobile ? 'default' : 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={isMobile ? 1 : [1, 2]}
        // El canvas nunca debe capturar toques: es puramente decorativo.
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#B89A72" />
          
          <KawaiiOrb />
          
          {/* Sin prop `files`: con `files={null}` drei intenta cargar una URL nula y lanza. */}
          <Environment resolution={64} background={false}>
            {/* Extremely lightweight environment fallback to provide reflections */}
            <mesh>
              <sphereGeometry args={[50, 16, 16]} />
              <meshBasicMaterial color="#ffffff" side={THREE.BackSide} />
            </mesh>
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
