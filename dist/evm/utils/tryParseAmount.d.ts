import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core';
export declare function parseUnits(value: string, decimals: number): bigint;
declare function tryParseAmount<T extends Currency>(value?: string, currency?: T): CurrencyAmount<T> | undefined;
export default tryParseAmount;
//# sourceMappingURL=tryParseAmount.d.ts.map