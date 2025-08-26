import { BigintIsh, Currency, CurrencyAmount } from '@pancakeswap/sdk';
import { BatchMulticallConfigs, ChainMap } from '../../types';
import { OnChainProvider, QuoteProvider } from '../types';
type AdjustQuoteForGasHandler = (params: {
    isExactIn?: boolean;
    quote: CurrencyAmount<Currency>;
    gasCostInToken: CurrencyAmount<Currency>;
}) => CurrencyAmount<Currency>;
interface ProviderConfig {
    onChainProvider: OnChainProvider;
    gasLimit?: BigintIsh;
    multicallConfigs?: ChainMap<BatchMulticallConfigs>;
    onAdjustQuoteForGas?: AdjustQuoteForGasHandler;
}
export declare class BlockConflictError extends Error {
    name: string;
}
export declare class SuccessRateError extends Error {
    name: string;
}
export declare class ProviderBlockHeaderError extends Error {
    name: string;
}
export declare class ProviderTimeoutError extends Error {
    name: string;
}
/**
 * This error typically means that the gas used by the multicall has
 * exceeded the total call gas limit set by the node provider.
 *
 * This can be resolved by modifying BatchParams to request fewer
 * quotes per call, or to set a lower gas limit per quote.
 *
 * @export
 * @class ProviderGasError
 */
export declare class ProviderGasError extends Error {
    name: string;
}
export declare const createMixedRouteOnChainQuoteProvider: ({ onChainProvider, gasLimit, multicallConfigs: multicallConfigsOverride, onAdjustQuoteForGas, }: ProviderConfig) => QuoteProvider;
export declare const createV3OnChainQuoteProvider: ({ onChainProvider, gasLimit, multicallConfigs: multicallConfigsOverride, onAdjustQuoteForGas, }: ProviderConfig) => QuoteProvider;
export {};
//# sourceMappingURL=onChainQuoteProvider.d.ts.map