// src/App.tsx

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

// Komponen ini sekarang adalah Orb kita yang lebih canggih
function NexusOrb() {
  const meshRef = useRef<Mesh>(null!);

  // useFrame untuk animasi yang berkelanjutan
  // 'state.clock.getElapsedTime()' akan memberi kita waktu yang terus berjalan sejak aplikasi dimulai
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotasi seperti sebelumnya
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;

    // Gerakan naik-turun yang halus menggunakan fungsi sinus
    meshRef.current.position.y = Math.sin(time) * 0.3; 
  });

  return (
    <mesh ref={meshRef}>
      {/* Ganti bentuknya menjadi bola (Sphere) dengan detail yang cukup */}
      <sphereGeometry args={[1.5, 32, 32]} />
      
      {/* Ganti materialnya menjadi lebih menarik */}
      <meshStandardMaterial 
        color="#0077ff"    // Warna dasar biru
        metalness={0.7}     // Terlihat lebih seperti logam
        roughness={0.2}     // Permukaan yang sedikit kasar
        emissive="#00aaff"  // Warna cahaya yang dipancarkan dari objek itu sendiri
        emissiveIntensity={0.5} // Intensitas cahaya yang dipancarkan
      />
    </mesh>
  );
}

// Komponen App utama
export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      {/* Cahaya untuk menerangi objek dari berbagai arah */}
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Menempatkan Nexus Orb kita di dalam adegan */}
      <NexusOrb />
    </Canvas>
  );
}