/// <reference types="vite/client" />

// vite-env.d.ts

/// <reference types="vite/client" />

// Tambahkan blok kode ini di bawah
interface Window {
  ethereum?: import('ethers').Eip1193Provider;
}