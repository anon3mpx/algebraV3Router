import { ChainId } from "../../chains/src";
import { StableSwapPool } from "./types";
export type StableSwapPoolMap<TChainId extends number> = {
    [chainId in TChainId]: StableSwapPool[];
};
export declare const isStableSwapSupported: (chainId: number | undefined) => chainId is ChainId;
export declare const STABLE_SUPPORTED_CHAIN_IDS: readonly [ChainId];
export type StableSupportedChainId = (typeof STABLE_SUPPORTED_CHAIN_IDS)[number];
export declare const STABLE_POOL_MAP: {
    84532: never[];
};
//# sourceMappingURL=pools.d.ts.map