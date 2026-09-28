'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function TowerBuilding() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const scrollProgress = useRef(0);

  useMemo(() => {
    const st = ScrollTrigger.create({
      start: 'top top',
      end: '+=200%',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;

    // Orbit camera around the building
    const angle = p * Math.PI * 0.8 - 0.4;
    const radius = 12 - p * 4;
    const height = 4 + p * 3;
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius;
    camera.position.y = height;
    camera.lookAt(0, 3, 0);

    // Slow rotation
    groupRef.current.rotation.y += delta * 0.05;
  });

  // Procedural building geometry
  const floors = 24;
  const floorHeight = 0.5;
  const buildingWidth = 2.2;
  const buildingDepth = 2.2;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main tower body */}
      <mesh position={[0, floors * floorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[buildingWidth, floors * floorHeight, buildingDepth]} />
        <meshStandardMaterial
          color="#3a3434"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Floor band details */}
      {Array.from({ length: floors }).map((_, i) => (
        <mesh
          key={i}
          position={[0, i * floorHeight + floorHeight / 2, 0]}
        >
          <boxGeometry args={[buildingWidth * 1.02, 0.02, buildingDepth * 1.02]} />
          <meshStandardMaterial
            color="#c8a878"
            roughness={0.4}
            metalness={0.6}
            emissive="#c8a878"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* Window strips — subtle emissive */}
      {Array.from({ length: floors }).map((_, i) => (
        <mesh
          key={`w-${i}`}
          position={[
            0,
            i * floorHeight + floorHeight / 2,
            buildingDepth / 2 + 0.01,
          ]}
        >
          <planeGeometry args={[buildingWidth * 0.85, floorHeight * 0.6]} />
          <meshStandardMaterial
            color="#5a4a3a"
            emissive="#ffc878"
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
      {Array.from({ length: floors }).map((_, i) => (
        <mesh
          key={`w2-${i}`}
          position={[
            0,
            i * floorHeight + floorHeight / 2,
            -(buildingDepth / 2 + 0.01),
          ]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[buildingWidth * 0.85, floorHeight * 0.6]} />
          <meshStandardMaterial
            color="#5a4a3a"
            emissive="#ffc878"
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Gold crown */}
      <mesh position={[0, floors * floorHeight + 0.15, 0]}>
        <boxGeometry args={[buildingWidth * 1.1, 0.1, buildingDepth * 1.1]} />
        <meshStandardMaterial
          color="#c8a050"
          roughness={0.3}
          metalness={0.8}
          emissive="#c8a050"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Base plinth */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[buildingWidth * 1.5, 0.3, buildingDepth * 1.5]} />
        <meshStandardMaterial color="#2a2422" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Ground plane */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1a1614" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

export function Building3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [8, 4, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.3}
          color="#ffc878"
        />
        <TowerBuilding />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
