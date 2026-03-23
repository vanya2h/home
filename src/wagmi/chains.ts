import { type Chain, mainnet } from "viem/chains";

export enum SupportedChainEnum {
  MAINNET,
}

export const supportedChains = {
  [SupportedChainEnum.MAINNET]: mainnet,
} as const satisfies Record<SupportedChainEnum, Chain>;
