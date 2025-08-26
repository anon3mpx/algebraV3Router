import { BigintIsh, Currency } from "@pancakeswap/sdk";
import { OnChainProvider, StablePool, V2Pool, V3Pool } from "../../types";
export declare const getV2PoolsOnChain: (pairs: [Currency, Currency][], provider?: OnChainProvider, blockNumber?: BigintIsh) => Promise<(V2Pool | StablePool)[]>;
export declare const getV3PoolsWithoutTicksOnChain: (pairs: [Currency, Currency][], provider?: OnChainProvider, blockNumber?: BigintIsh) => Promise<V3Pool[]>;
//# sourceMappingURL=onChainPoolProviders.d.ts.map