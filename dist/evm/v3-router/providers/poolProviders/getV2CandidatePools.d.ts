import { BigintIsh, Currency } from '@pancakeswap/sdk';
import { Currency as CurrencyJSBI } from '@cryptoalgebra/custom-pools-sdk';
import { WithFallbackOptions } from '../../../utils/withFallback';
import { OnChainProvider, StablePoolWithTvl, SubgraphProvider, V2PoolWithTvl } from '../../types';
import { CommonTokenPriceProvider } from '../getCommonTokenPrices';
export type GetV2PoolsParams = {
    currencyA?: Currency | CurrencyJSBI;
    currencyB?: Currency | CurrencyJSBI;
    onChainProvider?: OnChainProvider;
    blockNumber?: BigintIsh;
    pairs?: [Currency, Currency][];
};
type SubgraphProviders = {
    v2SubgraphProvider?: SubgraphProvider;
    v3SubgraphProvider?: SubgraphProvider;
};
type Params = GetV2PoolsParams & SubgraphProviders;
export declare function createV2PoolsProviderByCommonTokenPrices<T = any>(getCommonTokenPrices: CommonTokenPriceProvider<T>): ({ currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber, ...rest }: GetV2PoolsParams & T) => Promise<(V2PoolWithTvl | StablePoolWithTvl)[]>;
export declare const getV2PoolsWithTvlByCommonTokenPrices: ({ currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber, ...rest }: GetV2PoolsParams & {
    v3SubgraphProvider?: SubgraphProvider | undefined;
}) => Promise<(V2PoolWithTvl | StablePoolWithTvl)[]>;
type GetV2Pools<T = any> = (params: GetV2PoolsParams & T) => Promise<(V2PoolWithTvl | StablePoolWithTvl)[]>;
export declare function createGetV2CandidatePools<T = any>(defaultGetV2Pools: GetV2Pools<T>, options?: WithFallbackOptions<GetV2Pools<T>>): (params: GetV2PoolsParams & T) => Promise<Omit<V2PoolWithTvl, "tvlUSD">[]>;
export declare function getV2CandidatePools(params: Params): Promise<Omit<V2PoolWithTvl, "tvlUSD">[]>;
export {};
//# sourceMappingURL=getV2CandidatePools.d.ts.map