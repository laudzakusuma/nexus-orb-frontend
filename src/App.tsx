// Lokasi: nexus-orb-frontend/src/App.tsx

import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
    <Canvas>
      {/* Cahaya yang sangat terang agar objek pasti terlihat */}
      <ambientLight intensity={5} /> 
      
      {/* Objek statis sederhana tanpa animasi */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
    </Canvas>
  );
}