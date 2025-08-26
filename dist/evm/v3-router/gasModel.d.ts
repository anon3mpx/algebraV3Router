import { BigintIsh, Currency } from '@pancakeswap/sdk';
import { GasModel, PoolProvider, PriceReferences } from './types';
type GasModelConfig = {
    gasPriceWei: BigintIsh | (() => Promise<BigintIsh>);
    blockNumber?: BigintIsh;
    poolProvider: PoolProvider;
    quoteCurrency: Currency;
} & PriceReferences;
export declare function createGasModel({ gasPriceWei, poolProvider, quoteCurrency, blockNumber, quoteCurrencyUsdPrice, nativeCurrencyUsdPrice, }: GasModelConfig): Promise<GasModel>;
export {};
//# sourceMappingURL=gasModel.d.ts.map