import { ChainId } from '../../chains/src';
import { Currency } from '@pancakeswap/sdk';
import { Address } from 'viem';
import { SubgraphProvider } from '../types';
export type GetCommonTokenPricesParams = {
    currencyA?: Currency;
    currencyB?: Currency;
};
interface BySubgraphEssentials {
    provider?: SubgraphProvider;
}
type ParamsWithFallback = GetCommonTokenPricesParams & {
    v3SubgraphProvider?: SubgraphProvider;
};
export type TokenUsdPrice = {
    address: string;
    priceUSD: string;
};
export type GetTokenPrices<T> = (params: {
    addresses: string[];
    chainId?: ChainId;
} & T) => Promise<TokenUsdPrice[]>;
export type CommonTokenPriceProvider<T> = (params: GetCommonTokenPricesParams & T) => Promise<Map<Address, number> | null>;
export declare function createCommonTokenPriceProvider<T = any>(getTokenPrices: GetTokenPrices<T>): CommonTokenPriceProvider<T>;
export declare const getTokenUsdPricesBySubgraph: GetTokenPrices<BySubgraphEssentials>;
export declare const getCommonTokenPricesBySubgraph: CommonTokenPriceProvider<BySubgraphEssentials>;
export declare const getCommonTokenPricesByLlma: CommonTokenPriceProvider<BySubgraphEssentials>;
export declare const getCommonTokenPricesByWalletApi: CommonTokenPriceProvider<BySubgraphEssentials>;
export declare const getCommonTokenPrices: (args_0: ParamsWithFallback) => Promise<any>;
export {};
//# sourceMappingURL=getCommonTokenPrices.d.ts.map