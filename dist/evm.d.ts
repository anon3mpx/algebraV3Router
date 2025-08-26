import * as _pancakeswap_sdk from '@pancakeswap/sdk';
import { Percent, Token, CurrencyAmount, Currency, BigintIsh, TradeType, Price as Price$1 } from '@pancakeswap/sdk';
import { SerializedWrappedToken } from '@pancakeswap/token-lists';
import * as viem from 'viem';
import { Address, PublicClient, Abi } from 'viem';
import * as lodash from 'lodash';
import { Tick, MintSpecificOptions, IncreaseSpecificOptions, MethodParameters, Position, PermitOptions, FeeOptions } from '@pancakeswap/v3-sdk';
import * as _cryptoalgebra_custom_pools_sdk from '@cryptoalgebra/custom-pools-sdk';
import { CurrencyAmount as CurrencyAmount$1, Currency as Currency$1, TradeType as TradeType$1, Price, Percent as Percent$1, Token as Token$1 } from '@cryptoalgebra/custom-pools-sdk';
import { GraphQLClient } from 'graphql-request';
import { Options } from 'async-retry';
import * as viem__types_actions_public_verifyTypedData from 'viem/_types/actions/public/verifyTypedData';
import * as viem__types_actions_public_verifyMessage from 'viem/_types/actions/public/verifyMessage';
import * as viem__types_actions_wallet_sendRawTransaction from 'viem/_types/actions/wallet/sendRawTransaction';
import * as viem__types_actions_public_getProof from 'viem/_types/actions/public/getProof';
import * as viem__types_types_filter from 'viem/_types/types/filter';
import * as viem__types_actions_ens_getEnsText from 'viem/_types/actions/ens/getEnsText';
import * as viem__types_actions_ens_getEnsAvatar from 'viem/_types/actions/ens/getEnsAvatar';
import * as viem__types_actions_public_getContractEvents from 'viem/_types/actions/public/getContractEvents';
import * as abitype from 'abitype';
import * as viem__types_types_contract from 'viem/_types/types/contract';
import { z } from 'zod';
import debug from 'debug';

declare const BIG_INT_TEN: bigint;
declare const BIPS_BASE: bigint;
declare const MIN_BNB: bigint;
declare const BETTER_TRADE_LESS_HOPS_THRESHOLD: Percent;

declare enum ChainId {
    BASE_SEPOLIA = 84532
}

type ChainMap<T> = {
    readonly [chainId in ChainId]: T;
};
type ChainTokenList = ChainMap<Token[]>;

type BatchMulticallConfig = {
    gasLimitPerCall: number;
    dropUnexecutedCalls?: boolean;
};
type BatchMulticallConfigs = {
    defaultConfig: BatchMulticallConfig;
    gasErrorFailureOverride: BatchMulticallConfig;
    successRateFailureOverrides: BatchMulticallConfig;
};

declare const SMART_ROUTER_ADDRESSES: {
    readonly 84532: "0x3400D4f83c528A0E19c380d92DD100eA51d8980c";
};
declare const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList;
/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
declare const ADDITIONAL_BASES: {
    [chainId in ChainId]?: {
        [tokenAddress: string]: Token[];
    };
};
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
declare const CUSTOM_BASES: {
    [chainId in ChainId]?: {
        [tokenAddress: string]: Token[];
    };
};

declare const BASE_SWAP_COST_STABLE_SWAP: bigint;
declare const COST_PER_EXTRA_HOP_STABLE_SWAP: bigint;

declare const BASE_SWAP_COST_V2: bigint;
declare const COST_PER_EXTRA_HOP_V2: bigint;

declare const COST_PER_UNINIT_TICK: bigint;
declare const BASE_SWAP_COST_V3: (id: ChainId) => bigint;
declare const COST_PER_INIT_TICK: (id: ChainId) => bigint;
declare const COST_PER_HOP_V3: (id: ChainId) => bigint;

declare const usdGasTokensByChain: {
    84532: _pancakeswap_sdk.ERC20Token[];
};

declare const BATCH_MULTICALL_CONFIGS: ChainMap<BatchMulticallConfigs>;

declare const V2_FEE_PATH_PLACEHOLDER = 8388608;
declare const MSG_SENDER = "0x0000000000000000000000000000000000000001";
declare const ADDRESS_THIS = "0x0000000000000000000000000000000000000002";
declare const MIXED_ROUTE_QUOTER_ADDRESSES: {
    readonly 84532: "0x1c219ba68A9100E4F3475A624cf225ADA02c0F1B";
};
declare const V3_QUOTER_ADDRESSES: {
    readonly 84532: "0x1c219ba68A9100E4F3475A624cf225ADA02c0F1B";
};

interface BasePool$1 {
    lpSymbol: string;
    lpAddress: Address;
    token: SerializedWrappedToken;
    quoteToken: SerializedWrappedToken;
}
interface StableSwapPool extends BasePool$1 {
    stableSwapAddress: Address;
    infoStableSwapAddress: Address;
    stableLpFee: number;
    stableLpFeeRateOfTotalFee: number;
}

declare const isStableSwapSupported: (chainId: number | undefined) => chainId is ChainId;

declare function getStableSwapPools(chainId: ChainId): StableSwapPool[];

interface GetLPOutputParams {
    amplifier: BigintIsh;
    balances: CurrencyAmount<Currency>[];
    amounts: CurrencyAmount<Currency>[];
    totalSupply: CurrencyAmount<Currency>;
    fee: Percent;
}
declare function getLPOutput({ amplifier, balances, totalSupply, amounts, fee, }: GetLPOutputParams): CurrencyAmount<Currency>;

declare function getLPOutputWithoutFee(params: Omit<GetLPOutputParams, 'fee'>): CurrencyAmount<Currency>;

interface GetSwapOutputParams {
    amplifier: BigintIsh;
    balances: CurrencyAmount<Currency>[];
    amount: CurrencyAmount<Currency>;
    outputCurrency: Currency;
    fee: Percent;
}
declare function getSwapOutput({ amplifier, balances: balanceAmounts, outputCurrency, amount, fee, }: GetSwapOutputParams): CurrencyAmount<Currency>;
declare function getSwapOutputWithoutFee(params: Omit<GetSwapOutputParams, 'fee'>): CurrencyAmount<Currency>;
declare function getSwapInput({ amount, ...rest }: GetSwapOutputParams): CurrencyAmount<Currency>;
declare function getSwapInputWithtouFee(params: Omit<GetSwapOutputParams, 'fee'>): CurrencyAmount<Currency>;

interface Params$1 {
    amplifier: BigintIsh;
    balances: BigintIsh[];
}
/**
 * Calculate the constant D of Curve AMM formula
 * @see https://classic.curve.fi/files/stableswap-paper.pdf
 */
declare function getD({ amplifier, balances }: Params$1): bigint;

declare const index_getD: typeof getD;
declare const index_getLPOutput: typeof getLPOutput;
declare const index_getLPOutputWithoutFee: typeof getLPOutputWithoutFee;
declare const index_getSwapInput: typeof getSwapInput;
declare const index_getSwapInputWithtouFee: typeof getSwapInputWithtouFee;
declare const index_getSwapOutput: typeof getSwapOutput;
declare const index_getSwapOutputWithoutFee: typeof getSwapOutputWithoutFee;
declare namespace index {
  export {
    index_getD as getD,
    index_getLPOutput as getLPOutput,
    index_getLPOutputWithoutFee as getLPOutputWithoutFee,
    index_getSwapInput as getSwapInput,
    index_getSwapInputWithtouFee as getSwapInputWithtouFee,
    index_getSwapOutput as getSwapOutput,
    index_getSwapOutputWithoutFee as getSwapOutputWithoutFee,
  };
}

declare const getCheckAgainstBaseTokens: ((currencyA?: Currency, currencyB?: Currency) => Token[]) & lodash.MemoizedFunction;
declare const getPairCombinations: ((currencyA?: Currency, currencyB?: Currency) => [Currency, Currency][]) & lodash.MemoizedFunction;

declare enum PoolType {
    V2 = 0,
    V3 = 1,
    STABLE = 2
}
interface BasePool {
    type: PoolType;
}
interface V2Pool extends BasePool {
    type: PoolType.V2;
    reserve0: CurrencyAmount<Currency>;
    reserve1: CurrencyAmount<Currency>;
}
interface StablePool extends BasePool {
    type: PoolType.STABLE;
    reserve0: CurrencyAmount<Currency>;
    reserve1: CurrencyAmount<Currency>;
}
interface V3Pool extends BasePool {
    type: PoolType.V3;
    token0: Currency;
    token1: Currency;
    fee: number;
    liquidity: bigint;
    sqrtRatioX96: bigint;
    tick: number;
    address: Address;
    deployer: Address;
    token0ProtocolFee: Percent;
    token1ProtocolFee: Percent;
    ticks?: Tick[];
}
type Pool = V2Pool | V3Pool | StablePool;
interface WithTvl {
    tvlUSD: bigint;
}
type V3PoolWithTvl = V3Pool & WithTvl;
type V2PoolWithTvl = V2Pool & WithTvl;
type StablePoolWithTvl = StablePool & WithTvl;

interface GasCost {
    gasEstimate: bigint;
    gasCostInToken: CurrencyAmount<Currency>;
    gasCostInUSD: CurrencyAmount<Currency>;
}

declare enum RouteType {
    V2 = 0,
    V3 = 1,
    STABLE = 2,
    MIXED = 3,
    MM = 4
}
interface BaseRoute {
    type: RouteType;
    pools: Pool[];
    path: Currency[];
    input: Currency;
    output: Currency;
}
interface RouteWithoutQuote extends BaseRoute {
    percent: number;
    amount: CurrencyAmount<Currency>;
}
type RouteEssentials = Omit<RouteWithoutQuote, 'input' | 'output' | 'amount'>;
interface Route extends RouteEssentials {
    feeList?: bigint[];
    amountOutList?: bigint[];
    amountInList?: bigint[];
    sqrtPriceX96AfterList?: bigint[];
    inputAmount: CurrencyAmount$1<Currency$1>;
    outputAmount: CurrencyAmount$1<Currency$1>;
}
interface RouteQuote extends GasCost {
    quoteAdjustedForGas: CurrencyAmount<Currency>;
    quote: CurrencyAmount<Currency>;
}
interface RouteQuoteV2 {
    feeList: bigint[];
    amountOutList: bigint[];
    amountInList: bigint[];
    sqrtPriceX96AfterList: bigint[];
}
type RouteWithQuote = RouteWithoutQuote & RouteQuote & Partial<RouteQuoteV2>;
type RouteWithoutGasEstimate = Omit<RouteWithQuote, 'quoteAdjustedForGas' | 'gasEstimate' | 'gasCostInToken' | 'gasCostInUSD'>;
interface BestRoutes {
    gasEstimate: bigint;
    gasEstimateInUSD: CurrencyAmount$1<Currency$1>;
    routes: Route[];
    inputAmount: CurrencyAmount$1<Currency$1>;
    outputAmount: CurrencyAmount$1<Currency$1>;
}

type AbortControl = {
    signal?: AbortSignal;
};

type L1ToL2GasCosts = {
    gasUsedL1: bigint;
    gasCostL1USD: CurrencyAmount<Currency>;
    gasCostL1QuoteToken: CurrencyAmount<Currency>;
};
interface GasEstimateRequiredInfo {
    initializedTickCrossedList: number[];
}
interface GasModel {
    estimateGasCost: (route: RouteWithoutGasEstimate, info: GasEstimateRequiredInfo) => GasCost;
}

type GetPoolParams = {
    currencyA?: Currency;
    currencyB?: Currency;
    blockNumber?: BigintIsh;
    protocols?: PoolType[];
    pairs?: [Currency, Currency][];
} & AbortControl;
interface PoolProvider {
    getCandidatePools: (params: GetPoolParams) => Promise<Pool[]>;
}
type QuoteRetryOptions = Options;
type QuoterOptions = {
    blockNumber?: BigintIsh;
    gasModel: GasModel;
    retry?: QuoteRetryOptions;
} & AbortControl;
type QuoterConfig = {
    onChainProvider: OnChainProvider;
    gasLimit?: BigintIsh;
    multicallConfigs?: ChainMap<BatchMulticallConfigs>;
};
interface QuoteProvider<C = any> {
    getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>;
    getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>;
    getConfig?: () => C;
}
type OnChainProvider = ({ chainId }: {
    chainId?: ChainId;
}) => PublicClient | undefined;
type SubgraphProvider = ({ chainId }: {
    chainId?: ChainId;
}) => GraphQLClient | undefined;

interface SmartRouterTrade<TTradeType extends TradeType> {
    tradeType: TTradeType;
    inputAmount: CurrencyAmount$1<Currency$1>;
    outputAmount: CurrencyAmount$1<Currency$1>;
    routes: Route[];
    gasEstimate: bigint;
    gasEstimateInUSD: CurrencyAmount$1<Currency$1>;
    blockNumber?: number;
}
type PriceReferences = {
    quoteCurrencyUsdPrice?: number;
    nativeCurrencyUsdPrice?: number;
};
type TradeConfig = {
    gasPriceWei: BigintIsh | (() => Promise<BigintIsh>);
    blockNumber?: number | (() => Promise<number>);
    poolProvider: PoolProvider;
    quoteProvider: QuoteProvider;
    maxHops?: number;
    maxSplits?: number;
    distributionPercent?: number;
    allowedPoolTypes?: PoolType[];
    quoterOptimization?: boolean;
} & PriceReferences & AbortControl;
type RouteConfig = TradeConfig & {
    blockNumber?: number;
};

interface PoolSelectorConfig {
    topN: number;
    topNDirectSwaps: number;
    topNTokenInOut: number;
    topNSecondHop: number;
    topNWithEachBaseToken: number;
    topNWithBaseToken: number;
}
interface PoolSelectorConfigChainMap {
    [chain: number]: PoolSelectorConfig;
}
interface TokenSpecificPoolSelectorConfig {
    [tokenAddress: Address]: Partial<PoolSelectorConfig>;
}
interface TokenPoolSelectorConfigChainMap {
    [chain: number]: TokenSpecificPoolSelectorConfig;
}

declare function getBestTrade(amount: CurrencyAmount<Currency> | CurrencyAmount$1<Currency$1>, currency: Currency | Currency$1, tradeType: TradeType, config: TradeConfig): Promise<SmartRouterTrade<TradeType> | null>;

interface HybridPoolProviderConfig {
    onChainProvider?: OnChainProvider;
    v2SubgraphProvider?: SubgraphProvider;
    v3SubgraphProvider?: SubgraphProvider;
}
declare function createHybridPoolProvider({ onChainProvider, v2SubgraphProvider, v3SubgraphProvider, }: HybridPoolProviderConfig): PoolProvider;

declare const getV2PoolsOnChain: (pairs: [Currency, Currency][], provider?: OnChainProvider, blockNumber?: BigintIsh) => Promise<(V2Pool | StablePool)[]>;
declare const getV3PoolsWithoutTicksOnChain: (pairs: [Currency, Currency][], provider?: OnChainProvider, blockNumber?: BigintIsh) => Promise<V3Pool[]>;

interface V3PoolSubgraphResult {
    id: string;
    liquidity: string;
    sqrtPrice: string;
    tick: string;
    fee: string;
    totalValueLockedUSD: string;
    deployer: string;
}
declare const getV3PoolSubgraph: ({ provider, pairs, }: {
    provider?: SubgraphProvider | undefined;
    pairs: [Currency, Currency][];
}) => Promise<V3PoolWithTvl[]>;
declare const getV2PoolSubgraph: ({ provider, pairs, }: {
    provider?: SubgraphProvider | undefined;
    pairs: [Currency, Currency][];
}) => Promise<V2PoolWithTvl[]>;
interface TokenFromSubgraph {
    symbol: string;
    id: string;
    decimals: string;
}
interface V3DetailedPoolSubgraphResult extends V3PoolSubgraphResult {
    token0: TokenFromSubgraph;
    token1: TokenFromSubgraph;
}
declare const getAllV3PoolsFromSubgraph: ({ provider, chainId, pageSize, }: {
    chainId?: ChainId | undefined;
    provider?: SubgraphProvider | undefined;
    pageSize?: number | undefined;
}) => Promise<V3PoolWithTvl[]>;

declare const v3PoolTvlSelector: (currencyA: Currency | undefined, currencyB: Currency | undefined, unorderedPoolsWithTvl: V3PoolWithTvl[]) => Omit<V3PoolWithTvl, "tvlUSD">[];
declare const v2PoolTvlSelector: (currencyA: Currency | undefined, currencyB: Currency | undefined, unorderedPoolsWithTvl: V2PoolWithTvl[]) => Omit<V2PoolWithTvl, "tvlUSD">[];

declare function createStaticPoolProvider(pools?: Pool[]): PoolProvider;

type AnyAsyncFunction = (...args: any[]) => Promise<any>;
type WithFallbackOptions<F extends AnyAsyncFunction> = {
    fallbacks?: F[];
    fallbackTimeout?: number;
};

type GetCommonTokenPricesParams = {
    currencyA?: Currency;
    currencyB?: Currency;
};
interface BySubgraphEssentials {
    provider?: SubgraphProvider;
}
type ParamsWithFallback = GetCommonTokenPricesParams & {
    v3SubgraphProvider?: SubgraphProvider;
};
type TokenUsdPrice = {
    address: string;
    priceUSD: string;
};
type GetTokenPrices<T> = (params: {
    addresses: string[];
    chainId?: ChainId;
} & T) => Promise<TokenUsdPrice[]>;
type CommonTokenPriceProvider<T> = (params: GetCommonTokenPricesParams & T) => Promise<Map<Address, number> | null>;
declare function createCommonTokenPriceProvider<T = any>(getTokenPrices: GetTokenPrices<T>): CommonTokenPriceProvider<T>;
declare const getTokenUsdPricesBySubgraph: GetTokenPrices<BySubgraphEssentials>;
declare const getCommonTokenPricesBySubgraph: CommonTokenPriceProvider<BySubgraphEssentials>;
declare const getCommonTokenPricesByLlma: CommonTokenPriceProvider<BySubgraphEssentials>;
declare const getCommonTokenPricesByWalletApi: CommonTokenPriceProvider<BySubgraphEssentials>;
declare const getCommonTokenPrices: (args_0: ParamsWithFallback) => Promise<any>;

type GetV2PoolsParams = {
    currencyA?: Currency | Currency$1;
    currencyB?: Currency | Currency$1;
    onChainProvider?: OnChainProvider;
    blockNumber?: BigintIsh;
    pairs?: [Currency, Currency][];
};
type SubgraphProviders = {
    v2SubgraphProvider?: SubgraphProvider;
    v3SubgraphProvider?: SubgraphProvider;
};
type Params = GetV2PoolsParams & SubgraphProviders;
declare function createV2PoolsProviderByCommonTokenPrices<T = any>(getCommonTokenPrices: CommonTokenPriceProvider<T>): ({ currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber, ...rest }: GetV2PoolsParams & T) => Promise<(V2PoolWithTvl | StablePoolWithTvl)[]>;
declare const getV2PoolsWithTvlByCommonTokenPrices: ({ currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber, ...rest }: GetV2PoolsParams & {
    v3SubgraphProvider?: SubgraphProvider | undefined;
}) => Promise<(V2PoolWithTvl | StablePoolWithTvl)[]>;
type GetV2Pools<T = any> = (params: GetV2PoolsParams & T) => Promise<(V2PoolWithTvl | StablePoolWithTvl)[]>;
declare function createGetV2CandidatePools<T = any>(defaultGetV2Pools: GetV2Pools<T>, options?: WithFallbackOptions<GetV2Pools<T>>): (params: GetV2PoolsParams & T) => Promise<Omit<V2PoolWithTvl, "tvlUSD">[]>;
declare function getV2CandidatePools(params: Params): Promise<Omit<V2PoolWithTvl, "tvlUSD">[]>;

type GetV3PoolsParams = {
    currencyA?: Currency | Currency$1;
    currencyB?: Currency | Currency$1;
    subgraphProvider?: SubgraphProvider;
    onChainProvider?: OnChainProvider;
    blockNumber?: BigintIsh;
    pairs?: [Currency, Currency][];
};
type DefaultParams = GetV3PoolsParams & {
    fallbackTimeout?: number;
    subgraphFallback?: boolean;
    staticFallback?: boolean;
};
interface V3PoolTvlReference extends Pick<V3PoolWithTvl, 'address'> {
    tvlUSD: bigint | string;
}
declare const v3PoolsOnChainProviderFactory: <P extends GetV3PoolsParams = GetV3PoolsParams>(tvlReferenceProvider: (params: P) => Promise<V3PoolTvlReference[]>) => (params: P) => Promise<V3PoolWithTvl[]>;
declare const getV3PoolsWithTvlFromOnChain: (params: GetV3PoolsParams) => Promise<V3PoolWithTvl[]>;
declare const getV3PoolsWithTvlFromOnChainFallback: (params: GetV3PoolsParams) => Promise<V3PoolWithTvl[]>;
declare const getV3PoolsWithTvlFromOnChainStaticFallback: (params: Omit<GetV3PoolsParams, "onChainProvider" | "subgraphProvider">) => Promise<V3PoolWithTvl[]>;
type GetV3Pools<T = any> = (params: GetV3PoolsParams & T) => Promise<V3PoolWithTvl[]>;

declare function createGetV3CandidatePools<T = any>(defaultGetV3Pools: GetV3Pools<T>, options?: WithFallbackOptions<GetV3Pools<T>>): (params: GetV3PoolsParams & T) => Promise<Omit<V3PoolWithTvl, "tvlUSD">[]>;
declare function getV3CandidatePools(params: DefaultParams): Promise<Omit<V3PoolWithTvl, "tvlUSD">[]>;

type GetCandidatePoolsParams = {
    currencyA?: Currency;
    currencyB?: Currency;
    pairs?: [Currency, Currency][];
    onChainProvider?: OnChainProvider;
    v2SubgraphProvider?: SubgraphProvider;
    v3SubgraphProvider?: SubgraphProvider;
    blockNumber?: BigintIsh;
    protocols?: PoolType[];
};
declare function getCandidatePools({ protocols, v2SubgraphProvider, v3SubgraphProvider, ...rest }: GetCandidatePoolsParams): Promise<Pool[]>;

declare function createPoolProvider(config: HybridPoolProviderConfig): PoolProvider;

declare function createQuoteProvider(config: QuoterConfig): QuoteProvider<QuoterConfig>;

declare function createOffChainQuoteProvider(): QuoteProvider;

type ProviderConfig = {
    /**
     * The block number to use when getting data on-chain.
     */
    blockNumber?: BigintIsh | Promise<BigintIsh>;
};
type CallSameFunctionOnMultipleContractsParams<TFunctionParams, TAdditionalConfig = any> = {
    addresses: Address[];
    abi: Abi;
    functionName: string;
    functionParams?: TFunctionParams;
    providerConfig?: ProviderConfig;
    additionalConfig?: TAdditionalConfig;
};
type CallSameFunctionOnContractWithMultipleParams<TFunctionParams, TAdditionalConfig = any> = {
    address: Address;
    abi: Abi;
    functionName: string;
    functionParams: TFunctionParams[];
    providerConfig?: ProviderConfig;
    additionalConfig?: TAdditionalConfig;
};
type CallMultipleFunctionsOnSameContractParams<TFunctionParams, TAdditionalConfig = any> = {
    address: Address;
    abi: Abi;
    functionNames: string[];
    functionParams?: TFunctionParams[];
    providerConfig?: ProviderConfig;
    additionalConfig?: TAdditionalConfig;
};
type SuccessResult<TReturn> = {
    success: true;
    result: TReturn;
};
type FailResult = {
    success: false;
    returnData: string;
};
type Result<TReturn> = SuccessResult<TReturn> | FailResult;
/**
 * Provider for fetching data on chain using multicall contracts.
 *
 * @export
 * @abstract
 * @class IMulticallProvider
 * @template TMulticallConfig
 */
declare abstract class IMulticallProvider<TMulticallConfig = any> {
    /**
     * Calls the same function on multiple contracts.
     *
     * For example, if you wanted to get the ERC-20 balance of 10 different tokens
     * this can be used to call balance on the 10 contracts in a single multicall.
     *
     * @abstract
     * @template TFunctionParams
     * @template TReturn
     * @param params
     * @returns {*}
     */
    abstract callSameFunctionOnMultipleContracts<TFunctionParams extends any[] | undefined, TReturn = any>(params: CallSameFunctionOnMultipleContractsParams<TFunctionParams, TMulticallConfig>): Promise<{
        blockNumber: bigint;
        results: Result<TReturn>[];
    }>;
    /**
     * Calls a function on a single contract with different parameters.
     *
     * For example, if you wanted to call the Pancakeswap V3 Quoter with 10 different
     * swap amounts this can be used to make the calls in a single multicall.
     *
     * @abstract
     * @template TFunctionParams
     * @template TReturn
     * @param params
     * @returns {*}
     */
    abstract callSameFunctionOnContractWithMultipleParams<TFunctionParams extends any[] | undefined, TReturn = any>(params: CallSameFunctionOnContractWithMultipleParams<TFunctionParams, TMulticallConfig>): Promise<{
        blockNumber: bigint;
        results: Result<TReturn>[];
    }>;
    abstract callMultipleFunctionsOnSameContract<TFunctionParams extends any[] | undefined, TReturn = any>(params: CallMultipleFunctionsOnSameContractParams<TFunctionParams, TMulticallConfig>): Promise<{
        blockNumber: bigint;
        results: Result<TReturn>[];
    }>;
}

type PancakeMulticallConfig = {
    gasLimitPerCall?: BigintIsh;
    gasLimit?: BigintIsh;
    gasBuffer?: BigintIsh;
    dropUnexecutedCalls?: boolean;
} & AbortControl;
/**
 * The PancakeswapMulticall contract has added functionality for limiting the amount of gas
 * that each call within the multicall can consume. This is useful for operations where
 * a call could consume such a large amount of gas that it causes the node to error out
 * with an out of gas error.
 *
 * @export
 * @class PancakeMulticallProvider
 */
declare class PancakeMulticallProvider extends IMulticallProvider<PancakeMulticallConfig> {
    protected chainId: ChainId;
    protected provider: PublicClient | undefined;
    protected gasLimitPerCall: number;
    static abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getCurrentBlockTimestamp";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "getEthBalance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "balance";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "target";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "gasLimit";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "callData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PancakeInterfaceMulticall.Call[]";
            readonly name: "calls";
            readonly type: "tuple[]";
        }];
        readonly name: "multicall";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "blockNumber";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
                readonly internalType: "bool";
                readonly name: "success";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "gasUsed";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "returnData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PancakeInterfaceMulticall.Result[]";
            readonly name: "returnData";
            readonly type: "tuple[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    constructor(chainId: ChainId, provider: PublicClient | undefined, gasLimitPerCall?: number);
    callSameFunctionOnMultipleContracts<TFunctionParams extends any[] | undefined, TReturn = any>(params: CallSameFunctionOnMultipleContractsParams<TFunctionParams>): Promise<{
        blockNumber: bigint;
        results: Result<TReturn>[];
        approxGasUsedPerSuccessCall: number;
        approxGasUsedPerFailCall: number;
    }>;
    callSameFunctionOnContractWithMultipleParams<TFunctionParams extends any[] | undefined, TReturn>(params: CallSameFunctionOnContractWithMultipleParams<TFunctionParams, PancakeMulticallConfig>): Promise<{
        blockNumber: bigint;
        results: Result<TReturn>[];
        approxGasUsedPerSuccessCall: number;
        approxGasUsedPerFailCall: number;
    }>;
    callMultipleFunctionsOnSameContract<TFunctionParams extends any[] | undefined, TReturn>(params: CallMultipleFunctionsOnSameContractParams<TFunctionParams, PancakeMulticallConfig>): Promise<{
        blockNumber: bigint;
        results: Result<TReturn>[];
        approxGasUsedPerSuccessCall: number;
        approxGasUsedPerFailCall: number;
    }>;
}

declare const publicClient: {
    84532: {
        account: undefined;
        batch?: {
            multicall?: boolean | {
                batchSize?: number | undefined;
                wait?: number | undefined;
            } | undefined;
        } | undefined;
        cacheTime: number;
        chain: viem.Chain | undefined;
        key: string;
        name: string;
        pollingInterval: number;
        request: viem.EIP1193RequestFn<viem.PublicRpcSchema>;
        transport: viem.TransportConfig<string, viem.EIP1193RequestFn> & Record<string, any>;
        type: string;
        uid: string;
        call: (parameters: viem.CallParameters<viem.Chain | undefined>) => Promise<viem.CallReturnType>;
        createBlockFilter: () => Promise<{
            id: `0x${string}`;
            request: viem.EIP1193RequestFn<readonly [{
                Method: "eth_getFilterChanges";
                Parameters: [filterId: `0x${string}`];
                ReturnType: `0x${string}`[] | viem.RpcLog[];
            }, {
                Method: "eth_getFilterLogs";
                Parameters: [filterId: `0x${string}`];
                ReturnType: viem.RpcLog[];
            }, {
                Method: "eth_uninstallFilter";
                Parameters: [filterId: `0x${string}`];
                ReturnType: boolean;
            }]>;
            type: "block";
        }>;
        createContractEventFilter: <const TAbi extends viem.Abi | readonly unknown[], TEventName extends string | undefined, TArgs extends viem__types_types_contract.MaybeExtractEventArgsFromAbi<TAbi, TEventName> | undefined, TStrict extends boolean | undefined = undefined, TFromBlock extends bigint | viem.BlockTag | undefined = undefined, TToBlock extends bigint | viem.BlockTag | undefined = undefined>(args: viem.CreateContractEventFilterParameters<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>) => Promise<viem.CreateContractEventFilterReturnType<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>>;
        createEventFilter: <const TAbiEvent extends abitype.AbiEvent | undefined = undefined, const TAbiEvents extends readonly unknown[] | readonly abitype.AbiEvent[] | undefined = TAbiEvent extends abitype.AbiEvent ? [TAbiEvent] : undefined, TStrict_1 extends boolean | undefined = undefined, TFromBlock_1 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_1 extends bigint | viem.BlockTag | undefined = undefined, _EventName extends string | undefined = viem__types_types_contract.MaybeAbiEventName<TAbiEvent>, _Args extends viem__types_types_contract.MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName> | undefined = undefined>(args?: viem.CreateEventFilterParameters<TAbiEvent, TAbiEvents, TStrict_1, TFromBlock_1, TToBlock_1, _EventName, _Args> | undefined) => Promise<viem.Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1> extends infer T ? { [K in keyof T]: viem.Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1>[K]; } : never>;
        createPendingTransactionFilter: () => Promise<{
            id: `0x${string}`;
            request: viem.EIP1193RequestFn<readonly [{
                Method: "eth_getFilterChanges";
                Parameters: [filterId: `0x${string}`];
                ReturnType: `0x${string}`[] | viem.RpcLog[];
            }, {
                Method: "eth_getFilterLogs";
                Parameters: [filterId: `0x${string}`];
                ReturnType: viem.RpcLog[];
            }, {
                Method: "eth_uninstallFilter";
                Parameters: [filterId: `0x${string}`];
                ReturnType: boolean;
            }]>;
            type: "transaction";
        }>;
        estimateContractGas: <TChain extends viem.Chain | undefined, const TAbi_1 extends viem.Abi | readonly unknown[], TFunctionName extends string>(args: viem.EstimateContractGasParameters<TAbi_1, TFunctionName, TChain, viem.Account | undefined>) => Promise<bigint>;
        estimateGas: (args: viem.EstimateGasParameters<viem.Chain | undefined, viem.Account | undefined>) => Promise<bigint>;
        getBalance: (args: viem.GetBalanceParameters) => Promise<bigint>;
        getBlock: <TIncludeTransactions extends boolean = false, TBlockTag extends viem.BlockTag = "latest">(args?: viem.GetBlockParameters<TIncludeTransactions, TBlockTag> | undefined) => Promise<viem.GetBlockReturnType<viem.Chain | undefined, TIncludeTransactions, TBlockTag>>;
        getBlockNumber: (args?: viem.GetBlockNumberParameters | undefined) => Promise<bigint>;
        getBlockTransactionCount: (args?: viem.GetBlockTransactionCountParameters | undefined) => Promise<number>;
        getBytecode: (args: viem.GetBytecodeParameters) => Promise<viem.GetBytecodeReturnType>;
        getChainId: () => Promise<number>;
        getContractEvents: <const TAbi_2 extends viem.Abi | readonly unknown[], TEventName_1 extends string | undefined = undefined, TStrict_2 extends boolean | undefined = undefined, TFromBlock_2 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_2 extends bigint | viem.BlockTag | undefined = undefined>(args: viem__types_actions_public_getContractEvents.GetContractEventsParameters<TAbi_2, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>) => Promise<viem__types_actions_public_getContractEvents.GetContractEventsReturnType<TAbi_2, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>>;
        getEnsAddress: (args: {
            blockNumber?: bigint | undefined;
            blockTag?: viem.BlockTag | undefined;
            coinType?: number | undefined;
            name: string;
            universalResolverAddress?: `0x${string}` | undefined;
        }) => Promise<viem.GetEnsAddressReturnType>;
        getEnsAvatar: (args: {
            name: string;
            blockNumber?: bigint | undefined;
            blockTag?: viem.BlockTag | undefined;
            universalResolverAddress?: `0x${string}` | undefined;
            gatewayUrls?: viem.AssetGatewayUrls | undefined;
        }) => Promise<viem__types_actions_ens_getEnsAvatar.GetEnsAvatarReturnType>;
        getEnsName: (args: {
            blockNumber?: bigint | undefined;
            blockTag?: viem.BlockTag | undefined;
            address: `0x${string}`;
            universalResolverAddress?: `0x${string}` | undefined;
        }) => Promise<viem.GetEnsNameReturnType>;
        getEnsResolver: (args: {
            blockNumber?: bigint | undefined;
            blockTag?: viem.BlockTag | undefined;
            name: string;
            universalResolverAddress?: `0x${string}` | undefined;
        }) => Promise<`0x${string}`>;
        getEnsText: (args: {
            blockNumber?: bigint | undefined;
            blockTag?: viem.BlockTag | undefined;
            name: string;
            key: string;
            universalResolverAddress?: `0x${string}` | undefined;
        }) => Promise<viem__types_actions_ens_getEnsText.GetEnsTextReturnType>;
        getFeeHistory: (args: viem.GetFeeHistoryParameters) => Promise<viem.GetFeeHistoryReturnType>;
        estimateFeesPerGas: <TChainOverride extends viem.Chain | undefined = undefined, TType extends viem.FeeValuesType = "eip1559">(args?: viem.EstimateFeesPerGasParameters<viem.Chain | undefined, TChainOverride, TType> | undefined) => Promise<viem.EstimateFeesPerGasReturnType>;
        getFilterChanges: <TFilterType extends viem__types_types_filter.FilterType, const TAbi_3 extends viem.Abi | readonly unknown[] | undefined, TEventName_2 extends string | undefined, TStrict_3 extends boolean | undefined = undefined, TFromBlock_3 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_3 extends bigint | viem.BlockTag | undefined = undefined>(args: viem.GetFilterChangesParameters<TFilterType, TAbi_3, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>) => Promise<viem.GetFilterChangesReturnType<TFilterType, TAbi_3, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>>;
        getFilterLogs: <const TAbi_4 extends viem.Abi | readonly unknown[] | undefined, TEventName_3 extends string | undefined, TStrict_4 extends boolean | undefined = undefined, TFromBlock_4 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_4 extends bigint | viem.BlockTag | undefined = undefined>(args: viem.GetFilterLogsParameters<TAbi_4, TEventName_3, TStrict_4, TFromBlock_4, TToBlock_4>) => Promise<viem.GetFilterLogsReturnType<TAbi_4, TEventName_3, TStrict_4, TFromBlock_4, TToBlock_4>>;
        getGasPrice: () => Promise<bigint>;
        getLogs: <const TAbiEvent_1 extends abitype.AbiEvent | undefined = undefined, const TAbiEvents_1 extends readonly unknown[] | readonly abitype.AbiEvent[] | undefined = TAbiEvent_1 extends abitype.AbiEvent ? [TAbiEvent_1] : undefined, TStrict_5 extends boolean | undefined = undefined, TFromBlock_5 extends bigint | viem.BlockTag | undefined = undefined, TToBlock_5 extends bigint | viem.BlockTag | undefined = undefined>(args?: viem.GetLogsParameters<TAbiEvent_1, TAbiEvents_1, TStrict_5, TFromBlock_5, TToBlock_5> | undefined) => Promise<viem.GetLogsReturnType<TAbiEvent_1, TAbiEvents_1, TStrict_5, TFromBlock_5, TToBlock_5>>;
        getProof: (args: viem__types_actions_public_getProof.GetProofParameters) => Promise<viem__types_actions_public_getProof.GetProofReturnType>;
        estimateMaxPriorityFeePerGas: <TChainOverride_1 extends viem.Chain | undefined = undefined>(args?: {
            chain: TChainOverride_1 | null;
        } | undefined) => Promise<bigint>;
        getStorageAt: (args: viem.GetStorageAtParameters) => Promise<viem.GetStorageAtReturnType>;
        getTransaction: <TBlockTag_1 extends viem.BlockTag = "latest">(args: viem.GetTransactionParameters<TBlockTag_1>) => Promise<viem.GetTransactionReturnType<viem.Chain | undefined, TBlockTag_1>>;
        getTransactionConfirmations: (args: viem.GetTransactionConfirmationsParameters<viem.Chain | undefined>) => Promise<bigint>;
        getTransactionCount: (args: viem.GetTransactionCountParameters) => Promise<number>;
        getTransactionReceipt: (args: viem.GetTransactionReceiptParameters) => Promise<viem.TransactionReceipt>;
        multicall: <TContracts extends viem.ContractFunctionConfig[], TAllowFailure extends boolean = true>(args: viem.MulticallParameters<TContracts, TAllowFailure>) => Promise<viem.MulticallReturnType<TContracts, TAllowFailure>>;
        prepareTransactionRequest: <TChainOverride_2 extends viem.Chain | undefined = undefined>(args: viem.PrepareTransactionRequestParameters<viem.Chain | undefined, viem.Account | undefined, TChainOverride_2>) => Promise<viem.PrepareTransactionRequestReturnType>;
        readContract: <const TAbi_5 extends viem.Abi | readonly unknown[], TFunctionName_1 extends string>(args: viem.ReadContractParameters<TAbi_5, TFunctionName_1>) => Promise<viem.ReadContractReturnType<TAbi_5, TFunctionName_1>>;
        sendRawTransaction: (args: viem__types_actions_wallet_sendRawTransaction.SendRawTransactionParameters) => Promise<`0x${string}`>;
        simulateContract: <const TAbi_6 extends viem.Abi | readonly unknown[], TFunctionName_2 extends string, TChainOverride_3 extends viem.Chain | undefined = undefined>(args: viem.SimulateContractParameters<TAbi_6, TFunctionName_2, viem.Chain | undefined, TChainOverride_3>) => Promise<viem.SimulateContractReturnType<TAbi_6, TFunctionName_2, viem.Chain | undefined, TChainOverride_3>>;
        verifyMessage: (args: viem__types_actions_public_verifyMessage.VerifyMessageParameters) => Promise<boolean>;
        verifyTypedData: (args: viem__types_actions_public_verifyTypedData.VerifyTypedDataParameters) => Promise<boolean>;
        uninstallFilter: (args: viem.UninstallFilterParameters) => Promise<boolean>;
        waitForTransactionReceipt: (args: viem.WaitForTransactionReceiptParameters<viem.Chain | undefined>) => Promise<viem.TransactionReceipt>;
        watchBlockNumber: (args: viem.WatchBlockNumberParameters) => viem.WatchBlockNumberReturnType;
        watchBlocks: <TIncludeTransactions_1 extends boolean = false, TBlockTag_2 extends viem.BlockTag = "latest">(args: viem.WatchBlocksParameters<viem.Transport, viem.Chain | undefined, TIncludeTransactions_1, TBlockTag_2>) => viem.WatchBlocksReturnType;
        watchContractEvent: <const TAbi_7 extends viem.Abi | readonly unknown[], TEventName_4 extends string, TStrict_6 extends boolean | undefined = undefined>(args: viem.WatchContractEventParameters<TAbi_7, TEventName_4, TStrict_6>) => viem.WatchContractEventReturnType;
        watchEvent: <const TAbiEvent_2 extends abitype.AbiEvent | undefined = undefined, const TAbiEvents_2 extends readonly unknown[] | readonly abitype.AbiEvent[] | undefined = TAbiEvent_2 extends abitype.AbiEvent ? [TAbiEvent_2] : undefined, TStrict_7 extends boolean | undefined = undefined>(args: viem.WatchEventParameters<TAbiEvent_2, TAbiEvents_2, TStrict_7>) => viem.WatchEventReturnType;
        watchPendingTransactions: (args: viem.WatchPendingTransactionsParameters<viem.Transport>) => viem.WatchPendingTransactionsReturnType;
        extend: <const client extends {
            [x: string]: unknown;
            account?: undefined;
            batch?: undefined;
            cacheTime?: undefined;
            chain?: undefined;
            key?: undefined;
            name?: undefined;
            pollingInterval?: undefined;
            request?: undefined;
            transport?: undefined;
            type?: undefined;
            uid?: undefined;
        } & Partial<Pick<viem.PublicActions, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<viem.WalletActions, "sendTransaction" | "writeContract">>>(fn: (client: viem.Client<viem.Transport, viem.Chain | undefined, undefined, viem.PublicRpcSchema, viem.PublicActions<viem.Transport, viem.Chain | undefined>>) => client) => viem.Client<viem.Transport, viem.Chain | undefined, undefined, viem.PublicRpcSchema, { [K_1 in keyof client]: client[K_1]; } & viem.PublicActions<viem.Transport, viem.Chain | undefined>>;
    };
};
declare const quoteProvider: {
    84532: QuoteProvider<QuoterConfig>;
};
declare const v3SubgraphClient: {
    84532: GraphQLClient;
};
declare const v2SubgraphClient: {
    84532: GraphQLClient;
};

declare const zPools: z.ZodArray<z.ZodUnion<[z.ZodObject<{
    type: z.ZodNativeEnum<typeof PoolType>;
    reserve0: z.ZodObject<{
        currency: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }>;
    reserve1: z.ZodObject<{
        currency: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    type: PoolType;
    reserve0: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    reserve1: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
}, {
    type: PoolType;
    reserve0: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    reserve1: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
}>, z.ZodObject<{
    type: z.ZodNativeEnum<typeof PoolType>;
    token0: z.ZodObject<{
        address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
        decimals: z.ZodNumber;
        symbol: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }>;
    token1: z.ZodObject<{
        address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
        decimals: z.ZodNumber;
        symbol: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }>;
    fee: z.ZodNumber;
    liquidity: z.ZodString;
    sqrtRatioX96: z.ZodString;
    tick: z.ZodNumber;
    address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
    token0ProtocolFee: z.ZodString;
    token1ProtocolFee: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fee: number;
    type: PoolType;
    address: `0x${string}`;
    token0: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    token1: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    liquidity: string;
    sqrtRatioX96: string;
    tick: number;
    token0ProtocolFee: string;
    token1ProtocolFee: string;
}, {
    fee: number;
    type: PoolType;
    address: `0x${string}`;
    token0: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    token1: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    liquidity: string;
    sqrtRatioX96: string;
    tick: number;
    token0ProtocolFee: string;
    token1ProtocolFee: string;
}>, z.ZodObject<{
    type: z.ZodNativeEnum<typeof PoolType>;
    reserve0: z.ZodObject<{
        currency: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }>;
    reserve1: z.ZodObject<{
        currency: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    type: PoolType;
    reserve0: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    reserve1: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
}, {
    type: PoolType;
    reserve0: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    reserve1: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
}>]>, "many">;
declare const zRouterGetParams: z.ZodObject<{
    chainId: z.ZodNativeEnum<typeof ChainId>;
    amount: z.ZodObject<{
        currency: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }>;
    blockNumber: z.ZodOptional<z.ZodString>;
    tradeType: z.ZodNativeEnum<typeof TradeType>;
    maxSplits: z.ZodOptional<z.ZodNumber>;
    gasPriceWei: z.ZodOptional<z.ZodString>;
    maxHops: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodObject<{
        address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
        decimals: z.ZodNumber;
        symbol: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }>;
    poolTypes: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof PoolType>, "many">>;
}, "strip", z.ZodTypeAny, {
    chainId: ChainId;
    amount: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    tradeType: TradeType;
    currency: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    blockNumber?: string | undefined;
    maxSplits?: number | undefined;
    gasPriceWei?: string | undefined;
    maxHops?: number | undefined;
    poolTypes?: PoolType[] | undefined;
}, {
    chainId: ChainId;
    amount: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    tradeType: TradeType;
    currency: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    blockNumber?: string | undefined;
    maxSplits?: number | undefined;
    gasPriceWei?: string | undefined;
    maxHops?: number | undefined;
    poolTypes?: PoolType[] | undefined;
}>;
declare const zRouterPostParams: z.ZodObject<{
    chainId: z.ZodNativeEnum<typeof ChainId>;
    amount: z.ZodObject<{
        currency: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }, {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    }>;
    blockNumber: z.ZodOptional<z.ZodString>;
    tradeType: z.ZodNativeEnum<typeof TradeType>;
    maxSplits: z.ZodOptional<z.ZodNumber>;
    gasPriceWei: z.ZodOptional<z.ZodString>;
    quoteCurrencyUsdPrice: z.ZodOptional<z.ZodNumber>;
    nativeCurrencyUsdPrice: z.ZodOptional<z.ZodNumber>;
    maxHops: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodObject<{
        address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
        decimals: z.ZodNumber;
        symbol: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }, {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    }>;
    poolTypes: z.ZodOptional<z.ZodArray<z.ZodNativeEnum<typeof PoolType>, "many">>;
    candidatePools: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodNativeEnum<typeof PoolType>;
        reserve0: z.ZodObject<{
            currency: z.ZodObject<{
                address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
                decimals: z.ZodNumber;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }>;
        reserve1: z.ZodObject<{
            currency: z.ZodObject<{
                address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
                decimals: z.ZodNumber;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    }, {
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    }>, z.ZodObject<{
        type: z.ZodNativeEnum<typeof PoolType>;
        token0: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        token1: z.ZodObject<{
            address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
            decimals: z.ZodNumber;
            symbol: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }, {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        }>;
        fee: z.ZodNumber;
        liquidity: z.ZodString;
        sqrtRatioX96: z.ZodString;
        tick: z.ZodNumber;
        address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
        token0ProtocolFee: z.ZodString;
        token1ProtocolFee: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fee: number;
        type: PoolType;
        address: `0x${string}`;
        token0: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        token1: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        liquidity: string;
        sqrtRatioX96: string;
        tick: number;
        token0ProtocolFee: string;
        token1ProtocolFee: string;
    }, {
        fee: number;
        type: PoolType;
        address: `0x${string}`;
        token0: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        token1: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        liquidity: string;
        sqrtRatioX96: string;
        tick: number;
        token0ProtocolFee: string;
        token1ProtocolFee: string;
    }>, z.ZodObject<{
        type: z.ZodNativeEnum<typeof PoolType>;
        reserve0: z.ZodObject<{
            currency: z.ZodObject<{
                address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
                decimals: z.ZodNumber;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }>;
        reserve1: z.ZodObject<{
            currency: z.ZodObject<{
                address: z.ZodType<`0x${string}`, z.ZodTypeDef, `0x${string}`>;
                decimals: z.ZodNumber;
                symbol: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }, {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            }>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }, {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    }, {
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    }>]>, "many">;
    onChainQuoterGasLimit: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    chainId: ChainId;
    amount: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    tradeType: TradeType;
    currency: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    candidatePools: ({
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    } | {
        fee: number;
        type: PoolType;
        address: `0x${string}`;
        token0: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        token1: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        liquidity: string;
        sqrtRatioX96: string;
        tick: number;
        token0ProtocolFee: string;
        token1ProtocolFee: string;
    } | {
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    })[];
    blockNumber?: string | undefined;
    maxSplits?: number | undefined;
    gasPriceWei?: string | undefined;
    quoteCurrencyUsdPrice?: number | undefined;
    nativeCurrencyUsdPrice?: number | undefined;
    maxHops?: number | undefined;
    poolTypes?: PoolType[] | undefined;
    onChainQuoterGasLimit?: string | undefined;
}, {
    chainId: ChainId;
    amount: {
        value: string;
        currency: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
    };
    tradeType: TradeType;
    currency: {
        symbol: string;
        address: `0x${string}`;
        decimals: number;
    };
    candidatePools: ({
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    } | {
        fee: number;
        type: PoolType;
        address: `0x${string}`;
        token0: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        token1: {
            symbol: string;
            address: `0x${string}`;
            decimals: number;
        };
        liquidity: string;
        sqrtRatioX96: string;
        tick: number;
        token0ProtocolFee: string;
        token1ProtocolFee: string;
    } | {
        type: PoolType;
        reserve0: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
        reserve1: {
            value: string;
            currency: {
                symbol: string;
                address: `0x${string}`;
                decimals: number;
            };
        };
    })[];
    blockNumber?: string | undefined;
    maxSplits?: number | undefined;
    gasPriceWei?: string | undefined;
    quoteCurrencyUsdPrice?: number | undefined;
    nativeCurrencyUsdPrice?: number | undefined;
    maxHops?: number | undefined;
    poolTypes?: PoolType[] | undefined;
    onChainQuoterGasLimit?: string | undefined;
}>;
type RouterPostParams = z.infer<typeof zRouterPostParams>;
type RouterGetParams = z.infer<typeof zRouterGetParams>;
type SerializedPools = z.infer<typeof zPools>;

type schema_RouterGetParams = RouterGetParams;
type schema_RouterPostParams = RouterPostParams;
type schema_SerializedPools = SerializedPools;
declare const schema_zPools: typeof zPools;
declare const schema_zRouterGetParams: typeof zRouterGetParams;
declare const schema_zRouterPostParams: typeof zRouterPostParams;
declare namespace schema {
  export {
    schema_RouterGetParams as RouterGetParams,
    schema_RouterPostParams as RouterPostParams,
    schema_SerializedPools as SerializedPools,
    schema_zPools as zPools,
    schema_zRouterGetParams as zRouterGetParams,
    schema_zRouterPostParams as zRouterPostParams,
  };
}

declare function getExecutionPrice(trade: SmartRouterTrade<TradeType$1> | null | undefined): Price<_cryptoalgebra_custom_pools_sdk.Currency, _cryptoalgebra_custom_pools_sdk.Currency> | null;

declare const SCOPE: {
    readonly metric: "metric";
    readonly log: "log";
    readonly error: "error";
};
type Scope = (typeof SCOPE)[keyof typeof SCOPE];
type CommaSeparated<T extends string, U extends T = T> = T extends string ? [U] extends [T] ? T : `${`${T},` | ''}${CommaSeparated<Exclude<U, T>>}` : never;
type Namespace = '*' | Scope | CommaSeparated<Scope> | (string & Record<never, never>);
declare const metric: debug.Debugger;
declare const log: debug.Debugger;
declare const logger: {
    metric: debug.Debugger;
    log: debug.Debugger;
    error: debug.Debugger;
    enable: (namespace: Namespace) => void;
};

declare function maximumAmountIn(trade: SmartRouterTrade<TradeType>, slippage: Percent$1, amountIn?: CurrencyAmount$1<_cryptoalgebra_custom_pools_sdk.Currency>): CurrencyAmount$1<_cryptoalgebra_custom_pools_sdk.Currency>;
declare function minimumAmountOut(trade: SmartRouterTrade<TradeType>, slippage: Percent$1, amountOut?: CurrencyAmount$1<_cryptoalgebra_custom_pools_sdk.Currency>): CurrencyAmount$1<_cryptoalgebra_custom_pools_sdk.Currency>;

declare function computePairAddress(token0: Token$1, token1: Token$1, isStable: boolean): `0x${string}`;
declare function isV2Pool(pool: Pool): pool is V2Pool;
declare function isV3Pool(pool: Pool): pool is V3Pool;
declare function isStablePool(pool: Pool): pool is StablePool;
declare function involvesCurrency(pool: Pool, currency: Currency): boolean;
declare const getPoolAddress: (pool: Pool) => Address | '';

declare function getMidPrice({ path, pools }: Route): Price$1<Currency, Currency>;

declare function getPriceImpact(trade: SmartRouterTrade<TradeType$1>): Percent$1;

interface SerializedCurrency {
    address: Address;
    decimals: number;
    symbol: string;
}
interface SerializedCurrencyAmount {
    currency: SerializedCurrency;
    value: string;
}
interface SerializedV2Pool extends Omit<V2Pool, 'reserve0' | 'reserve1'> {
    reserve0: SerializedCurrencyAmount;
    reserve1: SerializedCurrencyAmount;
}
interface SerializedStablePool extends Omit<StablePool, 'reserve0' | 'reserve1'> {
    reserve0: SerializedCurrencyAmount;
    reserve1: SerializedCurrencyAmount;
}
interface SerializedV3Pool extends Omit<V3Pool, 'token0' | 'token1' | 'liquidity' | 'sqrtRatioX96' | 'token0ProtocolFee' | 'token1ProtocolFee'> {
    token0: SerializedCurrency;
    token1: SerializedCurrency;
    liquidity: string;
    sqrtRatioX96: string;
    token0ProtocolFee: string;
    token1ProtocolFee: string;
}
type SerializedPool = SerializedV2Pool | SerializedV3Pool | SerializedStablePool;
interface SerializedRoute extends Omit<Route, 'pools' | 'path' | 'input' | 'output' | 'inputAmount' | 'outputAmount'> {
    pools: SerializedPool[];
    path: SerializedCurrency[];
    inputAmount: SerializedCurrencyAmount;
    outputAmount: SerializedCurrencyAmount;
}
interface SerializedTrade extends Omit<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'gasEstimate' | 'gasEstimateInUSD' | 'routes'> {
    inputAmount: SerializedCurrencyAmount;
    outputAmount: SerializedCurrencyAmount;
    gasEstimate: string;
    gasEstimateInUSD: SerializedCurrencyAmount;
    routes: SerializedRoute[];
}
declare function serializeCurrency(currency: Currency): SerializedCurrency;
declare function serializeCurrencyAmount(amount: CurrencyAmount<Currency>): SerializedCurrencyAmount;
declare function serializePool(pool: Pool): SerializedPool;
declare function serializeRoute(route: Route): SerializedRoute;
declare function serializeTrade(trade: SmartRouterTrade<TradeType>): SerializedTrade;
declare function parseCurrency(chainId: ChainId, currency: SerializedCurrency): Currency;
declare function parseCurrencyAmount(chainId: ChainId, amount: SerializedCurrencyAmount): CurrencyAmount<Currency>;
declare function parsePool(chainId: ChainId, pool: SerializedPool): Pool;
declare function parseRoute(chainId: ChainId, route: SerializedRoute): Route;
declare function parseTrade(chainId: ChainId, trade: SerializedTrade): SmartRouterTrade<TradeType>;

type transformer_SerializedCurrency = SerializedCurrency;
type transformer_SerializedCurrencyAmount = SerializedCurrencyAmount;
type transformer_SerializedPool = SerializedPool;
type transformer_SerializedRoute = SerializedRoute;
type transformer_SerializedStablePool = SerializedStablePool;
type transformer_SerializedTrade = SerializedTrade;
type transformer_SerializedV2Pool = SerializedV2Pool;
type transformer_SerializedV3Pool = SerializedV3Pool;
declare const transformer_parseCurrency: typeof parseCurrency;
declare const transformer_parseCurrencyAmount: typeof parseCurrencyAmount;
declare const transformer_parsePool: typeof parsePool;
declare const transformer_parseRoute: typeof parseRoute;
declare const transformer_parseTrade: typeof parseTrade;
declare const transformer_serializeCurrency: typeof serializeCurrency;
declare const transformer_serializeCurrencyAmount: typeof serializeCurrencyAmount;
declare const transformer_serializePool: typeof serializePool;
declare const transformer_serializeRoute: typeof serializeRoute;
declare const transformer_serializeTrade: typeof serializeTrade;
declare namespace transformer {
  export {
    transformer_SerializedCurrency as SerializedCurrency,
    transformer_SerializedCurrencyAmount as SerializedCurrencyAmount,
    transformer_SerializedPool as SerializedPool,
    transformer_SerializedRoute as SerializedRoute,
    transformer_SerializedStablePool as SerializedStablePool,
    transformer_SerializedTrade as SerializedTrade,
    transformer_SerializedV2Pool as SerializedV2Pool,
    transformer_SerializedV3Pool as SerializedV3Pool,
    transformer_parseCurrency as parseCurrency,
    transformer_parseCurrencyAmount as parseCurrencyAmount,
    transformer_parsePool as parsePool,
    transformer_parseRoute as parseRoute,
    transformer_parseTrade as parseTrade,
    transformer_serializeCurrency as serializeCurrency,
    transformer_serializeCurrencyAmount as serializeCurrencyAmount,
    transformer_serializePool as serializePool,
    transformer_serializeRoute as serializeRoute,
    transformer_serializeTrade as serializeTrade,
  };
}

type smartRouter_CommonTokenPriceProvider<T> = CommonTokenPriceProvider<T>;
type smartRouter_GetCandidatePoolsParams = GetCandidatePoolsParams;
type smartRouter_GetCommonTokenPricesParams = GetCommonTokenPricesParams;
type smartRouter_GetTokenPrices<T> = GetTokenPrices<T>;
type smartRouter_GetV2PoolsParams = GetV2PoolsParams;
type smartRouter_GetV3PoolsParams = GetV3PoolsParams;
type smartRouter_HybridPoolProviderConfig = HybridPoolProviderConfig;
type smartRouter_PancakeMulticallConfig = PancakeMulticallConfig;
type smartRouter_PancakeMulticallProvider = PancakeMulticallProvider;
declare const smartRouter_PancakeMulticallProvider: typeof PancakeMulticallProvider;
type smartRouter_TokenUsdPrice = TokenUsdPrice;
type smartRouter_V3DetailedPoolSubgraphResult = V3DetailedPoolSubgraphResult;
type smartRouter_V3PoolTvlReference = V3PoolTvlReference;
declare const smartRouter_computePairAddress: typeof computePairAddress;
declare const smartRouter_createCommonTokenPriceProvider: typeof createCommonTokenPriceProvider;
declare const smartRouter_createGetV2CandidatePools: typeof createGetV2CandidatePools;
declare const smartRouter_createGetV3CandidatePools: typeof createGetV3CandidatePools;
declare const smartRouter_createHybridPoolProvider: typeof createHybridPoolProvider;
declare const smartRouter_createOffChainQuoteProvider: typeof createOffChainQuoteProvider;
declare const smartRouter_createPoolProvider: typeof createPoolProvider;
declare const smartRouter_createQuoteProvider: typeof createQuoteProvider;
declare const smartRouter_createStaticPoolProvider: typeof createStaticPoolProvider;
declare const smartRouter_createV2PoolsProviderByCommonTokenPrices: typeof createV2PoolsProviderByCommonTokenPrices;
declare const smartRouter_getAllV3PoolsFromSubgraph: typeof getAllV3PoolsFromSubgraph;
declare const smartRouter_getBestTrade: typeof getBestTrade;
declare const smartRouter_getCandidatePools: typeof getCandidatePools;
declare const smartRouter_getCheckAgainstBaseTokens: typeof getCheckAgainstBaseTokens;
declare const smartRouter_getCommonTokenPrices: typeof getCommonTokenPrices;
declare const smartRouter_getCommonTokenPricesByLlma: typeof getCommonTokenPricesByLlma;
declare const smartRouter_getCommonTokenPricesBySubgraph: typeof getCommonTokenPricesBySubgraph;
declare const smartRouter_getCommonTokenPricesByWalletApi: typeof getCommonTokenPricesByWalletApi;
declare const smartRouter_getExecutionPrice: typeof getExecutionPrice;
declare const smartRouter_getMidPrice: typeof getMidPrice;
declare const smartRouter_getPairCombinations: typeof getPairCombinations;
declare const smartRouter_getPoolAddress: typeof getPoolAddress;
declare const smartRouter_getPriceImpact: typeof getPriceImpact;
declare const smartRouter_getTokenUsdPricesBySubgraph: typeof getTokenUsdPricesBySubgraph;
declare const smartRouter_getV2CandidatePools: typeof getV2CandidatePools;
declare const smartRouter_getV2PoolSubgraph: typeof getV2PoolSubgraph;
declare const smartRouter_getV2PoolsOnChain: typeof getV2PoolsOnChain;
declare const smartRouter_getV2PoolsWithTvlByCommonTokenPrices: typeof getV2PoolsWithTvlByCommonTokenPrices;
declare const smartRouter_getV3CandidatePools: typeof getV3CandidatePools;
declare const smartRouter_getV3PoolSubgraph: typeof getV3PoolSubgraph;
declare const smartRouter_getV3PoolsWithTvlFromOnChain: typeof getV3PoolsWithTvlFromOnChain;
declare const smartRouter_getV3PoolsWithTvlFromOnChainFallback: typeof getV3PoolsWithTvlFromOnChainFallback;
declare const smartRouter_getV3PoolsWithTvlFromOnChainStaticFallback: typeof getV3PoolsWithTvlFromOnChainStaticFallback;
declare const smartRouter_getV3PoolsWithoutTicksOnChain: typeof getV3PoolsWithoutTicksOnChain;
declare const smartRouter_involvesCurrency: typeof involvesCurrency;
declare const smartRouter_isStablePool: typeof isStablePool;
declare const smartRouter_isV2Pool: typeof isV2Pool;
declare const smartRouter_isV3Pool: typeof isV3Pool;
declare const smartRouter_log: typeof log;
declare const smartRouter_logger: typeof logger;
declare const smartRouter_maximumAmountIn: typeof maximumAmountIn;
declare const smartRouter_metric: typeof metric;
declare const smartRouter_minimumAmountOut: typeof minimumAmountOut;
declare const smartRouter_publicClient: typeof publicClient;
declare const smartRouter_quoteProvider: typeof quoteProvider;
declare const smartRouter_v2PoolTvlSelector: typeof v2PoolTvlSelector;
declare const smartRouter_v2SubgraphClient: typeof v2SubgraphClient;
declare const smartRouter_v3PoolTvlSelector: typeof v3PoolTvlSelector;
declare const smartRouter_v3PoolsOnChainProviderFactory: typeof v3PoolsOnChainProviderFactory;
declare const smartRouter_v3SubgraphClient: typeof v3SubgraphClient;
declare namespace smartRouter {
  export {
    schema as APISchema,
    smartRouter_CommonTokenPriceProvider as CommonTokenPriceProvider,
    smartRouter_GetCandidatePoolsParams as GetCandidatePoolsParams,
    smartRouter_GetCommonTokenPricesParams as GetCommonTokenPricesParams,
    smartRouter_GetTokenPrices as GetTokenPrices,
    smartRouter_GetV2PoolsParams as GetV2PoolsParams,
    GetV3PoolsParams as GetV3CandidatePoolsParams,
    smartRouter_GetV3PoolsParams as GetV3PoolsParams,
    smartRouter_HybridPoolProviderConfig as HybridPoolProviderConfig,
    smartRouter_PancakeMulticallConfig as PancakeMulticallConfig,
    smartRouter_PancakeMulticallProvider as PancakeMulticallProvider,
    V2PoolWithTvl as SubgraphV2Pool,
    V3PoolWithTvl as SubgraphV3Pool,
    smartRouter_TokenUsdPrice as TokenUsdPrice,
    transformer as Transformer,
    smartRouter_V3DetailedPoolSubgraphResult as V3DetailedPoolSubgraphResult,
    smartRouter_V3PoolTvlReference as V3PoolTvlReference,
    smartRouter_computePairAddress as computePairAddress,
    smartRouter_createCommonTokenPriceProvider as createCommonTokenPriceProvider,
    smartRouter_createGetV2CandidatePools as createGetV2CandidatePools,
    smartRouter_createGetV3CandidatePools as createGetV3CandidatePools,
    createGetV3CandidatePools as createGetV3CandidatePoolsWithFallbacks,
    smartRouter_createHybridPoolProvider as createHybridPoolProvider,
    smartRouter_createOffChainQuoteProvider as createOffChainQuoteProvider,
    smartRouter_createPoolProvider as createPoolProvider,
    smartRouter_createQuoteProvider as createQuoteProvider,
    smartRouter_createStaticPoolProvider as createStaticPoolProvider,
    smartRouter_createV2PoolsProviderByCommonTokenPrices as createV2PoolsProviderByCommonTokenPrices,
    smartRouter_getAllV3PoolsFromSubgraph as getAllV3PoolsFromSubgraph,
    smartRouter_getBestTrade as getBestTrade,
    smartRouter_getCandidatePools as getCandidatePools,
    smartRouter_getCheckAgainstBaseTokens as getCheckAgainstBaseTokens,
    smartRouter_getCommonTokenPrices as getCommonTokenPrices,
    smartRouter_getCommonTokenPricesByLlma as getCommonTokenPricesByLlma,
    smartRouter_getCommonTokenPricesBySubgraph as getCommonTokenPricesBySubgraph,
    smartRouter_getCommonTokenPricesByWalletApi as getCommonTokenPricesByWalletApi,
    smartRouter_getExecutionPrice as getExecutionPrice,
    smartRouter_getMidPrice as getMidPrice,
    smartRouter_getPairCombinations as getPairCombinations,
    smartRouter_getPoolAddress as getPoolAddress,
    smartRouter_getPriceImpact as getPriceImpact,
    smartRouter_getTokenUsdPricesBySubgraph as getTokenUsdPricesBySubgraph,
    smartRouter_getV2CandidatePools as getV2CandidatePools,
    smartRouter_getV2PoolSubgraph as getV2PoolSubgraph,
    smartRouter_getV2PoolsOnChain as getV2PoolsOnChain,
    smartRouter_getV2PoolsWithTvlByCommonTokenPrices as getV2PoolsWithTvlByCommonTokenPrices,
    smartRouter_getV3CandidatePools as getV3CandidatePools,
    smartRouter_getV3PoolSubgraph as getV3PoolSubgraph,
    smartRouter_getV3PoolsWithTvlFromOnChain as getV3PoolsWithTvlFromOnChain,
    smartRouter_getV3PoolsWithTvlFromOnChainFallback as getV3PoolsWithTvlFromOnChainFallback,
    smartRouter_getV3PoolsWithTvlFromOnChainStaticFallback as getV3PoolsWithTvlFromOnChainStaticFallback,
    smartRouter_getV3PoolsWithoutTicksOnChain as getV3PoolsWithoutTicksOnChain,
    smartRouter_involvesCurrency as involvesCurrency,
    smartRouter_isStablePool as isStablePool,
    smartRouter_isV2Pool as isV2Pool,
    smartRouter_isV3Pool as isV3Pool,
    smartRouter_log as log,
    smartRouter_logger as logger,
    smartRouter_maximumAmountIn as maximumAmountIn,
    smartRouter_metric as metric,
    smartRouter_minimumAmountOut as minimumAmountOut,
    smartRouter_publicClient as publicClient,
    smartRouter_quoteProvider as quoteProvider,
    v2PoolTvlSelector as v2PoolSubgraphSelection,
    smartRouter_v2PoolTvlSelector as v2PoolTvlSelector,
    smartRouter_v2SubgraphClient as v2SubgraphClient,
    v3PoolTvlSelector as v3PoolSubgraphSelection,
    smartRouter_v3PoolTvlSelector as v3PoolTvlSelector,
    smartRouter_v3PoolsOnChainProviderFactory as v3PoolsOnChainProviderFactory,
    smartRouter_v3SubgraphClient as v3SubgraphClient,
  };
}

type Validation = BigintIsh | string;

type CondensedAddLiquidityOptions = Omit<MintSpecificOptions, 'createPool'> | IncreaseSpecificOptions;
declare enum ApprovalTypes {
    NOT_REQUIRED = 0,
    MAX = 1,
    MAX_MINUS_ONE = 2,
    ZERO_THEN_MAX = 3,
    ZERO_THEN_MAX_MINUS_ONE = 4
}

/**
 * Options for producing the arguments to send calls to the router.
 */
interface SwapOptions {
    /**
     * How much the execution price is allowed to move unfavorably from the trade execution price.
     */
    slippageTolerance: Percent | Percent$1;
    /**
     * The account that should receive the output. If omitted, output is sent to msg.sender.
     */
    recipient: Address;
    /**
     * Either deadline (when the transaction expires, in epoch seconds), or previousBlockhash.
     */
    deadlineOrPreviousBlockhash?: Validation;
    /**
     * The optional permit parameters for spending the input.
     */
    inputTokenPermit?: PermitOptions;
    /**
     * Optional information for taking a fee on output.
     */
    fee?: FeeOptions;
}
interface SwapAndAddOptions extends SwapOptions {
    /**
     * The optional permit parameters for pulling in remaining output token.
     */
    outputTokenPermit?: PermitOptions;
}
type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[];
/**
 * Represents the Pancakeswap V2 + V3 + StableSwap SwapRouter02, and has static methods for helping execute trades.
 */
declare abstract class SwapRouter {
    static ABI: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_WNativeToken";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_poolDeployer";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "WNativeToken";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "int256";
            readonly name: "amount0Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "int256";
            readonly name: "amount1Delta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "algebraSwapCallback";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "bytes";
                readonly name: "path";
                readonly type: "bytes";
            }, {
                readonly internalType: "address";
                readonly name: "recipient"; /**
                 * The account that should receive the output. If omitted, output is sent to msg.sender.
                 */
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline"; /**
                 * Either deadline (when the transaction expires, in epoch seconds), or previousBlockhash.
                 */
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountIn";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountOutMinimum";
                readonly type: "uint256";
            }];
            readonly internalType: "struct ISwapRouter.ExactInputParams";
            readonly name: "params";
            readonly type: "tuple";
        }];
        readonly name: "exactInput";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountOut";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "tokenIn";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "tokenOut";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "deployer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountIn";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountOutMinimum";
                /**
                 * @notice Generates the calldata for a Swap with a V3 Route.
                 * @param trade The V3Trade to encode.
                 * @param options SwapOptions to use for the trade.
                 * @param routerMustCustody Flag for whether funds should be sent to the router
                 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
                 * @returns A string array of calldatas for the trade.
                 */
                readonly type: "uint256";
            }, {
                readonly internalType: "uint160";
                readonly name: "limitSqrtPrice";
                readonly type: "uint160";
            }];
            readonly internalType: "struct ISwapRouter.ExactInputSingleParams";
            readonly name: "params";
            /**
             * @notice Generates the calldata for a Swap with a V3 Route.
             * @param trade The V3Trade to encode.
             * @param options SwapOptions to use for the trade.
             * @param routerMustCustody Flag for whether funds should be sent to the router
             * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
             * @returns A string array of calldatas for the trade.
             */
            readonly type: "tuple";
        }];
        readonly name: "exactInputSingle";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountOut";
            /**
             * @notice Generates the calldata for a Swap with a V3 Route.
             * @param trade The V3Trade to encode.
             * @param options SwapOptions to use for the trade.
             * @param routerMustCustody Flag for whether funds should be sent to the router
             * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
             * @returns A string array of calldatas for the trade.
             */
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        /**
         * @notice Generates the calldata for a Swap with a V3 Route.
         * @param trade The V3Trade to encode.
         * @param options SwapOptions to use for the trade.
         * @param routerMustCustody Flag for whether funds should be sent to the router
         * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
         * @returns A string array of calldatas for the trade.
         */
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                /**
                 * @notice Generates the calldata for a Swap with a V3 Route.
                 * @param trade The V3Trade to encode.
                 * @param options SwapOptions to use for the trade.
                 * @param routerMustCustody Flag for whether funds should be sent to the router
                 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
                 * @returns A string array of calldatas for the trade.
                 */
                readonly name: "tokenIn";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                /**
                 * @notice Generates the calldata for a Swap with a V3 Route.
                 * @param trade The V3Trade to encode.
                 * @param options SwapOptions to use for the trade.
                 * @param routerMustCustody Flag for whether funds should be sent to the router
                 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
                 * @returns A string array of calldatas for the trade.
                 */
                readonly name: "tokenOut";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "deployer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                /**
                 * @notice Generates the calldata for a Swap with a V3 Route.
                 * @param trade The V3Trade to encode.
                 * @param options SwapOptions to use for the trade.
                 * @param routerMustCustody Flag for whether funds should be sent to the router
                 * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
                 * @returns A string array of calldatas for the trade.
                 */
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountIn";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountOutMinimum";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint160";
                readonly name: "limitSqrtPrice";
                readonly type: "uint160";
            }];
            readonly internalType: "struct ISwapRouter.ExactInputSingleParams";
            readonly name: "params";
            readonly type: "tuple";
        }];
        readonly name: "exactInputSingleSupportingFeeOnTransferTokens";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountOut";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "bytes";
                readonly name: "path";
                readonly type: "bytes";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountOut";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountInMaximum";
                readonly type: "uint256";
            }];
            readonly internalType: "struct ISwapRouter.ExactOutputParams";
            readonly name: "params";
            readonly type: "tuple";
        }];
        readonly name: "exactOutput";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountIn";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "tokenIn";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "tokenOut";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "deployer";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "recipient";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountOut";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountInMaximum";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint160";
                readonly name: "limitSqrtPrice";
                readonly type: "uint160";
            }];
            readonly internalType: "struct ISwapRouter.ExactOutputSingleParams";
            readonly name: "params";
            readonly type: "tuple";
        }];
        readonly name: "exactOutputSingle";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountIn";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes[]";
            readonly name: "data";
            readonly type: "bytes[]";
        }];
        readonly name: "multicall";
        readonly outputs: readonly [{
            readonly internalType: "bytes[]";
            readonly name: "results";
            readonly type: "bytes[]";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "poolDeployer";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "refundNativeToken";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256"; /**
             * @notice Generates the calldata for a MixedRouteSwap. Since single hop routes are not MixedRoutes, we will instead generate
             *         them via the existing encodeV3Swap and encodeV2Swap methods.
             * @param trade The MixedRouteTrade to encode.
             * @param options SwapOptions to use for the trade.
             * @param routerMustCustody Flag for whether funds should be sent to the router
             * @returns A string array of calldatas for the trade.
             */
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "selfPermit";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "nonce";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "expiry";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "selfPermitAllowed";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "nonce";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "expiry";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "selfPermitAllowedIfNecessary";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "selfPermitIfNecessary";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountMinimum";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }];
        readonly name: "sweepToken";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountMinimum";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeBips";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "feeRecipient";
            readonly type: "address";
        }];
        readonly name: "sweepTokenWithFee";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountMinimum";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }];
        readonly name: "unwrapWNativeToken";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amountMinimum";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "feeBips";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "feeRecipient";
            readonly type: "address";
        }];
        readonly name: "unwrapWNativeTokenWithFee";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * @notice Generates the calldata for a Swap with a V2 Route.
     * @param trade The V2Trade to encode.
     * @param options SwapOptions to use for the trade.
     * @param routerMustCustody Flag for whether funds should be sent to the router
     * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
     * @returns A string array of calldatas for the trade.
     */
    /**
     * @notice Generates the calldata for a Swap with a V3 Route.
     * @param trade The V3Trade to encode.
     * @param options SwapOptions to use for the trade.
     * @param routerMustCustody Flag for whether funds should be sent to the router
     * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
     * @returns A string array of calldatas for the trade.
     */
    private static encodeV3Swap;
    /**
     * @notice Generates the calldata for a MixedRouteSwap. Since single hop routes are not MixedRoutes, we will instead generate
     *         them via the existing encodeV3Swap and encodeV2Swap methods.
     * @param trade The MixedRouteTrade to encode.
     * @param options SwapOptions to use for the trade.
     * @param routerMustCustody Flag for whether funds should be sent to the router
     * @returns A string array of calldatas for the trade.
     */
    private static encodeSwaps;
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trades to produce call parameters for
     * @param options options for the call parameters
     */
    static swapCallParameters(trades: AnyTradeType, options: SwapOptions): MethodParameters;
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trades to produce call parameters for
     * @param options options for the call parameters
     */
    static swapAndAddCallParameters(trades: AnyTradeType, options: SwapAndAddOptions, position: Position, addLiquidityOptions: CondensedAddLiquidityOptions, tokenInApprovalType: ApprovalTypes, tokenOutApprovalType: ApprovalTypes): MethodParameters;
    private static riskOfPartialFill;
    private static v3TradeWithHighPriceImpact;
    private static getPositionAmounts;
}

export { ADDITIONAL_BASES, ADDRESS_THIS, BASES_TO_CHECK_TRADES_AGAINST, BASE_SWAP_COST_STABLE_SWAP, BASE_SWAP_COST_V2, BASE_SWAP_COST_V3, BATCH_MULTICALL_CONFIGS, BETTER_TRADE_LESS_HOPS_THRESHOLD, BIG_INT_TEN, BIPS_BASE, BasePool, BaseRoute, BestRoutes, COST_PER_EXTRA_HOP_STABLE_SWAP, COST_PER_EXTRA_HOP_V2, COST_PER_HOP_V3, COST_PER_INIT_TICK, COST_PER_UNINIT_TICK, CUSTOM_BASES, GasCost, GasEstimateRequiredInfo, GasModel, L1ToL2GasCosts, MIN_BNB, MIXED_ROUTE_QUOTER_ADDRESSES, MSG_SENDER, OnChainProvider, Pool, PoolProvider, PoolSelectorConfig, PoolSelectorConfigChainMap, PoolType, PriceReferences, QuoteProvider, QuoteRetryOptions, QuoterConfig, QuoterOptions, Route, RouteConfig, RouteEssentials, RouteQuote, RouteQuoteV2, RouteType, RouteWithQuote, RouteWithoutGasEstimate, RouteWithoutQuote, SMART_ROUTER_ADDRESSES, smartRouter as SmartRouter, SmartRouterTrade, StablePool, StablePoolWithTvl, index as StableSwap, SubgraphProvider, SwapRouter, TokenPoolSelectorConfigChainMap, TokenSpecificPoolSelectorConfig, TradeConfig, transformer as Transformer, V2Pool, V2PoolWithTvl, V2_FEE_PATH_PLACEHOLDER, V3Pool, V3PoolWithTvl, V3_QUOTER_ADDRESSES, WithTvl, getStableSwapPools, isStableSwapSupported, usdGasTokensByChain };
