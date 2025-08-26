import { BigintIsh, Currency } from '@pancakeswap/sdk';
import { Currency as CurrencyJSBI } from '@cryptoalgebra/custom-pools-sdk';
import { OnChainProvider, SubgraphProvider, V3PoolWithTvl } from '../../types';
import { WithFallbackOptions } from '../../../utils/withFallback';
export type { GetV3PoolsParams as GetV3CandidatePoolsParams };
export type GetV3PoolsParams = {
    currencyA?: Currency | CurrencyJSBI;
    currencyB?: Currency | CurrencyJSBI;
    subgraphProvider?: SubgraphProvider;
    onChainProvider?: OnChainProvider;
    blockNumber?: BigintIsh;
    pairs?: [Currency, Currency][];
};
type DefaultParams = GetV3PoolsParams & {
    fallbackTimeout?: number;
    subgraphFallback?: boolean;
    staticFallback?: boolean;
};
export interface V3PoolTvlReference extends Pick<V3PoolWithTvl, 'address'> {
    tvlUSD: bigint | string;
}
export declare const v3PoolsOnChainProviderFactory: <P extends GetV3PoolsParams = GetV3PoolsParams>(tvlReferenceProvider: (params: P) => Promise<V3PoolTvlReference[]>) => (params: P) => Promise<V3PoolWithTvl[]>;
export declare const getV3PoolsWithTvlFromOnChain: (params: GetV3PoolsParams) => Promise<V3PoolWithTvl[]>;
export declare const getV3PoolsWithTvlFromOnChainFallback: (params: GetV3PoolsParams) => Promise<V3PoolWithTvl[]>;
export declare const getV3PoolsWithTvlFromOnChainStaticFallback: (params: Omit<GetV3PoolsParams, "onChainProvider" | "subgraphProvider">) => Promise<V3PoolWithTvl[]>;
type GetV3Pools<T = any> = (params: GetV3PoolsParams & T) => Promise<V3PoolWithTvl[]>;
export { createGetV3CandidatePools as createGetV3CandidatePoolsWithFallbacks };
export declare function createGetV3CandidatePools<T = any>(defaultGetV3Pools: GetV3Pools<T>, options?: WithFallbackOptions<GetV3Pools<T>>): (params: GetV3PoolsParams & T) => Promise<Omit<V3PoolWithTvl, "tvlUSD">[]>;
export declare function getV3CandidatePools(params: DefaultParams): Promise<Omit<V3PoolWithTvl, "tvlUSD">[]>;
//# sourceMappingURL=getV3CandidatePools.d.ts.map