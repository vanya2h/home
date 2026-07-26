/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA: string;
  readonly VITE_MAINNET_RPC: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
