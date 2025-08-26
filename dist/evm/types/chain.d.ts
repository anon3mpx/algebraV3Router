import { Token } from '@pancakeswap/sdk';
import { ChainId } from '../chains/src';
export type ChainMap<T> = {
    readonly [chainId in ChainId]: T;
};
export type ChainTokenList = ChainMap<Token[]>;
//# sourceMappingURL=chain.d.ts.map