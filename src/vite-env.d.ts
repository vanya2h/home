/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA: string;
  readonly VITE_MAINNET_RPC: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
