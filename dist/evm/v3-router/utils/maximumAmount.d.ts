import { Percent, TradeType, CurrencyAmount, Currency } from '@pancakeswap/sdk';
import { Percent as PercentJSBI, CurrencyAmount as CurrencyAmountJSBI } from '@cryptoalgebra/custom-pools-sdk';
import { SmartRouterTrade } from '../types';
export declare function maximumAmountIn(trade: SmartRouterTrade<TradeType>, slippage: PercentJSBI, amountIn?: CurrencyAmountJSBI<import("@cryptoalgebra/custom-pools-sdk").Currency>): CurrencyAmountJSBI<import("@cryptoalgebra/custom-pools-sdk").Currency>;
export declare function maximumAmountInBN(trade: SmartRouterTrade<TradeType>, slippage: Percent | PercentJSBI, amountIn?: CurrencyAmountJSBI<import("@cryptoalgebra/custom-pools-sdk").Currency>): CurrencyAmount<Currency>;
export declare function minimumAmountOut(trade: SmartRouterTrade<TradeType>, slippage: PercentJSBI, amountOut?: CurrencyAmountJSBI<import("@cryptoalgebra/custom-pools-sdk").Currency>): CurrencyAmountJSBI<import("@cryptoalgebra/custom-pools-sdk").Currency>;
export declare function minimumAmountOutBN(trade: SmartRouterTrade<TradeType>, slippage: Percent | PercentJSBI, amountOut?: CurrencyAmountJSBI<import("@cryptoalgebra/custom-pools-sdk").Currency>): CurrencyAmount<Currency>;
//# sourceMappingURL=maximumAmount.d.ts.map