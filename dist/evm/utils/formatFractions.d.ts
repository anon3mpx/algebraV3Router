import { Percent, Fraction, Price, Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core';
export declare function formatPercent(percent?: Percent, precision?: number): string | undefined;
export declare function formatFraction(fraction?: Fraction | null | undefined, precision?: number | undefined): string | undefined;
export declare function formatPrice(price?: Price<Currency, Currency> | null | undefined, precision?: number | undefined): string | undefined;
export declare function formatAmount(amount?: CurrencyAmount<Currency> | null | undefined, precision?: number | undefined): string | undefined;
export declare function parseNumberToFraction(num: number, precision?: number): Fraction | undefined;
//# sourceMappingURL=formatFractions.d.ts.map