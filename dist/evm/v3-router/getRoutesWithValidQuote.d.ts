import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk';
import { AbortControl } from '../utils/abortControl';
import { BaseRoute, GasModel, QuoteProvider, RouteWithQuote } from './types';
type Params = {
    blockNumber?: BigintIsh;
    amount: CurrencyAmount<Currency>;
    baseRoutes: BaseRoute[];
    distributionPercent: number;
    quoteProvider: QuoteProvider;
    tradeType: TradeType;
    gasModel: GasModel;
    quoterOptimization?: boolean;
} & AbortControl;
export declare function getRoutesWithValidQuote({ amount, baseRoutes, distributionPercent, quoteProvider, tradeType, blockNumber, gasModel, quoterOptimization, signal, }: Params): Promise<RouteWithQuote[]>;
export {};
//# sourceMappingURL=getRoutesWithValidQuote.d.ts.map