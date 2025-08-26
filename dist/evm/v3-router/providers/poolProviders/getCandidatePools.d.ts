import { BigintIsh, Currency } from "@pancakeswap/sdk";
import { OnChainProvider, Pool, PoolType, SubgraphProvider } from "../../types";
export type GetCandidatePoolsParams = {
    currencyA?: Currency;
    currencyB?: Currency;
    pairs?: [Currency, Currency][];
    onChainProvider?: OnChainProvider;
    v2SubgraphProvider?: SubgraphProvider;
    v3SubgraphProvider?: SubgraphProvider;
    blockNumber?: BigintIsh;
    protocols?: PoolType[];
};
export declare function getCandidatePools({ protocols, v2SubgraphProvider, v3SubgraphProvider, ...rest }: GetCandidatePoolsParams): Promise<Pool[]>;
//# sourceMappingURL=getCandidatePools.d.ts.map