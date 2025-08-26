import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk';
import { Currency as CurrencyJSBI, CurrencyAmount as CurrencyAmountJSBI } from '@cryptoalgebra/custom-pools-sdk';
import { TradeConfig, SmartRouterTrade } from './types';
export declare function getBestTrade(amount: CurrencyAmount<Currency> | CurrencyAmountJSBI<CurrencyJSBI>, currency: Currency | CurrencyJSBI, tradeType: TradeType, config: TradeConfig): Promise<SmartRouterTrade<TradeType> | null>;
//# sourceMappingURL=getBestTrade.d.ts.map