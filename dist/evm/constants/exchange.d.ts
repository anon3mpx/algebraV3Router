import { ChainId } from "../chains/src";
import { Token } from "@pancakeswap/sdk";
import { ChainTokenList } from "../types";
export declare const SMART_ROUTER_ADDRESSES: {
  readonly 943: "0xe227B51F5D7079fAa07b7621657e3aa5906d2185";
};
export declare const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList;
/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export declare const ADDITIONAL_BASES: {
  [chainId in ChainId]?: {
    [tokenAddress: string]: Token[];
  };
};
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export declare const CUSTOM_BASES: {
  [chainId in ChainId]?: {
    [tokenAddress: string]: Token[];
  };
};
//# sourceMappingURL=exchange.d.ts.map
