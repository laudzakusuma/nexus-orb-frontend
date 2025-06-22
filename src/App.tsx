// src/App.tsx

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import axios from 'axios'; // Impor axios

// --- Komponen Baru untuk Menampilkan Info ---
function Info({ totalOrbs }: { totalOrbs: number }) {
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: '24px', fontFamily: 'monospace' }}>
      <p>Nexus Orb Genesis</p>
      <p>Total Orbs Minted: {totalOrbs}</p>
    </div>
  );
}

// Komponen Orb kita tetap sama
function NexusOrb() {
  const meshRef = useRef<Mesh>(null!);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.y = Math.sin(time) * 0.3; 
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial 
        color="#0077ff" metalness={0.7} roughness={0.2}
        emissive="#00aaff" emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// Komponen App utama kita sekarang punya state dan logika data
export default function App() {
  // useState untuk menyimpan jumlah total Orb yang kita dapatkan dari backend
  const [totalOrbs, setTotalOrbs] = useState<number>(0);

  // useEffect akan berjalan satu kali saat komponen pertama kali dirender
  useEffect(() => {
    // Fungsi async untuk mengambil data dari API backend kita
    const fetchData = async () => {
      try {
        console.log("Mencoba mengambil data dari backend...");
        const response = await axios.get('http://localhost:3001/api/total-orbs');
        // Jika berhasil, perbarui state kita dengan data tersebut
        setTotalOrbs(Number(response.data.totalOrbs));
        console.log("Data berhasil diambil:", response.data);
      } catch (error) {
        console.error("Gagal mengambil data dari backend:", error);
      }
    };

    fetchData(); // Panggil fungsi tersebut
  }, []); // Array dependensi kosong berarti ini hanya berjalan sekali

  return (
    // Kita menggunakan <> (React Fragment) untuk membungkus Canvas dan Info
    <>
      <Info totalOrbs={totalOrbs} />
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <NexusOrb />
      </Canvas>
    </>
  );
}