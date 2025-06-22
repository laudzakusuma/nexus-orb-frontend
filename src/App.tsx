// src/App.tsx (Versi Final & Kompleks)

import { useState, useEffect, useRef} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ethers } from 'ethers';
import { Mesh, Color } from 'three';

// --- KONFIGURASI SMART CONTRACT (GANTI DENGAN MILIK ANDA) ---
const contractAddress = "0x5F3b8A1a638De722be1C521456b1915A2871e0A3";
const contractABI = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalMinted",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "safeMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];
// ---------------------------------------------------------

// --- Tipe Data untuk Orb kita ---
interface OrbData {
  id: number;
  orbitRadius: number;
  speed: number;
  color: Color;
}

// --- Komponen HUD (Heads-Up Display) ---
function InfoUI({ account, connectWallet, handleMint, isMinting, orbCount }: { account: string | null, orbCount: number, isMinting: boolean, handleMint: () => void, connectWallet: () => void }) {
  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 100, fontFamily: 'monospace' }}>
      <h1>Nexus Orb Genesis</h1>
      <p>Total Orbs in Galaxy: {orbCount}</p>
      <hr />
      {account ? (
        <div>
          <p>Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</p>
          <button onClick={handleMint} disabled={isMinting} style={{ padding: 10, fontSize: 16 }}>
            {isMinting ? 'Minting...' : 'Mint New Orb'}
          </button>
        </div>
      ) : (
        <button onClick={connectWallet} style={{ padding: 10, fontSize: 16 }}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

// --- Komponen 3D untuk satu Orb ---
function Orb({ orbitRadius, speed, color }: OrbData) {
  const meshRef = useRef<Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Gerakan orbital menggunakan trigonometri
    meshRef.current.position.x = Math.cos(time * speed) * orbitRadius;
    meshRef.current.position.z = Math.sin(time * speed) * orbitRadius;
    // Rotasi pada sumbunya sendiri
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={color}
        metalness={0.8}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={2}
      />
    </mesh>
  );
}

// --- Komponen App Utama ---
export default function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [orbs, setOrbs] = useState<OrbData[]>([]);

  // Fungsi untuk menghasilkan data orb secara prosedural
  const generateOrbs = (count: number) => {
    const newOrbs: OrbData[] = [];
    for (let i = 0; i < count; i++) {
      newOrbs.push({
        id: i,
        orbitRadius: 4 + i * 1.5, // Setiap orb baru punya orbit lebih lebar
        speed: 0.1 + Math.random() * 0.2, // Kecepatan acak
        color: new Color(`hsl(${Math.random() * 360}, 100%, 50%)`), // Warna acak
      });
    }
    setOrbs(newOrbs);
  };
  
  // Fungsi untuk mengambil data total supply dari blockchain
 // Ganti fungsi fetchData yang lama dengan yang ini:
  const fetchData = async () => {
    try {
      // Kita tentukan tipe provider di awal
      let provider;

      // Cek apakah MetaMask (window.ethereum) ada di browser
      if (window.ethereum) {
        // Jika ada dompet, gunakan sebagai provider utama
        provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        // Jika tidak ada dompet, buat koneksi "hanya-baca" langsung ke node
        // Ini bagus untuk menampilkan data bahkan sebelum pengguna menghubungkan dompet
        provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
      }

      // Sisa kodenya tetap sama
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const total = await contract.getTotalMinted();
      generateOrbs(Number(total));

    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Gagal menghubungkan dompet", error);
      }
    } else {
      alert("Harap instal MetaMask!");
    }
  };

  const handleMint = async () => {
    if (window.ethereum && account) {
      setIsMinting(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const tx = await contract.safeMint(account);
        await tx.wait();
        
        // Ambil ulang data setelah minting berhasil untuk me-refresh scene
        await fetchData();
      } catch (error) {
        console.error("Minting gagal:", error);
      } finally {
        setIsMinting(false);
      }
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <InfoUI account={account} orbCount={orbs.length} isMinting={isMinting} handleMint={handleMint} connectWallet={connectWallet} />
      <Canvas camera={{ position: [0, 20, 30], fov: 60 }}>
        {/* Kontrol, Latar Belakang, dan Cahaya */}
        <OrbitControls />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="white" />

        {/* Render semua Orb yang ada di state */}
        {orbs.map(orb => (
          <Orb key={orb.id} {...orb} />
        ))}

        {/* Efek Visual Post-Processing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}