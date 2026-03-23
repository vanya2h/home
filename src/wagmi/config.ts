import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { SupportedChainEnum } from "./chains";

export type IRpcDictionary = Record<SupportedChainEnum, string>;

export function createRpcDictionary(dictionary: IRpcDictionary) {
  return { ...dictionary };
}

export type IWagmiConfig = {
  rpcs: IRpcDictionary;
};

export function getWagmiConfig({ rpcs }: IWagmiConfig) {
  return createConfig({
    chains: [mainnet],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [mainnet.id]: http(rpcs[SupportedChainEnum.MAINNET]),
    },
  });
}
