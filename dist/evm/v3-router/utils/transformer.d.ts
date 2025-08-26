import { CurrencyAmount, Currency, TradeType } from '@pancakeswap/sdk';
import { ChainId } from '../../chains/src';
import { Address } from 'viem';
import { Pool, Route, SmartRouterTrade, StablePool, V2Pool, V3Pool } from '../types';
export interface SerializedCurrency {
    address: Address;
    decimals: number;
    symbol: string;
}
export interface SerializedCurrencyAmount {
    currency: SerializedCurrency;
    value: string;
}
export interface SerializedV2Pool extends Omit<V2Pool, 'reserve0' | 'reserve1'> {
    reserve0: SerializedCurrencyAmount;
    reserve1: SerializedCurrencyAmount;
}
export interface SerializedStablePool extends Omit<StablePool, 'reserve0' | 'reserve1'> {
    reserve0: SerializedCurrencyAmount;
    reserve1: SerializedCurrencyAmount;
}
export interface SerializedV3Pool extends Omit<V3Pool, 'token0' | 'token1' | 'liquidity' | 'sqrtRatioX96' | 'token0ProtocolFee' | 'token1ProtocolFee'> {
    token0: SerializedCurrency;
    token1: SerializedCurrency;
    liquidity: string;
    sqrtRatioX96: string;
    token0ProtocolFee: string;
    token1ProtocolFee: string;
}
export type SerializedPool = SerializedV2Pool | SerializedV3Pool | SerializedStablePool;
export interface SerializedRoute extends Omit<Route, 'pools' | 'path' | 'input' | 'output' | 'inputAmount' | 'outputAmount'> {
    pools: SerializedPool[];
    path: SerializedCurrency[];
    inputAmount: SerializedCurrencyAmount;
    outputAmount: SerializedCurrencyAmount;
}
export interface SerializedTrade extends Omit<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'gasEstimate' | 'gasEstimateInUSD' | 'routes'> {
    inputAmount: SerializedCurrencyAmount;
    outputAmount: SerializedCurrencyAmount;
    gasEstimate: string;
    gasEstimateInUSD: SerializedCurrencyAmount;
    routes: SerializedRoute[];
}
export declare function serializeCurrency(currency: Currency): SerializedCurrency;
export declare function serializeCurrencyAmount(amount: CurrencyAmount<Currency>): SerializedCurrencyAmount;
export declare function serializePool(pool: Pool): SerializedPool;
export declare function serializeRoute(route: Route): SerializedRoute;
export declare function serializeTrade(trade: SmartRouterTrade<TradeType>): SerializedTrade;
export declare function parseCurrency(chainId: ChainId, currency: SerializedCurrency): Currency;
export declare function parseCurrencyAmount(chainId: ChainId, amount: SerializedCurrencyAmount): CurrencyAmount<Currency>;
export declare function parsePool(chainId: ChainId, pool: SerializedPool): Pool;
export declare function parseRoute(chainId: ChainId, route: SerializedRoute): Route;
export declare function parseTrade(chainId: ChainId, trade: SerializedTrade): SmartRouterTrade<TradeType>;
//# sourceMappingURL=transformer.d.ts.map