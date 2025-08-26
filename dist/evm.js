'use strict';

var sdk = require('@pancakeswap/sdk');
var customPoolsSdk = require('@cryptoalgebra/custom-pools-sdk');
var invariant5 = require('tiny-invariant');
var flatMap = require('lodash/flatMap.js');
var memoize = require('lodash/memoize.js');
var uniqBy = require('lodash/uniqBy.js');
var viem = require('viem');
var v3Sdk = require('@pancakeswap/v3-sdk');
var debug = require('debug');
var swapSdkCore = require('@pancakeswap/swap-sdk-core');
var mapValues = require('lodash/mapValues.js');
var FixedReverseHeap = require('mnemonist/fixed-reverse-heap.js');
var Queue = require('mnemonist/queue.js');
var sum = require('lodash/sum.js');
var chunk = require('lodash/chunk.js');
var graphqlRequest = require('graphql-request');
var retry = require('async-retry');
var stats = require('stats-lite');
var zod = require('zod');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var invariant5__default = /*#__PURE__*/_interopDefault(invariant5);
var flatMap__default = /*#__PURE__*/_interopDefault(flatMap);
var memoize__default = /*#__PURE__*/_interopDefault(memoize);
var uniqBy__default = /*#__PURE__*/_interopDefault(uniqBy);
var debug__default = /*#__PURE__*/_interopDefault(debug);
var mapValues__default = /*#__PURE__*/_interopDefault(mapValues);
var FixedReverseHeap__default = /*#__PURE__*/_interopDefault(FixedReverseHeap);
var Queue__default = /*#__PURE__*/_interopDefault(Queue);
var sum__default = /*#__PURE__*/_interopDefault(sum);
var chunk__default = /*#__PURE__*/_interopDefault(chunk);
var retry__default = /*#__PURE__*/_interopDefault(retry);
var stats__default = /*#__PURE__*/_interopDefault(stats);

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var BIG_INT_TEN = BigInt(10);
var BIPS_BASE = BigInt(1e4);
var MIN_BNB = BIG_INT_TEN ** BigInt(16);
var BETTER_TRADE_LESS_HOPS_THRESHOLD = new sdk.Percent(BigInt(50), BIPS_BASE);

// evm/chains/src/chainId.ts
var ChainId = /* @__PURE__ */ ((ChainId3) => {
  ChainId3[ChainId3["BASE_SEPOLIA"] = 84532] = "BASE_SEPOLIA";
  ChainId3[ChainId3["PULSECHAIN_TESTNET"] = 943] = "PULSECHAIN_TESTNET";
  return ChainId3;
})(ChainId || {});

// evm/chains/src/chainNames.ts
var chainNames = {
  [84532 /* BASE_SEPOLIA */]: "base-sepolia"
};
Object.entries(chainNames).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName]: chainId,
    ...acc
  };
}, {});
var defiLlamaChainNames = {
  [84532 /* BASE_SEPOLIA */]: ""
};

// evm/chains/src/utils.ts
function getLlamaChainName(chainId) {
  return defiLlamaChainNames[chainId];
}
var POOL_INIT_CODE_HASH = {
  [84532 /* BASE_SEPOLIA */]: "0xa18736c3ee97fe3c96c9428c0cc2a9116facec18e84f95f9da30543f8238a782"
};
var ALGEBRA_POOL_DEPLOYER = {
  [84532 /* BASE_SEPOLIA */]: "0x58fcDe2268c9cD0168bddC81ba4Cf9F174160258"
};
var ALGEBRA_QUOTER_V2 = {
  [84532 /* BASE_SEPOLIA */]: "0x1c219ba68A9100E4F3475A624cf225ADA02c0F1B"
};
// evm/chains/src/chainNames.ts
var chainNames = {
  [84532 /* BASE_SEPOLIA */]: "base-sepolia",
  [943 /* PULSECHAIN_TESTNET */]: "pulsechain-testnet"
};
Object.entries(chainNames).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName]: chainId,
    ...acc
  };
}, {});
var defiLlamaChainNames = {
  [84532 /* BASE_SEPOLIA */]: "",
  [943 /* PULSECHAIN_TESTNET */]: "pulse"
};

// evm/chains/src/utils.ts
function getLlamaChainName(chainId) {
  return defiLlamaChainNames[chainId];
}
var POOL_INIT_CODE_HASH = {
  [84532 /* BASE_SEPOLIA */]: "0xa18736c3ee97fe3c96c9428c0cc2a9116facec18e84f95f9da30543f8238a782",
  [943 /* PULSECHAIN_TESTNET */]: "0x62441ebe4e4315cf3d49d5957f94d66b253dbabe7006f34ad7f70947e60bf15c"
};
var ALGEBRA_POOL_DEPLOYER = {
  [84532 /* BASE_SEPOLIA */]: "0x58fcDe2268c9cD0168bddC81ba4Cf9F174160258",
  [943 /* PULSECHAIN_TESTNET */]: "0xd2842C6Fcec6D5020844bdDE0Fd3b7DcAb3470e4"
};
var ALGEBRA_QUOTER_V2 = {
  [84532 /* BASE_SEPOLIA */]: "0x1c219ba68A9100E4F3475A624cf225ADA02c0F1B",
  [943 /* PULSECHAIN_TESTNET */]: "0x4966e2DEE5a908586e58c5776B3996C108804FB5"
};
var ALGEBRA_ROUTER = {
  [84532 /* BASE_SEPOLIA */]: "0x3400D4f83c528A0E19c380d92DD100eA51d8980c",
  [943 /* PULSECHAIN_TESTNET */]: "0xe227B51F5D7079fAa07b7621657e3aa5906d2185"
  // SwapRouter
};
var CUSTOM_POOL_BASE = {
  [84532 /* BASE_SEPOLIA */]: customPoolsSdk.ADDRESS_ZERO
};
var CUSTOM_POOL_DEPLOYER_ALL_INCLUSIVE = {
  [84532 /* BASE_SEPOLIA */]: "0x44564Ed09f4d88ae963E6579709973Eb7C109A30",
  [943 /* PULSECHAIN_TESTNET */]: "0xd2842C6Fcec6D5020844bdDE0Fd3b7DcAb3470e4"
};
var CUSTOM_POOL_BASE = {
  [84532 /* BASE_SEPOLIA */]: customPoolsSdk.ADDRESS_ZERO
};
var CUSTOM_POOL_DEPLOYER_ALL_INCLUSIVE = {
  [84532 /* BASE_SEPOLIA */]: "0x44564Ed09f4d88ae963E6579709973Eb7C109A30"
};
var baseSepoliaTokens = {
  usdt: new sdk.ERC20Token(84532 /* BASE_SEPOLIA */, "0xAbAc6f23fdf1313FC2E9C9244f666157CcD32990", 6, "USDC", "USDC"),
  weth: new sdk.ERC20Token(84532 /* BASE_SEPOLIA */, "0x4200000000000000000000000000000000000006", 18, "WETH", "WETH")
};
var pulsechainTestnetTokens = {
  wpls: new sdk.ERC20Token(943 /* PULSECHAIN_TESTNET */, '0x70499adEBB11Efd915E3b69E700c331778628707', 18, 'WPLS', 'Wrapped PLS'),
  rob: new sdk.ERC20Token(943 /* PULSECHAIN_TESTNET */, '0x60D08BfDB5Dbe6Ea85C0F7746366F442CaE6a475', 18, 'ROB', 'RiseOfBat'),
  ros: new sdk.ERC20Token(943 /* PULSECHAIN_TESTNET */, '0x3ec59e2794Eb384237fF6854C9813304347CD823', 18, 'ROS', 'RiseOfSuperman')
};

// evm/constants/exchange.ts
var SMART_ROUTER_ADDRESSES = {
  [84532 /* BASE_SEPOLIA */]: ALGEBRA_ROUTER[84532 /* BASE_SEPOLIA */],
  [943 /* PULSECHAIN_TESTNET */]: ALGEBRA_ROUTER[943 /* PULSECHAIN_TESTNET */]
};
var BASES_TO_CHECK_TRADES_AGAINST = {
  [84532 /* BASE_SEPOLIA */]: Object.values(baseSepoliaTokens),
  [943 /* PULSECHAIN_TESTNET */]: Object.values(pulsechainTestnetTokens)
};
var ADDITIONAL_BASES = {};
var CUSTOM_BASES = {};

// evm/constants/gasModel/stableSwap.ts
var BASE_SWAP_COST_STABLE_SWAP = BigInt(18e4);
var COST_PER_EXTRA_HOP_STABLE_SWAP = BigInt(7e4);

// evm/constants/gasModel/v2.ts
var BASE_SWAP_COST_V2 = BigInt(135e3);
var COST_PER_EXTRA_HOP_V2 = BigInt(5e4);

// evm/constants/gasModel/v3.ts
var COST_PER_UNINIT_TICK = BigInt(0);
var BASE_SWAP_COST_V3 = (id) => {
  switch (id) {
    case 84532 /* BASE_SEPOLIA */:
      return BigInt(2e3);
    default:
      return BigInt(0);
  }
};
var COST_PER_INIT_TICK = (id) => {
  switch (id) {
    case 84532 /* BASE_SEPOLIA */:
      return BigInt(31e3);
    default:
      return BigInt(0);
  }
};
var COST_PER_HOP_V3 = (id) => {
  switch (id) {
    case 84532 /* BASE_SEPOLIA */:
      return BigInt(8e4);
    default:
      return BigInt(0);
  }
};

// evm/constants/gasModel/index.ts
var usdGasTokensByChain = {
  [84532 /* BASE_SEPOLIA */]: [baseSepoliaTokens.usdt]
};

// evm/constants/multicall.ts
var DEFAULT = {
  defaultConfig: {
    gasLimitPerCall: 1e6
  },
  gasErrorFailureOverride: {
    gasLimitPerCall: 2e6
  },
  successRateFailureOverrides: {
    gasLimitPerCall: 2e6
  }
};
var BATCH_MULTICALL_CONFIGS = {
  [84532 /* BASE_SEPOLIA */]: DEFAULT
};

// evm/constants/v3.ts
var V2_FEE_PATH_PLACEHOLDER = 8388608;
var MSG_SENDER = "0x0000000000000000000000000000000000000001";
var ADDRESS_THIS = "0x0000000000000000000000000000000000000002";
var MIXED_ROUTE_QUOTER_ADDRESSES = {
  [84532 /* BASE_SEPOLIA */]: ALGEBRA_QUOTER_V2[84532 /* BASE_SEPOLIA */]
};
var V3_QUOTER_ADDRESSES = {
  [84532 /* BASE_SEPOLIA */]: ALGEBRA_QUOTER_V2[84532 /* BASE_SEPOLIA */]
};

// evm/constants/stableSwap/pools.ts
var isStableSwapSupported = (chainId) => {
  if (!chainId) {
    return false;
  }
  return STABLE_SUPPORTED_CHAIN_IDS.includes(chainId);
};
var STABLE_SUPPORTED_CHAIN_IDS = [84532 /* BASE_SEPOLIA */];
var STABLE_POOL_MAP = {
  [84532 /* BASE_SEPOLIA */]: []
};

// evm/constants/stableSwap/index.ts
function getStableSwapPools(chainId) {
  if (!isStableSwapSupported(chainId)) {
    return [];
  }
  return STABLE_POOL_MAP[chainId] || [];
}

// evm/stableSwap/index.ts
var stableSwap_exports = {};
__export(stableSwap_exports, {
  getD: () => getD,
  getLPOutput: () => getLPOutput,
  getLPOutputWithoutFee: () => getLPOutputWithoutFee,
  getSwapInput: () => getSwapInput,
  getSwapInputWithtouFee: () => getSwapInputWithtouFee,
  getSwapOutput: () => getSwapOutput,
  getSwapOutputWithoutFee: () => getSwapOutputWithoutFee
});
function getD({ amplifier, balances }) {
  const numOfCoins = balances.length;
  invariant5__default.default(numOfCoins > 1, "To get constant D, pool should have at least two coins.");
  const sum2 = balances.reduce((s, cur) => s + BigInt(cur), sdk.ZERO);
  if (sum2 === sdk.ZERO) {
    return sdk.ZERO;
  }
  const n = BigInt(numOfCoins);
  const precision = sdk.ONE;
  const ann = BigInt(amplifier) * n;
  let dPrev = sdk.ZERO;
  let d = sum2;
  for (let i = 0; i < 255; i += 1) {
    let dp = d;
    for (const b of balances) {
      dp = dp * d / (BigInt(b) * n + BigInt(1));
    }
    dPrev = d;
    d = (ann * sum2 + dp * n) * d / ((ann - sdk.ONE) * d + (n + sdk.ONE) * dp);
    if (d > dPrev && d - dPrev <= precision) {
      break;
    }
    if (d <= dPrev && dPrev - d <= precision) {
      break;
    }
  }
  return d;
}
function getY({ amplifier, balances, i, j, x }) {
  const numOfCoins = balances.length;
  invariant5__default.default(numOfCoins > 1, "To get y, pool should have at least two coins.");
  invariant5__default.default(i !== j && i >= 0 && j >= 0 && i < numOfCoins && j < numOfCoins, `Invalid i: ${i} and j: ${j}`);
  const n = BigInt(numOfCoins);
  const d = getD({ amplifier, balances });
  let sum2 = sdk.ZERO;
  let c = d;
  const ann = BigInt(amplifier) * n;
  for (const [index, b2] of balances.entries()) {
    if (index === j) {
      continue;
    }
    let balanceAfterDeposit = BigInt(b2);
    if (index === i) {
      balanceAfterDeposit += BigInt(x);
    }
    invariant5__default.default(balanceAfterDeposit > sdk.ZERO, "Insufficient liquidity");
    sum2 += balanceAfterDeposit;
    c = c * d / (balanceAfterDeposit * n);
  }
  c = c * d / (ann * n);
  const b = sum2 + d / ann;
  const precision = sdk.ONE;
  let yPrev = sdk.ZERO;
  let y = d;
  for (let k = 0; k < 255; k += 1) {
    yPrev = y;
    y = (y * y + c) / (BigInt(2) * y + b - d);
    if (y > yPrev && y - yPrev <= precision) {
      break;
    }
    if (y <= yPrev && yPrev - y <= precision) {
      break;
    }
  }
  return y;
}
var PRECISION = BigInt(10) ** BigInt(18);
var getRawAmount = (amount) => {
  return amount.quotient * PRECISION / BigInt(10) ** BigInt(amount.currency.decimals);
};
var parseAmount = (currency, rawAmount) => {
  return sdk.CurrencyAmount.fromRawAmount(currency, rawAmount * BigInt(10) ** BigInt(currency.decimals) / PRECISION);
};

// evm/stableSwap/getLPOutput.ts
function getLPOutput({
  amplifier,
  balances,
  totalSupply,
  amounts,
  fee
}) {
  const lpToken = totalSupply.currency;
  const lpTotalSupply = totalSupply.quotient;
  if (lpTotalSupply === sdk.ZERO || !balances.length || balances.every((b) => b.quotient === sdk.ZERO)) {
    const d = getD({ amplifier, balances: amounts.map(getRawAmount) });
    return sdk.CurrencyAmount.fromRawAmount(lpToken, d);
  }
  const currentBalances = [];
  const newBalances = [];
  for (const [i, balance] of balances.entries()) {
    const amount = amounts[i] || sdk.CurrencyAmount.fromRawAmount(balance.currency, 0);
    invariant5__default.default(
      amount.currency.wrapped.equals(balance.currency.wrapped),
      "User input currency should be the same as pool balance currency."
    );
    const balanceRaw = getRawAmount(balance);
    const amountRaw = getRawAmount(amount);
    currentBalances.push(balanceRaw);
    newBalances.push(balanceRaw + amountRaw);
  }
  const d0 = getD({ amplifier, balances: currentBalances });
  const d1 = getD({ amplifier, balances: newBalances });
  invariant5__default.default(d1 >= d0, "D1 should be greater than or equal than d0.");
  const isFirstSupply = lpTotalSupply <= sdk.ZERO;
  if (isFirstSupply) {
    return sdk.CurrencyAmount.fromRawAmount(totalSupply.currency, d1);
  }
  const n = currentBalances.length;
  const eachTokenFee = fee.multiply(n).divide(4 * (n - 1));
  let d2 = d1;
  for (const [i, b] of currentBalances.entries()) {
    const idealBalance = d1 * b / d0;
    let diff = sdk.ZERO;
    if (idealBalance > newBalances[i]) {
      diff = idealBalance - newBalances[i];
    } else {
      diff = newBalances[i] - idealBalance;
    }
    const feeAmount = eachTokenFee.multiply(diff).quotient;
    newBalances[i] = newBalances[i] - feeAmount;
  }
  d2 = getD({ amplifier, balances: newBalances });
  const expectedMintLP = lpTotalSupply * (d2 - d0) / d0;
  return sdk.CurrencyAmount.fromRawAmount(totalSupply.currency, expectedMintLP);
}

// evm/stableSwap/getLPOutputWithoutFee.ts
function getLPOutputWithoutFee(params) {
  return getLPOutput({ ...params, fee: new sdk.Percent(0) });
}
function getSwapOutput({
  amplifier,
  balances: balanceAmounts,
  outputCurrency,
  amount,
  fee
}) {
  const validateAmountOut = (a) => invariant5__default.default(!a.lessThan(sdk.ZERO), "Insufficient liquidity to perform the swap");
  let i = null;
  let j = null;
  const balances = [];
  for (const [index, b] of balanceAmounts.entries()) {
    balances.push(getRawAmount(b));
    if (b.currency.wrapped.equals(amount.currency.wrapped)) {
      i = index;
      continue;
    }
    if (b.currency.wrapped.equals(outputCurrency.wrapped)) {
      j = index;
      continue;
    }
  }
  invariant5__default.default(
    i !== null && j !== null && i !== j,
    "Input currency or output currency does not match currencies of token balances."
  );
  if (amount.quotient < sdk.ZERO) {
    const x = sdk.ONE_HUNDRED_PERCENT.subtract(fee).invert().multiply(getRawAmount(amount)).quotient;
    const y2 = getY({ amplifier, balances, i, j, x });
    const dy2 = y2 - balances[j];
    const amountOut2 = parseAmount(outputCurrency, dy2);
    validateAmountOut(amountOut2);
    return amountOut2;
  }
  const y = getY({ amplifier, balances, i, j, x: getRawAmount(amount) });
  const dy = balances[j] - y;
  const feeAmount = fee.multiply(dy).quotient;
  const amountOut = parseAmount(outputCurrency, dy - feeAmount);
  validateAmountOut(amountOut);
  return amountOut;
}
function getSwapOutputWithoutFee(params) {
  return getSwapOutput({ ...params, fee: new sdk.Percent(0) });
}
function getSwapInput({ amount, ...rest }) {
  return getSwapOutput({
    ...rest,
    amount: sdk.CurrencyAmount.fromRawAmount(amount.currency, -amount.quotient)
  });
}
function getSwapInputWithtouFee(params) {
  return getSwapInput({ ...params, fee: new sdk.Percent(0) });
}

// evm/v3-router/smartRouter.ts
var smartRouter_exports = {};
__export(smartRouter_exports, {
  APISchema: () => schema_exports,
  PancakeMulticallProvider: () => PancakeMulticallProvider,
  Transformer: () => transformer_exports,
  computePairAddress: () => computePairAddress,
  createCommonTokenPriceProvider: () => createCommonTokenPriceProvider,
  createGetV2CandidatePools: () => createGetV2CandidatePools,
  createGetV3CandidatePools: () => createGetV3CandidatePools,
  createGetV3CandidatePoolsWithFallbacks: () => createGetV3CandidatePools,
  createHybridPoolProvider: () => createHybridPoolProvider,
  createOffChainQuoteProvider: () => createOffChainQuoteProvider,
  createPoolProvider: () => createPoolProvider,
  createQuoteProvider: () => createQuoteProvider,
  createStaticPoolProvider: () => createStaticPoolProvider,
  createV2PoolsProviderByCommonTokenPrices: () => createV2PoolsProviderByCommonTokenPrices,
  getAllV3PoolsFromSubgraph: () => getAllV3PoolsFromSubgraph,
  getBestTrade: () => getBestTrade,
  getCandidatePools: () => getCandidatePools,
  getCheckAgainstBaseTokens: () => getCheckAgainstBaseTokens,
  getCommonTokenPrices: () => getCommonTokenPrices,
  getCommonTokenPricesByLlma: () => getCommonTokenPricesByLlma,
  getCommonTokenPricesBySubgraph: () => getCommonTokenPricesBySubgraph,
  getCommonTokenPricesByWalletApi: () => getCommonTokenPricesByWalletApi,
  getExecutionPrice: () => getExecutionPrice,
  getMidPrice: () => getMidPrice,
  getPairCombinations: () => getPairCombinations,
  getPoolAddress: () => getPoolAddress,
  getPriceImpact: () => getPriceImpact,
  getTokenUsdPricesBySubgraph: () => getTokenUsdPricesBySubgraph,
  getV2CandidatePools: () => getV2CandidatePools,
  getV2PoolSubgraph: () => getV2PoolSubgraph,
  getV2PoolsOnChain: () => getV2PoolsOnChain,
  getV2PoolsWithTvlByCommonTokenPrices: () => getV2PoolsWithTvlByCommonTokenPrices,
  getV3CandidatePools: () => getV3CandidatePools,
  getV3PoolSubgraph: () => getV3PoolSubgraph,
  getV3PoolsWithTvlFromOnChain: () => getV3PoolsWithTvlFromOnChain,
  getV3PoolsWithTvlFromOnChainFallback: () => getV3PoolsWithTvlFromOnChainFallback,
  getV3PoolsWithTvlFromOnChainStaticFallback: () => getV3PoolsWithTvlFromOnChainStaticFallback,
  getV3PoolsWithoutTicksOnChain: () => getV3PoolsWithoutTicksOnChain,
  involvesCurrency: () => involvesCurrency,
  isStablePool: () => isStablePool,
  isV2Pool: () => isV2Pool,
  isV3Pool: () => isV3Pool,
  log: () => log,
  logger: () => logger,
  maximumAmountIn: () => maximumAmountIn,
  metric: () => metric,
  minimumAmountOut: () => minimumAmountOut,
  publicClient: () => publicClient,
  quoteProvider: () => quoteProvider,
  v2PoolSubgraphSelection: () => v2PoolTvlSelector,
  v2PoolTvlSelector: () => v2PoolTvlSelector,
  v2SubgraphClient: () => v2SubgraphClient,
  v3PoolSubgraphSelection: () => v3PoolTvlSelector,
  v3PoolTvlSelector: () => v3PoolTvlSelector,
  v3PoolsOnChainProviderFactory: () => v3PoolsOnChainProviderFactory,
  v3SubgraphClient: () => v3SubgraphClient
});
function getAmountDistribution(amount, distributionPercent) {
  const percents = [];
  const amounts = [];
  for (let i = 1; i <= 100 / distributionPercent; i++) {
    percents.push(i * distributionPercent);
    amounts.push(amount.multiply(new sdk.Fraction(i * distributionPercent, 100)));
  }
  return [percents, amounts];
}
function wrappedCurrency(currency, chainId) {
  if (currency?.isNative) {
    switch (chainId) {
      case 84532 /* BASE_SEPOLIA */:
        return baseSepoliaTokens.weth;
      case 943 /* PULSECHAIN_TESTNET */:
        return pulsechainTestnetTokens.wpls;
    }
  }
  return currency?.isToken ? currency : void 0;
}

// evm/v3-router/types/pool.ts
var PoolType = /* @__PURE__ */ ((PoolType2) => {
  PoolType2[PoolType2["V2"] = 0] = "V2";
  PoolType2[PoolType2["V3"] = 1] = "V3";
  PoolType2[PoolType2["STABLE"] = 2] = "STABLE";
  return PoolType2;
})(PoolType || {});

// evm/v3-router/types/route.ts
var RouteType = /* @__PURE__ */ ((RouteType2) => {
  RouteType2[RouteType2["V2"] = 0] = "V2";
  RouteType2[RouteType2["V3"] = 1] = "V3";
  RouteType2[RouteType2["STABLE"] = 2] = "STABLE";
  RouteType2[RouteType2["MIXED"] = 3] = "MIXED";
  RouteType2[RouteType2["MM"] = 4] = "MM";
  return RouteType2;
})(RouteType || {});

// evm/v3-router/utils/pool.ts
function computePairAddress(token0, token1, isStable) {
  const [_token0, _token1] = token0.sortsBefore(token1) ? [token0, token1] : [token1, token0];
  const salt = viem.keccak256(
    viem.encodePacked(["address", "address", "bool"], [_token0.address, _token1.address, isStable])
  );
  return viem.getCreate2Address({
    from: "0xf532839E3B36Bac7281B4986e197127166eFD6De",
    salt,
    bytecodeHash: "0x0d0128a81f322b1beff50a2fe5e23a194fffc4f7c81736e27af97cded386e788"
  });
}
function isV2Pool(pool) {
  return pool.type === 0 /* V2 */;
}
function isV3Pool(pool) {
  return pool.type === 1 /* V3 */;
}
function isStablePool(pool) {
  return pool.type === 2 /* STABLE */;
}
function involvesCurrency(pool, currency) {
  const token = currency.wrapped;
  if (isV2Pool(pool) || isStablePool(pool)) {
    const { reserve0, reserve1 } = pool;
    return reserve0.currency.equals(token) || reserve1.currency.equals(token);
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool;
    return token0.equals(token) || token1.equals(token);
  }
  return false;
}
function getOutputCurrency(pool, currencyIn) {
  const tokenIn = currencyIn.wrapped;
  if (isV2Pool(pool) || isStablePool(pool)) {
    const { reserve0, reserve1 } = pool;
    return reserve0.currency.equals(tokenIn) ? reserve1.currency : reserve0.currency;
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool;
    return token0.equals(tokenIn) ? token1 : token0;
  }
  throw new Error("Cannot get output currency by invalid pool");
}
var computeV3PoolAddress = memoize__default.default(
  customPoolsSdk.computePoolAddress,
  ({ poolDeployer, tokenA, tokenB, initCodeHashManualOverride }) => `${tokenA.chainId}_${poolDeployer}_${tokenA.address}_${initCodeHashManualOverride}_${tokenB.address}`
);
var computeV3CustomPoolAddress = memoize__default.default(
  customPoolsSdk.computeCustomPoolAddress,
  ({ mainPoolDeployer, tokenA, tokenB, customPoolDeployer, initCodeHashManualOverride }) => `${tokenA.chainId}_${mainPoolDeployer}_${customPoolDeployer}_${tokenA.address}_${initCodeHashManualOverride}_${tokenB.address}`
);
var computeV2PoolAddress = memoize__default.default(
  computePairAddress,
  (tokenA, tokenB, isStable) => `${tokenA.chainId}_${tokenA.address}_${tokenB.address}_${isStable}`
);
var getPoolAddress = function getAddress(pool) {
  if (isV3Pool(pool)) {
    return pool.address;
  }
  if (isV2Pool(pool)) {
    const { reserve0, reserve1 } = pool;
    return computeV2PoolAddress(reserve0.currency.wrapped, reserve1.currency.wrapped, false);
  }
  if (isStablePool(pool)) {
    const { reserve0, reserve1 } = pool;
    return computeV2PoolAddress(reserve0.currency.wrapped, reserve1.currency.wrapped, true);
  }
  return "";
};
function getTokenPrice(pool, base, quote) {
  if (isV3Pool(pool)) {
    const { token0, token1, fee, liquidity, sqrtRatioX96, tick } = pool;
    const v3Pool = new v3Sdk.Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick);
    return v3Pool.priceOf(base.wrapped);
  }
  if (isV2Pool(pool) || isStablePool(pool)) {
    sdk.Pair.getAddress = computePairAddress.bind(sdk.Pair, pool.reserve0.currency.wrapped, pool.reserve1.currency.wrapped, isStablePool(pool));
    const pair = new sdk.Pair(pool.reserve0.wrapped, pool.reserve1.wrapped);
    return pair.priceOf(base.wrapped);
  }
  return new sdk.Price(base, quote, BigInt(1), BigInt(0));
}

// evm/v3-router/utils/encodeMixedRouteToPath.ts
function encodeMixedRouteToPath(route, exactOutput, isV3Only) {
  const firstInputToken = route.input.wrapped;
  const { path, types } = route.pools.reduce(
    ({ inputToken, path: path2, types: types2 }, pool, index) => {
      const outputToken = getOutputCurrency(pool, inputToken).wrapped;
      const version = isV3Pool(pool) ? pool.deployer : isStablePool(pool) ? 2 : isV2Pool(pool) ? 1 : -1;
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: isV3Only ? ["address", "address", "address"] : ["address", "uint24", "address"],
          path: isV3Only ? [inputToken.address, pool.deployer, outputToken.address] : [inputToken.address, version, outputToken.address]
        };
      }
      return {
        inputToken: outputToken,
        types: isV3Only ? [...types2, "address", "address"] : [...types2, "uint24", "address"],
        path: isV3Only ? [...path2, pool.deployer, outputToken.address] : [...path2, version, outputToken.address]
      };
    },
    { inputToken: firstInputToken, path: [], types: [] }
  );
  return exactOutput ? viem.encodePacked(types.reverse(), path.reverse()) : viem.encodePacked(types, path);
}
function getExecutionPrice(trade) {
  if (!trade) {
    return null;
  }
  const { inputAmount, outputAmount } = trade;
  if (inputAmount.quotient === customPoolsSdk.ZERO || outputAmount.quotient === customPoolsSdk.ZERO) {
    return null;
  }
  return new customPoolsSdk.Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient);
}

// evm/v3-router/utils/getNativeWrappedToken.ts
function getNativeWrappedToken(chainId) {
  switch (chainId) {
    case 84532 /* BASE_SEPOLIA */:
      return baseSepoliaTokens.weth;
    default:
      return null;
  }
}

// evm/v3-router/utils/getUsdGasToken.ts
function getUsdGasToken(chainId) {
  return usdGasTokensByChain[chainId]?.[0] ?? null;
}

// evm/v3-router/utils/isCurrenciesSameChain.ts
function isCurrenciesSameChain(...currencies) {
  const chainId = currencies[0]?.chainId;
  for (const currency of currencies) {
    if (currency.chainId !== chainId) {
      return false;
    }
  }
  return true;
}
var SCOPE_PREFIX = "smart-router";
var SCOPE = {
  metric: "metric",
  log: "log",
  error: "error"
};
var log_ = debug__default.default(SCOPE_PREFIX);
var metric = log_.extend(SCOPE.metric);
var log = log_.extend(SCOPE.log);
var logger = {
  metric,
  log,
  error: debug__default.default(SCOPE_PREFIX).extend(SCOPE.error),
  enable: (namespace) => {
    let namespaces = namespace;
    if (namespace.includes(",")) {
      namespaces = namespace.split(",").map((ns) => `${SCOPE_PREFIX}:${ns}`).join(",");
    } else {
      namespaces = `${SCOPE_PREFIX}:${namespace}`;
    }
    debug__default.default.enable(namespaces);
  }
};
function maximumAmountIn(trade, slippage, amountIn = trade.inputAmount) {
  const slippageBN = new sdk.Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()));
  if (trade.tradeType === sdk.TradeType.EXACT_INPUT) {
    return customPoolsSdk.CurrencyAmount.fromRawAmount(amountIn.currency, amountIn.quotient.toString());
  }
  const slippageAdjustedAmountIn = new sdk.Fraction(sdk.ONE).add(slippageBN).multiply(amountIn.quotient.toString()).quotient;
  return customPoolsSdk.CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn.toString());
}
function maximumAmountInBN(trade, slippage, amountIn = trade.inputAmount) {
  const slippageBN = new sdk.Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()));
  if (trade.tradeType === sdk.TradeType.EXACT_INPUT) {
    return sdk.CurrencyAmount.fromRawAmount(amountIn.currency, amountIn.quotient.toString());
  }
  const slippageAdjustedAmountIn = new sdk.Fraction(sdk.ONE).add(slippageBN).multiply(amountIn.quotient.toString()).quotient;
  return sdk.CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
}
function minimumAmountOut(trade, slippage, amountOut = trade.outputAmount) {
  const slippageBN = new sdk.Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()));
  if (trade.tradeType === sdk.TradeType.EXACT_OUTPUT) {
    return customPoolsSdk.CurrencyAmount.fromRawAmount(amountOut.currency, amountOut.quotient.toString());
  }
  const slippageAdjustedAmountOut = new sdk.Fraction(sdk.ONE).add(slippageBN).invert().multiply(amountOut.quotient.toString()).quotient;
  return customPoolsSdk.CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut.toString());
}
function minimumAmountOutBN(trade, slippage, amountOut = trade.outputAmount) {
  const slippageBN = new sdk.Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()));
  if (trade.tradeType === sdk.TradeType.EXACT_OUTPUT) {
    return sdk.CurrencyAmount.fromRawAmount(amountOut.currency, amountOut.quotient.toString());
  }
  const slippageAdjustedAmountOut = new sdk.Fraction(sdk.ONE).add(slippageBN).invert().multiply(amountOut.quotient.toString()).quotient;
  return sdk.CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
}

// evm/v3-router/utils/route.ts
function buildBaseRoute(pools, currencyIn, currencyOut) {
  const path = [currencyIn.wrapped];
  let prevIn = path[0];
  let routeType = null;
  const updateRouteType = (pool, currentRouteType) => {
    if (currentRouteType === null) {
      return getRouteTypeFromPool(pool);
    }
    if (currentRouteType === 3 /* MIXED */ || currentRouteType !== getRouteTypeFromPool(pool)) {
      return 3 /* MIXED */;
    }
    return currentRouteType;
  };
  for (const pool of pools) {
    prevIn = getOutputCurrency(pool, prevIn);
    path.push(prevIn);
    routeType = updateRouteType(pool, routeType);
  }
  if (routeType === null) {
    throw new Error(`Invalid route type when constructing base route`);
  }
  return {
    path,
    pools,
    type: routeType,
    input: currencyIn,
    output: currencyOut
  };
}
function getRouteTypeFromPool(pool) {
  switch (pool.type) {
    case 0 /* V2 */:
      return 0 /* V2 */;
    case 1 /* V3 */:
      return 1 /* V3 */;
    case 2 /* STABLE */:
      return 0 /* V2 */;
    default:
      return 3 /* MIXED */;
  }
}
function getQuoteCurrency({ input, output }, baseCurrency) {
  return baseCurrency.equals(input) ? output : input;
}
function getMidPrice({ path, pools }) {
  let i = 0;
  let price = null;
  for (const pool of pools) {
    const input = path[i].wrapped;
    const output = path[i + 1].wrapped;
    const poolPrice = getTokenPrice(pool, input, output);
    price = price ? price.multiply(poolPrice) : poolPrice;
    i += 1;
  }
  if (!price) {
    throw new Error("Get mid price failed");
  }
  return price;
}
function getPriceImpact(trade) {
  let spotOutputAmount = customPoolsSdk.CurrencyAmount.fromRawAmount(trade.outputAmount.currency.wrapped, 0);
  for (const route of trade.routes) {
    const { inputAmount } = route;
    const midPrice = getMidPrice(route);
    const midPriceAmountBN = midPrice.quote(swapSdkCore.CurrencyAmount.fromRawAmount(inputAmount.wrapped.currency, inputAmount.quotient.toString()));
    spotOutputAmount = spotOutputAmount.add(customPoolsSdk.CurrencyAmount.fromRawAmount(midPriceAmountBN.currency.wrapped, midPriceAmountBN.quotient.toString()));
  }
  const priceImpact = spotOutputAmount.subtract(trade.outputAmount.wrapped).divide(spotOutputAmount);
  return new customPoolsSdk.Percent(priceImpact.numerator.toString(), priceImpact.denominator.toString());
}

// evm/v3-router/utils/transformer.ts
var transformer_exports = {};
__export(transformer_exports, {
  parseCurrency: () => parseCurrency,
  parseCurrencyAmount: () => parseCurrencyAmount,
  parsePool: () => parsePool,
  parseRoute: () => parseRoute,
  parseTrade: () => parseTrade,
  serializeCurrency: () => serializeCurrency,
  serializeCurrencyAmount: () => serializeCurrencyAmount,
  serializePool: () => serializePool,
  serializeRoute: () => serializeRoute,
  serializeTrade: () => serializeTrade
});
var ONE_HUNDRED = BigInt(100);
function serializeCurrency(currency) {
  return {
    address: currency.isNative ? v3Sdk.ADDRESS_ZERO : currency.wrapped.address,
    decimals: currency.decimals,
    symbol: currency.symbol
  };
}
function serializeCurrencyAmount(amount) {
  return {
    currency: serializeCurrency(amount.currency),
    value: amount.quotient.toString()
  };
}
function serializePool(pool) {
  if (isV2Pool(pool) || isStablePool(pool)) {
    return {
      ...pool,
      reserve0: serializeCurrencyAmount(pool.reserve0),
      reserve1: serializeCurrencyAmount(pool.reserve1)
    };
  }
  if (isV3Pool(pool)) {
    return {
      ...pool,
      token0: serializeCurrency(pool.token0),
      token1: serializeCurrency(pool.token1),
      liquidity: pool.liquidity.toString(),
      sqrtRatioX96: pool.sqrtRatioX96.toString(),
      token0ProtocolFee: pool.token0ProtocolFee.toFixed(0),
      token1ProtocolFee: pool.token1ProtocolFee.toFixed(0)
    };
  }
  throw new Error("Cannot serialize unsupoorted pool");
}
function serializeRoute(route) {
  return {
    ...route,
    pools: route.pools.map(serializePool),
    path: route.path.map(serializeCurrency),
    inputAmount: serializeCurrencyAmount(sdk.CurrencyAmount.fromRawAmount(route.inputAmount.currency, route.inputAmount.quotient.toString())),
    outputAmount: serializeCurrencyAmount(sdk.CurrencyAmount.fromRawAmount(route.outputAmount.currency, route.outputAmount.quotient.toString()))
  };
}
function serializeTrade(trade) {
  return {
    ...trade,
    inputAmount: serializeCurrencyAmount(sdk.CurrencyAmount.fromRawAmount(trade.inputAmount.currency, trade.inputAmount.quotient.toString())),
    outputAmount: serializeCurrencyAmount(sdk.CurrencyAmount.fromRawAmount(trade.outputAmount.currency, trade.outputAmount.quotient.toString())),
    routes: trade.routes.map(serializeRoute),
    gasEstimate: trade.gasEstimate.toString(),
    gasEstimateInUSD: serializeCurrencyAmount(sdk.CurrencyAmount.fromRawAmount(trade.gasEstimateInUSD.currency, trade.gasEstimateInUSD.quotient.toString()))
  };
}
function parseCurrency(chainId, currency) {
  if (currency.address === v3Sdk.ADDRESS_ZERO) {
    return customPoolsSdk.Native.onChain(chainId, "ETH", "ETH");
  }
  const { address, decimals, symbol } = currency;
  return new sdk.ERC20Token(chainId, address, decimals, symbol);
}
function parseCurrencyAmount(chainId, amount) {
  return sdk.CurrencyAmount.fromRawAmount(parseCurrency(chainId, amount.currency), amount.value);
}
function parsePool(chainId, pool) {
  if (pool.type === 0 /* V2 */ || pool.type === 2 /* STABLE */) {
    return {
      ...pool,
      reserve0: parseCurrencyAmount(chainId, pool.reserve0),
      reserve1: parseCurrencyAmount(chainId, pool.reserve1)
    };
  }
  if (pool.type === 1 /* V3 */) {
    return {
      ...pool,
      token0: parseCurrency(chainId, pool.token0),
      token1: parseCurrency(chainId, pool.token1),
      liquidity: BigInt(pool.liquidity),
      sqrtRatioX96: BigInt(pool.sqrtRatioX96),
      token0ProtocolFee: new sdk.Percent(pool.token0ProtocolFee, ONE_HUNDRED),
      token1ProtocolFee: new sdk.Percent(pool.token1ProtocolFee, ONE_HUNDRED)
    };
  }
  throw new Error("Cannot parse unsupoorted pool");
}
function parseRoute(chainId, route) {
  const parsedInput = parseCurrencyAmount(chainId, route.inputAmount);
  const parsedOutput = parseCurrencyAmount(chainId, route.outputAmount);
  return {
    ...route,
    pools: route.pools.map((p) => parsePool(chainId, p)),
    path: route.path.map((c) => parseCurrency(chainId, c)),
    inputAmount: customPoolsSdk.CurrencyAmount.fromRawAmount(parsedInput.currency, parsedInput.quotient.toString()),
    outputAmount: customPoolsSdk.CurrencyAmount.fromRawAmount(parsedOutput.currency, parsedOutput.quotient.toString())
  };
}
function parseTrade(chainId, trade) {
  const parsedInput = parseCurrencyAmount(chainId, trade.inputAmount);
  const parsedOutput = parseCurrencyAmount(chainId, trade.outputAmount);
  const parsedGasEstimateInUSD = parseCurrencyAmount(chainId, trade.gasEstimateInUSD);
  return {
    ...trade,
    inputAmount: customPoolsSdk.CurrencyAmount.fromRawAmount(parsedInput.currency, parsedInput.quotient.toString()),
    outputAmount: customPoolsSdk.CurrencyAmount.fromRawAmount(parsedOutput.currency, parsedOutput.quotient.toString()),
    routes: trade.routes.map((r) => parseRoute(chainId, r)),
    gasEstimate: BigInt(trade.gasEstimate),
    gasEstimateInUSD: customPoolsSdk.CurrencyAmount.fromRawAmount(parsedGasEstimateInUSD.currency, parsedGasEstimateInUSD.quotient.toString())
  };
}

// evm/v3-router/functions/getPairCombinations.ts
var resolver = (currencyA, currencyB) => {
  if (!currencyA || !currencyB || currencyA.wrapped.equals(currencyB.wrapped)) {
    return `${currencyA?.chainId}_${currencyA?.wrapped?.address}_${currencyB?.wrapped?.address}`;
  }
  const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped) ? [currencyA.wrapped, currencyB.wrapped] : [currencyB.wrapped, currencyA.wrapped];
  return `${token0.chainId}_${token0.address}_${token1.address}`;
};
function getAdditionalCheckAgainstBaseTokens(currencyA, currencyB) {
  const chainId = currencyA?.chainId;
  const additionalBases = {
    ...chainId ? ADDITIONAL_BASES[chainId] ?? {} : {}
  };
  const uniq = (tokens) => uniqBy__default.default(tokens, (t) => t.address);
  const additionalA = currencyA && chainId ? uniq([...additionalBases[currencyA.wrapped.address] || []]) ?? [] : [];
  const additionalB = currencyB && chainId ? uniq([...additionalBases[currencyB.wrapped.address] || []]) ?? [] : [];
  return [...additionalA, ...additionalB];
}
var getCheckAgainstBaseTokens = memoize__default.default((currencyA, currencyB) => {
  const chainId = currencyA?.chainId;
  if (!chainId || !currencyA || !currencyB || !isCurrenciesSameChain(currencyA, currencyB)) {
    return [];
  }
  const [tokenA, tokenB] = chainId ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)] : [void 0, void 0];
  if (!tokenA || !tokenB) {
    return [];
  }
  const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];
  return [...common, ...getAdditionalCheckAgainstBaseTokens(currencyA, currencyB)];
}, resolver);
var getPairCombinations = memoize__default.default((currencyA, currencyB) => {
  const chainId = currencyA?.chainId;
  if (!chainId || !currencyA || !currencyB || !isCurrenciesSameChain(currencyA, currencyB)) {
    return [];
  }
  const [tokenA, tokenB] = chainId ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)] : [void 0, void 0];
  if (!tokenA || !tokenB) {
    return [];
  }
  const bases = getCheckAgainstBaseTokens(currencyA, currencyB);
  const basePairs = flatMap__default.default(
    bases,
    (base) => bases.map((otherBase) => [base, otherBase])
  );
  return [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base) => [tokenA, base]),
    // token B against all bases
    ...bases.map((base) => [tokenB, base]),
    // each base against all bases
    ...basePairs
  ].filter((tokens) => Boolean(tokens[0] && tokens[1])).filter(([t0, t1]) => !t0.equals(t1)).filter(([tokenA_, tokenB_]) => {
    if (!chainId)
      return true;
    const customBases = CUSTOM_BASES[chainId];
    const customBasesA = customBases?.[tokenA_.wrapped.address];
    const customBasesB = customBases?.[tokenB_.wrapped.address];
    if (!customBasesA && !customBasesB)
      return true;
    if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base)))
      return false;
    if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base)))
      return false;
    return true;
  });
}, resolver);

// evm/v3-router/functions/computeAllRoutes.ts
function computeAllRoutes(input, output, candidatePools, maxHops = 3) {
  logger.metric("Computing routes from", candidatePools.length, "pools");
  const poolsUsed = Array(candidatePools.length).fill(false);
  const routes = [];
  const computeRoutes = (currencyIn, currencyOut, currentRoute, _previousCurrencyOut) => {
    if (currentRoute.length > maxHops) {
      return;
    }
    if (currentRoute.length > 0 && involvesCurrency(currentRoute[currentRoute.length - 1], currencyOut)) {
      routes.push(buildBaseRoute([...currentRoute], currencyIn, currencyOut));
      return;
    }
    for (let i = 0; i < candidatePools.length; i++) {
      if (poolsUsed[i]) {
        continue;
      }
      const curPool = candidatePools[i];
      const previousCurrencyOut = _previousCurrencyOut || currencyIn;
      if (!involvesCurrency(curPool, previousCurrencyOut)) {
        continue;
      }
      const currentTokenOut = getOutputCurrency(curPool, previousCurrencyOut);
      if (currencyIn.wrapped.equals(currentTokenOut.wrapped)) {
        continue;
      }
      currentRoute.push(curPool);
      poolsUsed[i] = true;
      computeRoutes(currencyIn, currencyOut, currentRoute, currentTokenOut);
      poolsUsed[i] = false;
      currentRoute.pop();
    }
  };
  computeRoutes(input, output, []);
  logger.metric("Computed routes from", candidatePools.length, "pools", routes.length, "routes");
  return routes;
}
function getBestRouteCombinationByQuotes(amount, quoteCurrency, routesWithQuote, tradeType, config) {
  const chainId = amount.currency.chainId;
  const percents = [];
  const percentToQuotes = {};
  for (const routeWithQuote of routesWithQuote) {
    if (!percentToQuotes[routeWithQuote.percent]) {
      percentToQuotes[routeWithQuote.percent] = [];
      percents.push(routeWithQuote.percent);
    }
    percentToQuotes[routeWithQuote.percent].push(routeWithQuote);
  }
  const swapRoute = getBestSwapRouteBy(
    tradeType,
    percentToQuotes,
    percents.sort((a, b) => a - b),
    chainId,
    (rq) => rq.quoteAdjustedForGas,
    config
  );
  if (!swapRoute) {
    return null;
  }
  const { routes: routeAmounts } = swapRoute;
  const totalAmount = routeAmounts.reduce(
    (total, routeAmount) => total.add(routeAmount.amount),
    sdk.CurrencyAmount.fromRawAmount(routeAmounts[0].amount.currency, 0)
  );
  const missingAmount = amount.subtract(totalAmount);
  if (missingAmount.greaterThan(0)) {
    logger.log(
      "Optimal route's amounts did not equal exactIn/exactOut total. Adding missing amount to last route in array.",
      {
        missingAmount: missingAmount.quotient.toString()
      }
    );
    routeAmounts[routeAmounts.length - 1].amount = routeAmounts[routeAmounts.length - 1].amount.add(missingAmount);
  }
  logger.log(
    {
      routes: routeAmounts,
      numSplits: routeAmounts.length,
      amount: amount.toExact(),
      quote: swapRoute.quote.toExact(),
      quoteGasAdjusted: swapRoute.quoteGasAdjusted.toFixed(Math.min(swapRoute.quoteGasAdjusted.currency.decimals, 2)),
      estimatedGasUSD: swapRoute.estimatedGasUsedUSD.toFixed(
        Math.min(swapRoute.estimatedGasUsedUSD.currency.decimals, 2)
      ),
      estimatedGasToken: swapRoute.estimatedGasUsedQuoteToken.toFixed(
        Math.min(swapRoute.estimatedGasUsedQuoteToken.currency.decimals, 2)
      )
    },
    `Found best swap route. ${routeAmounts.length} split.`
  );
  const { routes, quote: quoteAmount, estimatedGasUsed, estimatedGasUsedUSD } = swapRoute;
  const quoteJSBI = customPoolsSdk.CurrencyAmount.fromRawAmount(quoteCurrency, quoteAmount.quotient.toString());
  const amountJSBI = customPoolsSdk.CurrencyAmount.fromRawAmount(amount.currency, amount.quotient.toString());
  const isExactIn = tradeType === sdk.TradeType.EXACT_INPUT;
  return {
    routes: routes.map(({ type, amount: routeAmount, quote: routeQuoteAmount, pools, path, percent, feeList, sqrtPriceX96AfterList, amountInList, amountOutList }) => {
      return {
        percent,
        type,
        pools,
        path,
        feeList,
        sqrtPriceX96AfterList,
        amountInList,
        amountOutList,
        inputAmount: isExactIn ? customPoolsSdk.CurrencyAmount.fromRawAmount(routeAmount.currency, routeAmount.quotient.toString()) : customPoolsSdk.CurrencyAmount.fromRawAmount(routeQuoteAmount.currency, routeQuoteAmount.quotient.toString()),
        outputAmount: isExactIn ? customPoolsSdk.CurrencyAmount.fromRawAmount(routeQuoteAmount.currency, routeQuoteAmount.quotient.toString()) : customPoolsSdk.CurrencyAmount.fromRawAmount(routeAmount.currency, routeAmount.quotient.toString())
      };
    }),
    gasEstimate: estimatedGasUsed,
    gasEstimateInUSD: customPoolsSdk.CurrencyAmount.fromRawAmount(estimatedGasUsedUSD.currency, estimatedGasUsedUSD.quotient.toString()),
    inputAmount: isExactIn ? amountJSBI : quoteJSBI,
    outputAmount: isExactIn ? quoteJSBI : amountJSBI
  };
}
function getBestSwapRouteBy(tradeType, percentToQuotes, percents, chainId, by, { maxSplits = 4, minSplits = 0 }) {
  const percentToSortedQuotes = mapValues__default.default(percentToQuotes, (routeQuotes) => {
    return routeQuotes.sort((routeQuoteA, routeQuoteB) => {
      if (tradeType === sdk.TradeType.EXACT_INPUT) {
        return by(routeQuoteA).greaterThan(by(routeQuoteB)) ? -1 : 1;
      }
      return by(routeQuoteA).lessThan(by(routeQuoteB)) ? -1 : 1;
    });
  });
  const quoteCompFn = tradeType === sdk.TradeType.EXACT_INPUT ? (a, b) => a.greaterThan(b) : (a, b) => a.lessThan(b);
  const sumFn = (currencyAmounts) => {
    let sum2 = currencyAmounts[0];
    for (let i = 1; i < currencyAmounts.length; i++) {
      sum2 = sum2.add(currencyAmounts[i]);
    }
    return sum2;
  };
  let bestQuote;
  let bestSwap;
  const bestSwapsPerSplit = new FixedReverseHeap__default.default(
    Array,
    (a, b) => {
      return quoteCompFn(a.quote, b.quote) ? -1 : 1;
    },
    3
  );
  if (!percentToSortedQuotes[100] || minSplits > 1) {
    logger.log(
      {
        percentToSortedQuotes: mapValues__default.default(percentToSortedQuotes, (p) => p.length)
      },
      "Did not find a valid route without any splits. Continuing search anyway."
    );
  } else {
    bestQuote = by(percentToSortedQuotes[100][0]);
    bestSwap = [percentToSortedQuotes[100][0]];
    for (const routeWithQuote of percentToSortedQuotes[100].slice(0, 5)) {
      bestSwapsPerSplit.push({
        quote: by(routeWithQuote),
        routes: [routeWithQuote]
      });
    }
  }
  const queue = new Queue__default.default();
  for (let i = percents.length; i >= 0; i--) {
    const percent = percents[i];
    if (!percentToSortedQuotes[percent]) {
      continue;
    }
    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent][0]],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: false
    });
    if (!percentToSortedQuotes[percent] || !percentToSortedQuotes[percent][1]) {
      continue;
    }
    queue.enqueue({
      curRoutes: [percentToSortedQuotes[percent][1]],
      percentIndex: i,
      remainingPercent: 100 - percent,
      special: true
    });
  }
  let splits = 1;
  while (queue.size > 0) {
    logger.log(
      {
        top5: Array.from(bestSwapsPerSplit.consume()).map(
          (q) => `${q.quote.toExact()} (${q.routes.map(
            (r) => `${r.percent}% ${r.amount.toExact()} ${r.pools.map((p) => {
              if (isV2Pool(p)) {
                return `V2 ${p.reserve0.currency.symbol}-${p.reserve1.currency.symbol}`;
              }
              if (isStablePool(p)) {
                return `Stable ${p.reserve0.currency.symbol}-${p.reserve1.currency.symbol}`;
              }
              if (isV3Pool(p)) {
                return `V3 fee ${p.fee} ${p.token0.symbol}-${p.token1.symbol}`;
              }
            }).join(", ")} ${r.quote.toExact()}`
          ).join(", ")})`
        ),
        onQueue: queue.size
      },
      `Top 3 with ${splits} splits`
    );
    bestSwapsPerSplit.clear();
    let layer = queue.size;
    splits++;
    if (splits >= 3 && bestSwap && bestSwap.length < splits - 1) {
      break;
    }
    if (splits > maxSplits) {
      logger.log("Max splits reached. Stopping search.");
      break;
    }
    while (layer > 0) {
      layer--;
      const { remainingPercent, curRoutes, percentIndex, special } = queue.dequeue();
      for (let i = percentIndex; i >= 0; i--) {
        const percentA = percents[i];
        if (percentA > remainingPercent) {
          continue;
        }
        if (!percentToSortedQuotes[percentA]) {
          continue;
        }
        const candidateRoutesA = percentToSortedQuotes[percentA];
        const routeWithQuoteA = findFirstRouteNotUsingUsedPools(curRoutes, candidateRoutesA);
        if (!routeWithQuoteA) {
          continue;
        }
        const remainingPercentNew = remainingPercent - percentA;
        const curRoutesNew = [...curRoutes, routeWithQuoteA];
        if (remainingPercentNew === 0 && splits >= minSplits) {
          const quotesNew = curRoutesNew.map((r) => by(r));
          const quoteNew = sumFn(quotesNew);
          const gasCostL1QuoteToken2 = sdk.CurrencyAmount.fromRawAmount(quoteNew.currency, 0);
          const quoteAfterL1Adjust = tradeType === sdk.TradeType.EXACT_INPUT ? quoteNew.subtract(gasCostL1QuoteToken2) : quoteNew.add(gasCostL1QuoteToken2);
          bestSwapsPerSplit.push({
            quote: quoteAfterL1Adjust,
            routes: curRoutesNew
          });
          if (!bestQuote || quoteCompFn(quoteAfterL1Adjust, bestQuote)) {
            bestQuote = quoteAfterL1Adjust;
            bestSwap = curRoutesNew;
          }
        } else {
          queue.enqueue({
            curRoutes: curRoutesNew,
            remainingPercent: remainingPercentNew,
            percentIndex: i,
            special
          });
        }
      }
    }
  }
  if (!bestSwap) {
    logger.log(`Could not find a valid swap`);
    return null;
  }
  let quoteGasAdjusted = sumFn(bestSwap.map((routeWithValidQuote) => routeWithValidQuote.quoteAdjustedForGas));
  const estimatedGasUsed = bestSwap.map((routeWithValidQuote) => routeWithValidQuote.gasEstimate).reduce((sum2, routeWithValidQuote) => sum2 + routeWithValidQuote, BigInt(0));
  if (!usdGasTokensByChain[chainId] || !usdGasTokensByChain[chainId][0]) {
    throw new Error(`Could not find a USD token for computing gas costs on ${chainId}`);
  }
  const usdToken = usdGasTokensByChain[chainId][0];
  const usdTokenDecimals = usdToken.decimals;
  const gasCostsL1ToL2 = {
    gasUsedL1: BigInt(0),
    gasCostL1USD: sdk.CurrencyAmount.fromRawAmount(usdToken, 0),
    gasCostL1QuoteToken: sdk.CurrencyAmount.fromRawAmount(
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      bestSwap[0]?.quote.currency.wrapped,
      0
    )
  };
  const { gasCostL1USD, gasCostL1QuoteToken } = gasCostsL1ToL2;
  const estimatedGasUsedUSDs = bestSwap.map((routeWithValidQuote) => {
    const decimalsDiff = usdTokenDecimals - routeWithValidQuote.gasCostInUSD.currency.decimals;
    if (decimalsDiff === 0) {
      return sdk.CurrencyAmount.fromRawAmount(usdToken, routeWithValidQuote.gasCostInUSD.quotient);
    }
    return sdk.CurrencyAmount.fromRawAmount(
      usdToken,
      routeWithValidQuote.gasCostInUSD.quotient * BigInt(10) ** BigInt(decimalsDiff)
    );
  });
  let estimatedGasUsedUSD = sumFn(estimatedGasUsedUSDs);
  if (!estimatedGasUsedUSD.currency.equals(gasCostL1USD.currency)) {
    const decimalsDiff = usdTokenDecimals - gasCostL1USD.currency.decimals;
    estimatedGasUsedUSD = estimatedGasUsedUSD.add(
      sdk.CurrencyAmount.fromRawAmount(usdToken, gasCostL1USD.quotient * BigInt(10) ** BigInt(decimalsDiff))
    );
  } else {
    estimatedGasUsedUSD = estimatedGasUsedUSD.add(gasCostL1USD);
  }
  const estimatedGasUsedQuoteToken = sumFn(
    bestSwap.map((routeWithValidQuote) => routeWithValidQuote.gasCostInToken)
  ).add(gasCostL1QuoteToken);
  const quote = sumFn(bestSwap.map((routeWithValidQuote) => routeWithValidQuote.quote));
  if (tradeType === sdk.TradeType.EXACT_INPUT) {
    const quoteGasAdjustedForL1 = quoteGasAdjusted.subtract(gasCostL1QuoteToken);
    quoteGasAdjusted = quoteGasAdjustedForL1;
  } else {
    const quoteGasAdjustedForL1 = quoteGasAdjusted.add(gasCostL1QuoteToken);
    quoteGasAdjusted = quoteGasAdjustedForL1;
  }
  const routeWithQuotes = bestSwap.sort(
    (routeAmountA, routeAmountB) => routeAmountB.amount.greaterThan(routeAmountA.amount) ? 1 : -1
  );
  return {
    quote,
    quoteGasAdjusted,
    estimatedGasUsed,
    estimatedGasUsedUSD,
    estimatedGasUsedQuoteToken,
    routes: routeWithQuotes
  };
}
var findFirstRouteNotUsingUsedPools = (usedRoutes, candidateRouteQuotes) => {
  const poolAddressSet = /* @__PURE__ */ new Set();
  const usedPoolAddresses = flatMap__default.default(usedRoutes, ({ pools }) => pools.map(getPoolAddress));
  for (const poolAddress of usedPoolAddresses) {
    poolAddressSet.add(poolAddress);
  }
  for (const routeQuote of candidateRouteQuotes) {
    const { pools } = routeQuote;
    const poolAddresses = pools.map(getPoolAddress);
    if (poolAddresses.some((poolAddress) => poolAddressSet.has(poolAddress))) {
      continue;
    }
    return routeQuote;
  }
  return null;
};
function parseUnits(value, decimals) {
  let [integer, fraction = "0"] = value.split(".");
  const negative = integer.startsWith("-");
  if (negative)
    integer = integer.slice(1);
  fraction = fraction.replace(/(0+)$/, "");
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1)
      integer = `${BigInt(integer) + BigInt(1)}`;
    fraction = "";
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals)
    ];
    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9)
      fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
    else
      fraction = `${left}${rounded}`;
    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + BigInt(1)}`;
    }
    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, "0");
  }
  return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
}
function tryParseAmount(value, currency) {
  if (!value || !currency) {
    return void 0;
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    if (typedValueParsed !== "0") {
      return swapSdkCore.CurrencyAmount.fromRawAmount(currency, BigInt(typedValueParsed));
    }
  } catch (error) {
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  return void 0;
}
var tryParseAmount_default = tryParseAmount;
function getTokenPriceByNumber(baseCurrency, quoteCurrency, price) {
  const quoteAmount = tryParseAmount_default(String(price), baseCurrency);
  const baseAmount = tryParseAmount_default("1", quoteCurrency);
  if (!baseAmount || !quoteAmount) {
    return void 0;
  }
  return new sdk.Price({ baseAmount, quoteAmount });
}
async function createGasModel({
  gasPriceWei,
  poolProvider,
  quoteCurrency,
  blockNumber,
  quoteCurrencyUsdPrice,
  nativeCurrencyUsdPrice
}) {
  const { chainId } = quoteCurrency;
  const usdToken = getUsdGasToken(chainId);
  if (!usdToken) {
    throw new Error(`No valid usd token found on chain ${chainId}`);
  }
  const nativeWrappedToken = getNativeWrappedToken(chainId);
  if (!nativeWrappedToken) {
    throw new Error(`Unsupported chain ${chainId}. Native wrapped token not found.`);
  }
  const gasPrice = BigInt(typeof gasPriceWei === "function" ? await gasPriceWei() : gasPriceWei);
  const [usdPool, nativePool] = await Promise.all([
    getHighestLiquidityUSDPool(poolProvider, chainId, blockNumber),
    getHighestLiquidityNativePool(poolProvider, quoteCurrency, blockNumber)
  ]);
  const priceInUsd = quoteCurrencyUsdPrice ? getTokenPriceByNumber(usdToken, quoteCurrency, quoteCurrencyUsdPrice) : void 0;
  const nativePriceInUsd = nativeCurrencyUsdPrice ? getTokenPriceByNumber(usdToken, nativeWrappedToken, nativeCurrencyUsdPrice) : void 0;
  const priceInNative = priceInUsd && nativePriceInUsd ? nativePriceInUsd.multiply(priceInUsd.invert()) : void 0;
  const estimateGasCost = ({ pools }, { initializedTickCrossedList }) => {
    const isQuoteNative = nativeWrappedToken.equals(quoteCurrency.wrapped);
    const totalInitializedTicksCrossed = BigInt(Math.max(1, sum__default.default(initializedTickCrossedList)));
    const poolTypeSet = /* @__PURE__ */ new Set();
    let baseGasUse = BigInt(0);
    for (const pool of pools) {
      const { type } = pool;
      if (isV2Pool(pool) || isStablePool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse += BASE_SWAP_COST_V2;
          poolTypeSet.add(type);
          continue;
        }
        baseGasUse += COST_PER_EXTRA_HOP_V2;
        continue;
      }
      if (isV3Pool(pool)) {
        if (!poolTypeSet.has(type)) {
          baseGasUse += BASE_SWAP_COST_V3(chainId);
          poolTypeSet.add(type);
        }
        baseGasUse += COST_PER_HOP_V3(chainId);
        continue;
      }
    }
    const tickGasUse = COST_PER_INIT_TICK(chainId) * totalInitializedTicksCrossed;
    const uninitializedTickGasUse = COST_PER_UNINIT_TICK * BigInt(0);
    baseGasUse = baseGasUse + tickGasUse + uninitializedTickGasUse;
    const baseGasCostWei = gasPrice * baseGasUse;
    const totalGasCostNativeCurrency = sdk.CurrencyAmount.fromRawAmount(nativeWrappedToken, baseGasCostWei);
    let gasCostInToken = sdk.CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, 0);
    let gasCostInUSD = sdk.CurrencyAmount.fromRawAmount(usdToken, 0);
    try {
      if (isQuoteNative) {
        gasCostInToken = totalGasCostNativeCurrency;
      }
      if (!isQuoteNative) {
        const price = priceInNative || nativePool && getTokenPrice(nativePool, nativeWrappedToken, quoteCurrency.wrapped);
        if (price) {
          gasCostInToken = price.quote(totalGasCostNativeCurrency);
        }
      }
      const nativeTokenUsdPrice = nativePriceInUsd || usdPool && getTokenPrice(usdPool, nativeWrappedToken, usdToken);
      if (nativeTokenUsdPrice) {
        gasCostInUSD = nativeTokenUsdPrice.quote(totalGasCostNativeCurrency);
      }
    } catch (e) {
    }
    return {
      gasEstimate: baseGasUse,
      gasCostInToken,
      gasCostInUSD
    };
  };
  return {
    estimateGasCost
  };
}
async function getHighestLiquidityNativePool(poolProvider, currency, blockNumber) {
  const nativeWrappedToken = getNativeWrappedToken(currency.chainId);
  if (!nativeWrappedToken || currency.wrapped.equals(nativeWrappedToken)) {
    return null;
  }
  const pools = await poolProvider.getCandidatePools({
    blockNumber,
    pairs: [[nativeWrappedToken, currency]],
    currencyA: nativeWrappedToken,
    currencyB: currency
  });
  return pools[0] ?? null;
}
async function getHighestLiquidityUSDPool(poolProvider, chainId, blockNumber) {
  const usdToken = getUsdGasToken(chainId);
  const nativeWrappedToken = getNativeWrappedToken(chainId);
  if (!usdToken || !nativeWrappedToken) {
    return null;
  }
  const pools = await poolProvider.getCandidatePools({
    blockNumber,
    pairs: [[nativeWrappedToken, usdToken]],
    currencyA: nativeWrappedToken,
    currencyB: usdToken
  });
  return pools[0] ?? null;
}
async function getRoutesWithValidQuote({
  amount,
  baseRoutes,
  distributionPercent,
  quoteProvider: quoteProvider2,
  tradeType,
  blockNumber,
  gasModel,
  quoterOptimization = true,
  signal
}) {
  const [percents, amounts] = getAmountDistribution(amount, distributionPercent);
  const routesWithoutQuote = amounts.reduce(
    (acc, curAmount, i) => [
      ...acc,
      ...baseRoutes.map((r) => ({
        ...r,
        amount: curAmount,
        percent: percents[i]
      }))
    ],
    []
  );
  const getRoutesWithQuote = tradeType === sdk.TradeType.EXACT_INPUT ? quoteProvider2.getRouteWithQuotesExactIn : quoteProvider2.getRouteWithQuotesExactOut;
  if (!quoterOptimization) {
    return getRoutesWithQuote(routesWithoutQuote, { blockNumber, gasModel, signal });
  }
  const requestCallback = typeof window === "undefined" ? setTimeout : window.requestIdleCallback || window.setTimeout;
  logger.metric("Get quotes", "from", routesWithoutQuote.length, "routes", routesWithoutQuote);
  const getQuotes = (routes) => new Promise((resolve, reject) => {
    requestCallback(async () => {
      try {
        const result2 = await getRoutesWithQuote(routes, { blockNumber, gasModel, signal });
        resolve(result2);
      } catch (e) {
        reject(e);
      }
    });
  });
  const chunks = chunk__default.default(routesWithoutQuote, 10);
  const result = await Promise.all(chunks.map(getQuotes));
  const quotes = result.reduce((acc, cur) => [...acc, ...cur], []);
  logger.metric("Get quotes", "success, got", quotes.length, "quoted routes", quotes);
  return quotes;
}

// evm/v3-router/constants/poolSelector.ts
var DEFAULT_POOL_SELECTOR_CONFIG = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3
};
var V3_DEFAULT_POOL_SELECTOR_CONFIG = {
  [84532 /* BASE_SEPOLIA */]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4
  }
};
var V2_DEFAULT_POOL_SELECTOR_CONFIG = {
  [84532 /* BASE_SEPOLIA */]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3
  }
};
var V3_TOKEN_POOL_SELECTOR_CONFIG = {
  [84532 /* BASE_SEPOLIA */]: {
    [baseSepoliaTokens.usdt.address]: {
      topNTokenInOut: 4
    },
    [baseSepoliaTokens.weth.address]: {
      topNTokenInOut: 4
    }
  }
};
var V2_TOKEN_POOL_SELECTOR_CONFIG = {};

// evm/v3-router/constants/routeConfig.ts
var ROUTE_CONFIG_BY_CHAIN = {};

// evm/v3-router/getBestTrade.ts
async function getBestTrade(amount, currency, tradeType, config) {
  const amountBN = sdk.CurrencyAmount.fromRawAmount(amount.currency, BigInt(amount.quotient.toString()));
  const { blockNumber: blockNumberFromConfig } = config;
  const blockNumber = typeof blockNumberFromConfig === "function" ? await blockNumberFromConfig() : blockNumberFromConfig;
  const bestRoutes = await getBestRoutes(amountBN, currency, tradeType, {
    ...config,
    blockNumber
  });
  if (!bestRoutes || bestRoutes.outputAmount.equalTo(customPoolsSdk.ZERO)) {
    throw new Error("Cannot find a valid swap route");
  }
  const { routes, gasEstimateInUSD, gasEstimate, inputAmount, outputAmount } = bestRoutes;
  return {
    tradeType,
    routes,
    gasEstimate,
    gasEstimateInUSD,
    inputAmount,
    outputAmount,
    blockNumber
  };
}
async function getBestRoutes(amount, currency, tradeType, routeConfig) {
  const { chainId } = currency;
  const {
    maxHops = 3,
    maxSplits = 4,
    distributionPercent = 5,
    poolProvider,
    quoteProvider: quoteProvider2,
    blockNumber,
    gasPriceWei,
    allowedPoolTypes,
    quoterOptimization,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
    signal
  } = {
    ...routeConfig,
    ...ROUTE_CONFIG_BY_CHAIN[chainId] || {}
  };
  const isExactIn = tradeType === sdk.TradeType.EXACT_INPUT;
  const inputCurrency = isExactIn ? amount.currency : currency;
  const outputCurrency = isExactIn ? currency : amount.currency;
  const candidatePools = await poolProvider?.getCandidatePools({
    currencyA: amount.currency,
    currencyB: currency,
    blockNumber,
    protocols: allowedPoolTypes,
    signal
  });
  let baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools, maxHops);
  if (tradeType === sdk.TradeType.EXACT_OUTPUT) {
    baseRoutes = baseRoutes.filter(({ type }) => type !== 3 /* MIXED */);
  }
  const gasModel = await createGasModel({
    gasPriceWei,
    poolProvider,
    quoteCurrency: currency,
    blockNumber,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice
  });
  const routesWithValidQuote = await getRoutesWithValidQuote({
    amount,
    baseRoutes,
    distributionPercent,
    quoteProvider: quoteProvider2,
    tradeType,
    blockNumber,
    gasModel,
    quoterOptimization,
    signal
  });
  return getBestRouteCombinationByQuotes(amount, currency, routesWithValidQuote, tradeType, { maxSplits });
}

// evm/v3-router/providers/poolProviders/poolProviderWithCache.ts
function createPoolProviderWithCache(provider) {
  return provider;
}
function formatFraction(fraction, precision = 6) {
  if (!fraction || fraction.denominator === BigInt(0)) {
    return void 0;
  }
  if (fraction.greaterThan(BigInt(10) ** BigInt(precision))) {
    return fraction.toFixed(0);
  }
  return fraction.toSignificant(precision);
}
function formatPrice(price, precision) {
  if (!price) {
    return void 0;
  }
  return formatFraction(price?.asFraction.multiply(price?.scalar), precision);
}

// evm/utils/withFallback.ts
function withTimeout(fn, duration) {
  return function callWithTimeout(...args) {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Request timeout ${duration}ms`)), duration);
      })
    ]);
  };
}
function withFallback(calls) {
  return async function asyncCall(...args) {
    const numOfCalls = calls.length;
    if (numOfCalls === 0) {
      throw new Error("No valid calls");
    }
    for (const [index, { timeout = 2e3, asyncFn }] of calls.entries()) {
      const fn = index < numOfCalls - 1 ? withTimeout(asyncFn, timeout) : asyncFn;
      try {
        const result = await fn(...args);
        return result;
      } catch (e) {
        if (index === numOfCalls - 1) {
          throw e;
        }
        logger.error(`Call failed with error %O, try next fallback`, e);
      }
    }
    throw new Error("Unexpected end of call");
  };
}
function createAsyncCallWithFallbacks(defaultCall, options) {
  const { fallbacks = [], fallbackTimeout: timeout = 3e3 } = options || {};
  return withFallback(
    [defaultCall, ...fallbacks].map((asyncFn) => ({
      asyncFn,
      timeout
    }))
  );
}
var tokenPriceQuery = graphqlRequest.gql`
  query getTokens($pageSize: Int!, $tokenAddrs: [ID!]) {
    tokens(first: $pageSize, where: { id_in: $tokenAddrs }) {
      id
      derivedUSD: derivedOKB
    }
  }
`;
function createCommonTokenPriceProvider(getTokenPrices) {
  return async function getCommonTokenPrices2({ currencyA, currencyB, ...rest }) {
    const baseTokens = getCheckAgainstBaseTokens(currencyA, currencyB);
    if (!baseTokens) {
      return null;
    }
    const map = /* @__PURE__ */ new Map();
    const idToToken = {};
    const addresses = baseTokens.map((t) => {
      const address = viem.getAddress(t.address);
      idToToken[address] = t;
      return address;
    });
    const tokenPrices = await getTokenPrices({ addresses, chainId: currencyA?.chainId, ...rest });
    for (const { address, priceUSD } of tokenPrices) {
      const token = idToToken[viem.getAddress(address)];
      if (token) {
        map.set(token.wrapped.address, parseFloat(priceUSD) || 0);
      }
    }
    return map;
  };
}
var getTokenUsdPricesBySubgraph = async ({
  addresses,
  chainId,
  provider
}) => {
  const client = provider?.({ chainId });
  if (!client) {
    throw new Error("No valid subgraph data provider");
  }
  const { tokens: tokenPrices } = await client.request(
    tokenPriceQuery,
    {
      pageSize: 1e3,
      tokenAddrs: addresses.map((addr) => addr.toLocaleLowerCase())
    }
  );
  return tokenPrices.map(({ id, derivedUSD }) => ({
    address: id,
    priceUSD: derivedUSD
  }));
};
var getCommonTokenPricesBySubgraph = createCommonTokenPriceProvider(getTokenUsdPricesBySubgraph);
var createGetTokenPriceFromLlmaWithCache = ({
  endpoint
}) => {
  const cache = /* @__PURE__ */ new Map();
  return async ({ addresses, chainId }) => {
    if (!chainId || !getLlamaChainName(chainId)) {
      throw new Error(`Invalid chain id ${chainId}`);
    }
    const [cachedResults, addressesToFetch] = addresses.reduce(
      ([cachedAddrs, newAddrs], address) => {
        const cached = cache.get(address);
        if (!cached) {
          newAddrs.push(address);
        } else {
          cachedAddrs.push(cached);
        }
        return [cachedAddrs, newAddrs];
      },
      [[], []]
    );
    if (!addressesToFetch.length) {
      return cachedResults;
    }
    const list = addressesToFetch.map((address) => `${getLlamaChainName(chainId)}:${address.toLocaleLowerCase()}`).join(",");
    const result = await fetch(`${endpoint}/${list}`).then(
      (res) => res.json()
    );
    const { coins = {} } = result;
    return [
      ...cachedResults,
      ...Object.entries(coins).map(([key, value]) => {
        const [, address] = key.split(":");
        const tokenPrice = { address, priceUSD: value.price };
        cache.set(viem.getAddress(address), tokenPrice);
        return tokenPrice;
      })
    ];
  };
};
var getCommonTokenPricesByLlma = createCommonTokenPriceProvider(
  createGetTokenPriceFromLlmaWithCache({
    endpoint: "https://coins.llama.fi/prices/current"
  })
);
var getCommonTokenPricesByWalletApi = createCommonTokenPriceProvider(
  createGetTokenPriceFromLlmaWithCache({
    endpoint: "https://alpha.wallet-api.pancakeswap.com/v0/prices"
  })
);
var getCommonTokenPrices = withFallback([
  {
    asyncFn: ({ currencyA, currencyB, v3SubgraphProvider }) => getCommonTokenPricesBySubgraph({ currencyA, currencyB, provider: v3SubgraphProvider })
  }
]);

// evm/abis/AlgebraPoolABI.ts
var algebraPoolABI = [
  {
    "inputs": [],
    "name": "alreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "arithmeticError",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "bottomTickLowerThanMIN",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "dynamicFeeActive",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "dynamicFeeDisabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "flashInsufficientPaid0",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "flashInsufficientPaid1",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "insufficientInputAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "invalidAmountRequired",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
      }
    ],
    "name": "invalidHookResponse",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "invalidLimitSqrtPrice",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "invalidNewCommunityFee",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "invalidNewTickSpacing",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "liquidityAdd",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "liquidityOverflow",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "liquiditySub",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "locked",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "notAllowed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "notInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "onlyFarming",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "pluginIsNotConnected",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "priceOutOfRange",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tickInvalidLinks",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tickIsNotInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tickIsNotSpaced",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "tickOutOfRange",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "topTickAboveMAX",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "topTickLowerOrEqBottomTick",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "transferFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "zeroAmountRequired",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "zeroLiquidityActual",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "zeroLiquidityDesired",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "int24",
        "name": "bottomTick",
        "type": "int24"
      },
      {
        "indexed": true,
        "internalType": "int24",
        "name": "topTick",
        "type": "int24"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "liquidityAmount",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      }
    ],
    "name": "Burn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "int24",
        "name": "bottomTick",
        "type": "int24"
      },
      {
        "indexed": true,
        "internalType": "int24",
        "name": "topTick",
        "type": "int24"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "amount0",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "amount1",
        "type": "uint128"
      }
    ],
    "name": "Collect",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "communityFeeNew",
        "type": "uint16"
      }
    ],
    "name": "CommunityFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "fee",
        "type": "uint16"
      }
    ],
    "name": "Fee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "paid0",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "paid1",
        "type": "uint256"
      }
    ],
    "name": "Flash",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint160",
        "name": "price",
        "type": "uint160"
      },
      {
        "indexed": false,
        "internalType": "int24",
        "name": "tick",
        "type": "int24"
      }
    ],
    "name": "Initialize",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "int24",
        "name": "bottomTick",
        "type": "int24"
      },
      {
        "indexed": true,
        "internalType": "int24",
        "name": "topTick",
        "type": "int24"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "liquidityAmount",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      }
    ],
    "name": "Mint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "newPluginAddress",
        "type": "address"
      }
    ],
    "name": "Plugin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "newPluginConfig",
        "type": "uint8"
      }
    ],
    "name": "PluginConfig",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "amount0",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "amount1",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint160",
        "name": "price",
        "type": "uint160"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "liquidity",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "int24",
        "name": "tick",
        "type": "int24"
      }
    ],
    "name": "Swap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "int24",
        "name": "newTickSpacing",
        "type": "int24"
      }
    ],
    "name": "TickSpacing",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "int24",
        "name": "bottomTick",
        "type": "int24"
      },
      {
        "internalType": "int24",
        "name": "topTick",
        "type": "int24"
      },
      {
        "internalType": "uint128",
        "name": "amount",
        "type": "uint128"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "burn",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "int24",
        "name": "bottomTick",
        "type": "int24"
      },
      {
        "internalType": "int24",
        "name": "topTick",
        "type": "int24"
      },
      {
        "internalType": "uint128",
        "name": "amount0Requested",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "amount1Requested",
        "type": "uint128"
      }
    ],
    "name": "collect",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "amount0",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "amount1",
        "type": "uint128"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "communityFeeLastTimestamp",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "communityVault",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fee",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "currentFee",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "flash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCommunityFeePending",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "globalState",
    "outputs": [
      {
        "internalType": "uint160",
        "name": "price",
        "type": "uint160"
      },
      {
        "internalType": "int24",
        "name": "tick",
        "type": "int24"
      },
      {
        "internalType": "uint16",
        "name": "fee",
        "type": "uint16"
      },
      {
        "internalType": "uint8",
        "name": "pluginConfig",
        "type": "uint8"
      },
      {
        "internalType": "uint16",
        "name": "communityFee",
        "type": "uint16"
      },
      {
        "internalType": "bool",
        "name": "unlocked",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint160",
        "name": "initialPrice",
        "type": "uint160"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "liquidity",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxLiquidityPerTick",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "leftoversRecipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "int24",
        "name": "bottomTick",
        "type": "int24"
      },
      {
        "internalType": "int24",
        "name": "topTick",
        "type": "int24"
      },
      {
        "internalType": "uint128",
        "name": "liquidityDesired",
        "type": "uint128"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "liquidityActual",
        "type": "uint128"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextTickGlobal",
    "outputs": [
      {
        "internalType": "int24",
        "name": "",
        "type": "int24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "plugin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "positions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "innerFeeGrowth0Token",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "innerFeeGrowth1Token",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "fees0",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "fees1",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "prevTickGlobal",
    "outputs": [
      {
        "internalType": "int24",
        "name": "",
        "type": "int24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "newCommunityFee",
        "type": "uint16"
      }
    ],
    "name": "setCommunityFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "newFee",
        "type": "uint16"
      }
    ],
    "name": "setFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newPluginAddress",
        "type": "address"
      }
    ],
    "name": "setPlugin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "newConfig",
        "type": "uint8"
      }
    ],
    "name": "setPluginConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int24",
        "name": "newTickSpacing",
        "type": "int24"
      }
    ],
    "name": "setTickSpacing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "zeroToOne",
        "type": "bool"
      },
      {
        "internalType": "int256",
        "name": "amountRequired",
        "type": "int256"
      },
      {
        "internalType": "uint160",
        "name": "limitSqrtPrice",
        "type": "uint160"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "swap",
    "outputs": [
      {
        "internalType": "int256",
        "name": "amount0",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "amount1",
        "type": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "leftoversRecipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "zeroToOne",
        "type": "bool"
      },
      {
        "internalType": "int256",
        "name": "amountToSell",
        "type": "int256"
      },
      {
        "internalType": "uint160",
        "name": "limitSqrtPrice",
        "type": "uint160"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "swapWithPaymentInAdvance",
    "outputs": [
      {
        "internalType": "int256",
        "name": "amount0",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "amount1",
        "type": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tickSpacing",
    "outputs": [
      {
        "internalType": "int24",
        "name": "",
        "type": "int24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int16",
        "name": "",
        "type": "int16"
      }
    ],
    "name": "tickTable",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int24",
        "name": "",
        "type": "int24"
      }
    ],
    "name": "ticks",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "liquidityTotal",
        "type": "uint256"
      },
      {
        "internalType": "int128",
        "name": "liquidityDelta",
        "type": "int128"
      },
      {
        "internalType": "int24",
        "name": "prevTick",
        "type": "int24"
      },
      {
        "internalType": "int24",
        "name": "nextTick",
        "type": "int24"
      },
      {
        "internalType": "uint256",
        "name": "outerFeeGrowth0Token",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "outerFeeGrowth1Token",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token0",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalFeeGrowth0Token",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalFeeGrowth1Token",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// evm/abis/IPancakePair.ts
var pancakePairABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "Burn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0In",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1In",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "Swap",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112"
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112"
      }
    ],
    name: "Sync",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MINIMUM_LIQUIDITY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "burn",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "reserve0",
        type: "uint112"
      },
      {
        internalType: "uint112",
        name: "reserve1",
        type: "uint112"
      },
      {
        internalType: "uint32",
        name: "blockTimestampLast",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "kLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "price0CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "price1CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "skim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "stable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "sync",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// evm/v3-router/providers/poolProviders/onChainPoolProviders.ts
var getV2PoolsOnChain = createOnChainPoolFactory({
  abi: pancakePairABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => [
    {
      address: computeV2PoolAddress(
        currencyA.wrapped,
        currencyB.wrapped,
        false
      ),
      currencyA,
      currencyB
    },
    {
      address: computeV2PoolAddress(currencyA.wrapped, currencyB.wrapped, true),
      currencyA,
      currencyB
    }
  ],
  buildPoolInfoCalls: (address) => [
    {
      address,
      functionName: "getReserves",
      args: []
    },
    {
      address,
      functionName: "stable",
      args: []
    }
  ],
  buildPool: ({ currencyA, currencyB }, [reserves, isStable]) => {
    if (!reserves) {
      return null;
    }
    const [reserve0, reserve1] = reserves;
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped) ? [currencyA, currencyB] : [currencyB, currencyA];
    return {
      type: isStable ? 2 /* STABLE */ : 0 /* V2 */,
      reserve0: sdk.CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      reserve1: sdk.CurrencyAmount.fromRawAmount(token1, reserve1.toString())
    };
  }
});
var getV3PoolsWithoutTicksOnChain = createOnChainPoolFactory({
  abi: algebraPoolABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    const chainId = currencyA.chainId;
    return [CUSTOM_POOL_BASE[chainId], CUSTOM_POOL_DEPLOYER_ALL_INCLUSIVE[chainId]].map(
      (deployer) => ({
        address: deployer === CUSTOM_POOL_BASE[chainId] ? computeV3PoolAddress({
          poolDeployer: ALGEBRA_POOL_DEPLOYER[chainId],
          tokenA: currencyA.wrapped,
          tokenB: currencyB.wrapped,
          initCodeHashManualOverride: POOL_INIT_CODE_HASH[chainId]
        }) : computeV3CustomPoolAddress({
          mainPoolDeployer: ALGEBRA_POOL_DEPLOYER[chainId],
          customPoolDeployer: deployer,
          tokenA: currencyA.wrapped,
          tokenB: currencyB.wrapped,
          initCodeHashManualOverride: POOL_INIT_CODE_HASH[chainId]
        }),
        currencyA,
        currencyB,
        fee: 100,
        deployer
      })
    );
  },
  buildPoolInfoCalls: (address) => [
    {
      address,
      functionName: "liquidity"
    },
    {
      address,
      functionName: "globalState"
    }
  ],
  buildPool: ({ currencyA, currencyB, address, deployer }, [liquidity, globalState]) => {
    if (!globalState) {
      return null;
    }
    const [sqrtPriceX96, tick, fee] = globalState;
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped) ? [currencyA, currencyB] : [currencyB, currencyA];
    const [token0ProtocolFee, token1ProtocolFee] = v3Sdk.parseProtocolFees(0);
    return {
      type: 1 /* V3 */,
      token0,
      token1,
      fee,
      liquidity: BigInt(liquidity.toString()),
      sqrtRatioX96: BigInt(sqrtPriceX96.toString()),
      tick: Number(tick),
      address,
      token0ProtocolFee,
      token1ProtocolFee,
      deployer
    };
  }
});
function createOnChainPoolFactory({
  abi,
  getPossiblePoolMetas,
  buildPoolInfoCalls,
  buildPool
}) {
  return async function poolFactory(pairs, provider, blockNumber) {
    if (!provider) {
      throw new Error("No valid onchain data provider");
    }
    const chainId = pairs[0]?.[0]?.chainId;
    const client = provider({ chainId });
    if (!chainId || !client) {
      return [];
    }
    const poolAddressSet = /* @__PURE__ */ new Set();
    const poolMetas = [];
    for (const pair of pairs) {
      const possiblePoolMetas = getPossiblePoolMetas(pair);
      for (const meta of possiblePoolMetas) {
        if (!poolAddressSet.has(meta.address)) {
          poolMetas.push(meta);
          poolAddressSet.add(meta.address);
        }
      }
    }
    let calls = [];
    let poolCallSize = 0;
    for (const { address } of poolMetas) {
      const poolCalls = buildPoolInfoCalls(address);
      if (!poolCallSize) {
        poolCallSize = poolCalls.length;
      }
      if (!poolCallSize || poolCallSize !== poolCalls.length) {
        throw new Error("Inconsistent pool data call");
      }
      calls = [...calls, ...poolCalls];
    }
    if (!calls.length) {
      return [];
    }
    const results = await client.multicall({
      contracts: calls.map((call2) => ({
        abi,
        address: call2.address,
        functionName: call2.functionName,
        args: call2.args
      })),
      allowFailure: true,
      blockNumber: blockNumber ? BigInt(Number(BigInt(blockNumber))) : void 0
    });
    const pools = [];
    for (let i = 0; i < poolMetas.length; i += 1) {
      const poolResults = results.slice(
        i * poolCallSize,
        (i + 1) * poolCallSize
      );
      const pool = buildPool(
        poolMetas[i],
        poolResults.map((result) => result.result)
      );
      if (pool) {
        pools.push(pool);
      }
    }
    return pools;
  };
}

// evm/v3-router/utils/mergePoolSelectorConfig.ts
function mergePoolSelectorConfig(baseConfig, customConfig) {
  if (!customConfig) {
    return baseConfig;
  }
  const merged = { ...baseConfig };
  const keys = Object.keys(merged);
  for (const key of keys) {
    merged[key] = Math.max(merged[key], customConfig[key] || 0);
  }
  return merged;
}

// evm/v3-router/utils/getPoolSelectorConfig.ts
function poolSelectorConfigFactory(poolSelecorConfigMap, tokenPoolSelectorConfigMap) {
  return function getPoolSelectorConfig(currencyA, currencyB) {
    const chainId = currencyA?.chainId;
    if (!chainId || !poolSelecorConfigMap[chainId]) {
      return DEFAULT_POOL_SELECTOR_CONFIG;
    }
    const additionalConfigA = tokenPoolSelectorConfigMap[chainId]?.[currencyA?.wrapped?.address || "0x"];
    const additionalConfigB = tokenPoolSelectorConfigMap[chainId]?.[currencyB?.wrapped?.address || "0x"];
    return mergePoolSelectorConfig(
      mergePoolSelectorConfig(poolSelecorConfigMap[chainId], additionalConfigA),
      additionalConfigB
    );
  };
}
var getV3PoolSelectorConfig = poolSelectorConfigFactory(
  V3_DEFAULT_POOL_SELECTOR_CONFIG,
  V3_TOKEN_POOL_SELECTOR_CONFIG
);
var getV2PoolSelectorConfig = poolSelectorConfigFactory(
  V2_DEFAULT_POOL_SELECTOR_CONFIG,
  V2_TOKEN_POOL_SELECTOR_CONFIG
);

// evm/v3-router/providers/poolProviders/poolTvlSelectors.ts
var sortByTvl = (a, b) => a.tvlUSD >= b.tvlUSD ? -1 : 1;
function poolSelectorFactory({
  getPoolSelectorConfig,
  getToken0,
  getToken1,
  getPoolAddress: getPoolAddress2
}) {
  return function tvlSelector(currencyA, currencyB, unorderedPoolsWithTvl) {
    const POOL_SELECTION_CONFIG = getPoolSelectorConfig(currencyA, currencyB);
    if (!currencyA || !currencyB || !unorderedPoolsWithTvl.length) {
      return [];
    }
    const poolsFromSubgraph = unorderedPoolsWithTvl.sort(sortByTvl);
    const { chainId } = getToken0(poolsFromSubgraph[0]);
    const baseTokens = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];
    const poolSet = /* @__PURE__ */ new Set();
    const addToPoolSet = (pools2) => {
      for (const pool of pools2) {
        poolSet.add(getPoolAddress2(pool));
      }
    };
    const topByBaseWithTokenIn = baseTokens.map((token) => {
      return poolsFromSubgraph.filter((subgraphPool) => {
        return getToken0(subgraphPool).wrapped.equals(token) && getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(token) && getToken0(subgraphPool).wrapped.equals(currencyA.wrapped);
      }).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken);
    addToPoolSet(topByBaseWithTokenIn);
    const topByBaseWithTokenOut = baseTokens.map((token) => {
      return poolsFromSubgraph.filter((subgraphPool) => {
        if (poolSet.has(getPoolAddress2(subgraphPool))) {
          return false;
        }
        return getToken0(subgraphPool).wrapped.equals(token) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(token) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
      }).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken);
    }).reduce((acc, cur) => [...acc, ...cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken);
    addToPoolSet(topByBaseWithTokenOut);
    const top2DirectPools = poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress2(subgraphPool))) {
        return false;
      }
      return getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNDirectSwaps);
    addToPoolSet(top2DirectPools);
    const nativeToken = baseSepoliaTokens.weth;
    const top2EthBaseTokenPool = nativeToken ? poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress2(subgraphPool))) {
        return false;
      }
      return getToken0(subgraphPool).wrapped.equals(nativeToken) && getToken1(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(nativeToken) && getToken0(subgraphPool).wrapped.equals(currencyA.wrapped);
    }).slice(0, 1) : [];
    addToPoolSet(top2EthBaseTokenPool);
    const top2EthQuoteTokenPool = nativeToken ? poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress2(subgraphPool))) {
        return false;
      }
      return getToken0(subgraphPool).wrapped.equals(nativeToken) && getToken1(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(nativeToken) && getToken0(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, 1) : [];
    addToPoolSet(top2EthQuoteTokenPool);
    const topByTVL = poolsFromSubgraph.slice(0, POOL_SELECTION_CONFIG.topN).filter((pool) => !poolSet.has(getPoolAddress2(pool)));
    addToPoolSet(topByTVL);
    const topByTVLUsingTokenBase = poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress2(subgraphPool))) {
        return false;
      }
      return getToken0(subgraphPool).wrapped.equals(currencyA.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyA.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNTokenInOut);
    addToPoolSet(topByTVLUsingTokenBase);
    const topByTVLUsingTokenQuote = poolsFromSubgraph.filter((subgraphPool) => {
      if (poolSet.has(getPoolAddress2(subgraphPool))) {
        return false;
      }
      return getToken0(subgraphPool).wrapped.equals(currencyB.wrapped) || getToken1(subgraphPool).wrapped.equals(currencyB.wrapped);
    }).slice(0, POOL_SELECTION_CONFIG.topNTokenInOut);
    addToPoolSet(topByTVLUsingTokenQuote);
    const getTopByTVLUsingTokenSecondHops = (base, tokenToCompare) => base.map((subgraphPool) => {
      return getToken0(subgraphPool).wrapped.equals(tokenToCompare.wrapped) ? getToken1(subgraphPool) : getToken0(subgraphPool);
    }).map((secondHopToken) => {
      return poolsFromSubgraph.filter((subgraphPool) => {
        if (poolSet.has(getPoolAddress2(subgraphPool))) {
          return false;
        }
        return getToken0(subgraphPool).wrapped.equals(secondHopToken.wrapped) || getToken1(subgraphPool).wrapped.equals(secondHopToken.wrapped);
      });
    }).reduce((acc, cur) => [...acc, ...cur], []).reduce((acc, cur) => acc.some((p) => p === cur) ? acc : [...acc, cur], []).sort(sortByTvl).slice(0, POOL_SELECTION_CONFIG.topNSecondHop);
    const topByTVLUsingTokenInSecondHops = getTopByTVLUsingTokenSecondHops(
      [...topByTVLUsingTokenBase, ...topByBaseWithTokenIn],
      currencyA
    );
    addToPoolSet(topByTVLUsingTokenInSecondHops);
    const topByTVLUsingTokenOutSecondHops = getTopByTVLUsingTokenSecondHops(
      [...topByTVLUsingTokenQuote, ...topByBaseWithTokenOut],
      currencyB
    );
    addToPoolSet(topByTVLUsingTokenOutSecondHops);
    const pools = [
      ...topByBaseWithTokenIn,
      ...topByBaseWithTokenOut,
      ...top2DirectPools,
      ...top2EthBaseTokenPool,
      ...top2EthQuoteTokenPool,
      ...topByTVL,
      ...topByTVLUsingTokenBase,
      ...topByTVLUsingTokenQuote,
      ...topByTVLUsingTokenInSecondHops,
      ...topByTVLUsingTokenOutSecondHops
    ];
    return pools.map(({ tvlUSD, ...rest }) => rest);
  };
}
var v3PoolTvlSelector = poolSelectorFactory({
  getPoolSelectorConfig: getV3PoolSelectorConfig,
  getToken0: (p) => p.token0,
  getToken1: (p) => p.token1,
  getPoolAddress: (p) => p.address
});
var v2PoolTvlSelector = poolSelectorFactory({
  getPoolSelectorConfig: getV2PoolSelectorConfig,
  getToken0: (p) => p.reserve0.currency,
  getToken1: (p) => p.reserve1.currency,
  getPoolAddress: (p) => getPoolAddress(p) || "0x"
});
function subgraphPoolProviderFactory({
  id,
  getPoolMetas,
  getPoolsFromSubgraph
}) {
  return async function subgraphPoolProvider({
    provider,
    pairs
  }) {
    if (!provider) {
      throw new Error("No valid subgraph data provider");
    }
    const chainId = pairs[0]?.[0]?.chainId;
    if (!chainId) {
      return [];
    }
    const client = provider({ chainId });
    if (!client) {
      logger.error("No subgraph client found for chainId", chainId);
      return [];
    }
    metric(`SUBGRAPH_POOLS_START(${id})`, pairs);
    const metaMap = /* @__PURE__ */ new Map();
    for (const pair of pairs) {
      for (const deployer of [
        CUSTOM_POOL_BASE[chainId],
        CUSTOM_POOL_DEPLOYER_ALL_INCLUSIVE[chainId]
      ]) {
        const metas = getPoolMetas(pair, deployer[chainId]);
        for (const meta of metas) {
          metaMap.set(meta.address.toLocaleLowerCase(), meta);
        }
      }
    }
    const addresses = Array.from(metaMap.keys());
    const pools = await getPoolsFromSubgraph({
      addresses,
      getPoolMetaByAddress: (address) => metaMap.get(address.toLocaleLowerCase()) ?? null,
      client
    });
    metric(`SUBGRAPH_POOLS_END(${id})`, pools);
    return pools.filter((p) => !!p);
  };
}
var getV3PoolMeta = memoize__default.default(
  ([currencyA, currencyB, deployer, feeAmount]) => {
    const chainId = currencyA.chainId;
    return {
      address: deployer === CUSTOM_POOL_BASE[chainId] ? customPoolsSdk.computePoolAddress({
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
        poolDeployer: ALGEBRA_POOL_DEPLOYER[chainId],
        initCodeHashManualOverride: POOL_INIT_CODE_HASH[chainId]
      }) : customPoolsSdk.computeCustomPoolAddress({
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
        customPoolDeployer: deployer,
        mainPoolDeployer: ALGEBRA_POOL_DEPLOYER[chainId],
        initCodeHashManualOverride: POOL_INIT_CODE_HASH[chainId]
      }),
      currencyA,
      currencyB,
      fee: feeAmount,
      deployer
    };
  },
  ([currencyA, currencyB, deployer, feeAmount]) => {
    if (currencyA.wrapped.equals(currencyB.wrapped)) {
      return [
        currencyA.chainId,
        currencyA.wrapped.address,
        deployer,
        feeAmount
      ].join("_");
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped) ? [currencyA.wrapped, currencyB.wrapped] : [currencyB.wrapped, currencyA.wrapped];
    return [
      token0.chainId,
      token0.address,
      token1.address,
      deployer,
      feeAmount
    ].join("_");
  }
);
var getV3PoolMetas = memoize__default.default(
  (pair, deployer) => [
    getV3PoolMeta([...pair, deployer, 100])
  ],
  ([currencyA, currencyB], deployer) => {
    if (currencyA.wrapped.equals(currencyB.wrapped)) {
      return [currencyA.chainId, currencyA.wrapped.address].join("_");
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped) ? [currencyA.wrapped, currencyB.wrapped] : [currencyB.wrapped, currencyA.wrapped];
    return [token0.chainId, token0.address, token1.address, deployer].join("_");
  }
);
var queryV3Pools = graphqlRequest.gql`
  query getPools($pageSize: Int!, $poolAddrs: [String]) {
    pools(first: $pageSize, where: { id_in: $poolAddrs }) {
      id
      tick
      sqrtPrice
      fee
      liquidity
      totalValueLockedUSD
      deployer
    }
  }
`;
var getV3PoolSubgraph = subgraphPoolProviderFactory({
  id: "V3",
  getPoolMetas: getV3PoolMetas,
  getPoolsFromSubgraph: async ({ addresses, getPoolMetaByAddress, client }) => {
    const { pools: poolsFromSubgraph } = await client.request(queryV3Pools, {
      pageSize: 1e3,
      poolAddrs: addresses
    });
    return poolsFromSubgraph.map(
      ({
        id,
        liquidity,
        sqrtPrice,
        tick,
        totalValueLockedUSD,
        fee,
        deployer
      }) => {
        const meta = getPoolMetaByAddress(id);
        if (!meta) {
          return null;
        }
        const { currencyA, currencyB, address } = meta;
        const [token0, token1] = currencyA.wrapped.sortsBefore(
          currencyB.wrapped
        ) ? [currencyA, currencyB] : [currencyB, currencyA];
        const [token0ProtocolFee, token1ProtocolFee] = v3Sdk.parseProtocolFees(0);
        return {
          type: 1 /* V3 */,
          fee: Number(fee),
          token0,
          token1,
          liquidity: BigInt(liquidity),
          sqrtRatioX96: BigInt(sqrtPrice),
          tick: Number(tick),
          address,
          tvlUSD: BigInt(Number.parseInt(totalValueLockedUSD)),
          token0ProtocolFee,
          token1ProtocolFee,
          deployer
        };
      }
    );
  }
});
var queryV2Pools = graphqlRequest.gql`
  query getPools($pageSize: Int!, $poolAddrs: [ID!]) {
    v2Pools(first: $pageSize, where: { id_in: $poolAddrs }) {
      id
      reserve0: totalValueLockedToken0
      reserve1: totalValueLockedToken1
      reserveUSD: totalValueLockedUSD
    }
  }
`;
var getV2PoolSubgraph = subgraphPoolProviderFactory({
  id: "V2",
  getPoolMetas: ([currencyA, currencyB]) => [
    {
      currencyA,
      currencyB,
      address: computeV2PoolAddress(
        currencyA.wrapped,
        currencyB.wrapped,
        false
      )
    },
    {
      currencyA,
      currencyB,
      address: computeV2PoolAddress(currencyA.wrapped, currencyB.wrapped, true)
    }
  ],
  getPoolsFromSubgraph: async ({ addresses, getPoolMetaByAddress, client }) => {
    const { pairs: poolsFromSubgraph } = await client.request(queryV2Pools, {
      pageSize: 1e3,
      poolAddrs: addresses
    });
    return poolsFromSubgraph.map(({ id, reserveUSD, reserve0, reserve1 }) => {
      const meta = getPoolMetaByAddress(id);
      if (!meta) {
        return null;
      }
      const { currencyA, currencyB, address } = meta;
      const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped) ? [currencyA, currencyB] : [currencyB, currencyA];
      const reserve0Amount = tryParseAmount_default(reserve0, token0);
      const reserve1Amount = tryParseAmount_default(reserve1, token1);
      if (!reserve0Amount || !reserve1Amount) {
        return null;
      }
      return {
        address,
        type: 0 /* V2 */,
        reserve0: reserve0Amount,
        reserve1: reserve1Amount,
        tvlUSD: BigInt(Number.parseInt(reserveUSD))
      };
    });
  }
});
function subgraphAllPoolsQueryFactory({
  getPoolsFromSubgraph,
  getPoolId
}) {
  return async function getAllPools({
    provider,
    chainId,
    pageSize = 1e3
  }) {
    if (!provider || !chainId) {
      throw new Error("No valid subgraph data provider");
    }
    const client = provider({ chainId });
    if (!client) {
      throw new Error(`No subgraph client found for chainId ${chainId}`);
    }
    let hasMorePools = true;
    let lastId = "";
    let pools = [];
    while (hasMorePools) {
      const poolsAtCurrentPage = await getPoolsFromSubgraph({
        client,
        lastId,
        pageSize,
        chainId
      });
      if (poolsAtCurrentPage.length < pageSize) {
        hasMorePools = false;
        pools = [...pools, ...poolsAtCurrentPage];
        break;
      }
      lastId = getPoolId(poolsAtCurrentPage[poolsAtCurrentPage.length - 1]);
      pools = [...pools, ...poolsAtCurrentPage];
    }
    return pools;
  };
}
var queryAllV3Pools = graphqlRequest.gql`
  query getPools($pageSize: Int!, $id: String) {
    pools(first: $pageSize, where: { id_gt: $id }) {
      id
      tick
      token0 {
        symbol
        id
        decimals
      }
      token1 {
        symbol
        id
        decimals
      }
      sqrtPrice
      fee
      liquidity
      totalValueLockedUSD
      deployer
    }
  }
`;
var getAllV3PoolsFromSubgraph = subgraphAllPoolsQueryFactory({
  id: "getAllV3PoolsFromSubgraph",
  getPoolsFromSubgraph: async ({ lastId, pageSize, client, chainId }) => {
    const { pools: poolsFromSubgraph } = await client.request(queryAllV3Pools, {
      pageSize,
      id: lastId
    });
    return poolsFromSubgraph.map(
      ({
        id,
        liquidity,
        sqrtPrice,
        tick,
        totalValueLockedUSD,
        token0,
        token1,
        fee,
        deployer
      }) => {
        const [token0ProtocolFee, token1ProtocolFee] = v3Sdk.parseProtocolFees(0);
        return {
          type: 1 /* V3 */,
          fee: Number(fee),
          token0: new sdk.Token(
            chainId,
            viem.getAddress(token0.id),
            Number(token0.decimals),
            token0.symbol
          ),
          token1: new sdk.Token(
            chainId,
            viem.getAddress(token1.id),
            Number(token1.decimals),
            token1.symbol
          ),
          liquidity: BigInt(liquidity),
          sqrtRatioX96: BigInt(sqrtPrice),
          tick: Number(tick),
          address: viem.getAddress(id),
          tvlUSD: BigInt(Number.parseInt(totalValueLockedUSD)),
          token0ProtocolFee,
          token1ProtocolFee,
          deployer
        };
      }
    );
  },
  getPoolId: (p) => p.address
});

// evm/v3-router/providers/poolProviders/getV2CandidatePools.ts
function createV2PoolsProviderByCommonTokenPrices(getCommonTokenPrices2) {
  return async function getV2Pools({
    currencyA,
    currencyB,
    pairs: providedPairs,
    onChainProvider,
    blockNumber,
    ...rest
  }) {
    if (currencyA instanceof customPoolsSdk.Token && currencyB instanceof customPoolsSdk.Token && currencyA.symbol && currencyB.symbol) {
      currencyA = new sdk.Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name);
      currencyB = new sdk.Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name);
    }
    const pairs = providedPairs || getPairCombinations(currencyA, currencyB);
    const [poolsFromOnChain, baseTokenUsdPrices] = await Promise.all([
      getV2PoolsOnChain(pairs, onChainProvider, blockNumber),
      getCommonTokenPrices2({ currencyA, currencyB, ...rest })
    ]);
    if (!poolsFromOnChain) {
      throw new Error("Failed to get v2 candidate pools");
    }
    if (!baseTokenUsdPrices) {
      logger.log("Failed to get base token prices");
      return poolsFromOnChain.map((pool) => {
        return {
          ...pool,
          tvlUSD: BigInt(0),
          address: getPoolAddress(pool)
        };
      });
    }
    return poolsFromOnChain.map((pool) => {
      const getAmountUsd = (amount) => {
        if (amount.equalTo(sdk.ZERO)) {
          return 0;
        }
        const price = baseTokenUsdPrices.get(amount.currency.wrapped.address);
        if (price !== void 0) {
          return parseFloat(amount.toExact()) * price;
        }
        const againstAmount = pool.reserve0.currency.equals(amount.currency) ? pool.reserve1 : pool.reserve0;
        const againstUsdPrice = baseTokenUsdPrices.get(againstAmount.currency.wrapped.address);
        if (againstUsdPrice) {
          const poolPrice = new sdk.Price({ baseAmount: amount, quoteAmount: againstAmount });
          return parseFloat(amount.toExact()) * parseFloat(formatPrice(poolPrice, 6) || "0");
        }
        return 0;
      };
      return {
        ...pool,
        tvlUSD: BigInt(Math.floor(getAmountUsd(pool.reserve0) + getAmountUsd(pool.reserve1))),
        address: getPoolAddress(pool)
      };
    });
  };
}
var getV2PoolsWithTvlByCommonTokenPrices = createV2PoolsProviderByCommonTokenPrices(getCommonTokenPrices);
function createGetV2CandidatePools(defaultGetV2Pools, options) {
  const getV2PoolsWithFallbacks = createAsyncCallWithFallbacks(defaultGetV2Pools, options);
  return async function getV2Pools(params) {
    let { currencyA, currencyB } = params;
    if (currencyA instanceof customPoolsSdk.Token && currencyB instanceof customPoolsSdk.Token && currencyA.symbol && currencyB.symbol) {
      currencyA = new sdk.Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name);
      currencyB = new sdk.Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name);
    }
    const pools = await getV2PoolsWithFallbacks(params);
    return v2PoolTvlSelector(currencyA, currencyB, pools);
  };
}
async function getV2CandidatePools(params) {
  const fallbacks = [
    ({ pairs: providedPairs, currencyA, currencyB, v2SubgraphProvider }) => {
      const pairs = providedPairs || getPairCombinations(currencyA, currencyB);
      return getV2PoolSubgraph({ provider: v2SubgraphProvider, pairs });
    }
  ];
  const getV2PoolsWithFallbacks = createGetV2CandidatePools(getV2PoolsWithTvlByCommonTokenPrices, {
    fallbacks,
    fallbackTimeout: 3e3
  });
  return getV2PoolsWithFallbacks(params);
}
var getV3PoolTvl = memoize__default.default(
  (pools, poolAddress) => {
    const poolWithTvl = pools.find((p) => p.address === poolAddress);
    return poolWithTvl?.tvlUSD || BigInt(0);
  },
  (_, poolAddress) => poolAddress
);
var v3PoolsOnChainProviderFactory = (tvlReferenceProvider) => {
  return async function getV3PoolsWithTvlFromOnChain2(params) {
    let { currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber } = params;
    if (currencyA instanceof customPoolsSdk.Token && currencyB instanceof customPoolsSdk.Token && currencyA.symbol && currencyB.symbol) {
      currencyA = new sdk.Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name);
      currencyB = new sdk.Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name);
    }
    const pairs = providedPairs || getPairCombinations(currencyA, currencyB);
    const [fromOnChain, tvlReference] = await Promise.allSettled([
      getV3PoolsWithoutTicksOnChain(pairs, onChainProvider, blockNumber),
      tvlReferenceProvider(params)
    ]);
    if (fromOnChain.status === "fulfilled" && tvlReference.status === "fulfilled") {
      const { value: poolsFromOnChain } = fromOnChain;
      const { value: poolTvlReferences } = tvlReference;
      if (!Array.isArray(poolTvlReferences)) {
        throw new Error("Failed to get tvl references");
      }
      return poolsFromOnChain.map((pool) => {
        const tvlUSD = BigInt(getV3PoolTvl(poolTvlReferences, pool.address));
        return {
          ...pool,
          tvlUSD
        };
      });
    }
    throw new Error(`Getting v3 pools failed. Onchain ${fromOnChain.status}, tvl references ${tvlReference.status}`);
  };
};
var getV3PoolsWithTvlFromOnChain = v3PoolsOnChainProviderFactory((params) => {
  let { currencyA, currencyB, pairs: providedPairs, subgraphProvider } = params;
  if (currencyA instanceof customPoolsSdk.Token && currencyB instanceof customPoolsSdk.Token && currencyA.symbol && currencyB.symbol) {
    currencyA = new sdk.Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name);
    currencyB = new sdk.Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name);
  }
  const pairs = providedPairs || getPairCombinations(currencyA, currencyB);
  return getV3PoolSubgraph({ provider: subgraphProvider, pairs });
});
var createFallbackTvlRefGetter = () => {
  const cache = /* @__PURE__ */ new Map();
  return async (params) => {
    const { currencyA } = params;
    if (!currencyA?.chainId) {
      throw new Error(`Cannot get tvl references at chain ${currencyA?.chainId}`);
    }
    const cached = cache.get(currencyA.chainId);
    if (cached) {
      return cached;
    }
    throw "E";
  };
};
var getV3PoolsWithTvlFromOnChainFallback = v3PoolsOnChainProviderFactory(createFallbackTvlRefGetter());
var getV3PoolsWithTvlFromOnChainStaticFallback = v3PoolsOnChainProviderFactory(() => Promise.resolve([]));
function createGetV3CandidatePools(defaultGetV3Pools, options) {
  const getV3PoolsWithFallbacks = createAsyncCallWithFallbacks(defaultGetV3Pools, options);
  return async function getV3Pools(params) {
    let { currencyA, currencyB } = params;
    if (currencyA instanceof customPoolsSdk.Token && currencyB instanceof customPoolsSdk.Token && currencyA.symbol && currencyB.symbol) {
      currencyA = new sdk.Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name);
      currencyB = new sdk.Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name);
    }
    const pools = await getV3PoolsWithFallbacks(params);
    return v3PoolTvlSelector(currencyA, currencyB, pools);
  };
}
async function getV3CandidatePools(params) {
  const { subgraphFallback = true, staticFallback = true, fallbackTimeout, ...rest } = params;
  const fallbacks = [];
  if (staticFallback) {
    fallbacks.push(getV3PoolsWithTvlFromOnChainStaticFallback);
  }
  const getV3PoolsWithFallback = createGetV3CandidatePools(getV3PoolsWithTvlFromOnChainStaticFallback, {
    fallbacks,
    fallbackTimeout
  });
  return getV3PoolsWithFallback(rest);
}

// evm/v3-router/providers/poolProviders/getCandidatePools.ts
async function getCandidatePools({
  protocols = [1 /* V3 */, 0 /* V2 */, 2 /* STABLE */],
  v2SubgraphProvider,
  v3SubgraphProvider,
  ...rest
}) {
  const { currencyA } = rest;
  const chainId = currencyA?.chainId;
  if (!chainId) {
    return [];
  }
  const poolSets = await Promise.all(
    protocols.map((protocol) => {
      if (protocol === 0 /* V2 */ || protocol === 2 /* STABLE */) {
        return getV2CandidatePools({
          ...rest,
          v2SubgraphProvider,
          v3SubgraphProvider
        });
      }
      return getV3CandidatePools({
        ...rest,
        subgraphProvider: v3SubgraphProvider
      });
    })
  );
  return poolSets.reduce((acc, cur) => [...acc, ...cur], []);
}

// evm/v3-router/providers/poolProviders/hybridPoolProvider.ts
function createHybridPoolProvider({
  onChainProvider,
  v2SubgraphProvider,
  v3SubgraphProvider
}) {
  const hybridPoolProvider = {
    getCandidatePools: async (params) => {
      return getCandidatePools({ ...params, onChainProvider, v2SubgraphProvider, v3SubgraphProvider });
    }
  };
  return createPoolProviderWithCache(hybridPoolProvider);
}

// evm/v3-router/providers/poolProviders/staticPoolProvider.ts
function createStaticPoolProvider(pools) {
  const defaultAllowedProtocols = [0 /* V2 */, 2 /* STABLE */, 1 /* V3 */];
  return {
    getCandidatePools: async ({ protocols = defaultAllowedProtocols, pairs }) => {
      if (!pools) {
        return [];
      }
      if (!pairs) {
        return pools.filter((pool) => protocols.includes(pool.type));
      }
      const relatedPools = [];
      for (const [currencyA, currencyB] of pairs) {
        for (const pool of pools) {
          if (involvesCurrency(pool, currencyA) && involvesCurrency(pool, currencyB) && protocols.includes(pool.type)) {
            relatedPools.push(pool);
          }
        }
      }
      return relatedPools;
    }
  };
}

// evm/v3-router/providers/poolProviders/index.ts
function createPoolProvider(config) {
  const hybridPoolProvider = createHybridPoolProvider(config);
  return hybridPoolProvider;
}
function createOffChainQuoteProvider() {
  const createGetRoutesWithQuotes = (isExactIn = true) => {
    const getV2Quote = createGetV2Quote(isExactIn);
    const getV3Quote = createGetV3Quote(isExactIn);
    function* each(pools) {
      let i = isExactIn ? 0 : pools.length - 1;
      const hasNext = () => isExactIn ? i < pools.length : i >= 0;
      while (hasNext()) {
        yield [pools[i], i];
        if (isExactIn) {
          i += 1;
        } else {
          i -= 1;
        }
      }
    }
    const adjustQuoteForGas = (quote, gasCostInToken) => {
      if (isExactIn) {
        return quote.subtract(gasCostInToken);
      }
      return quote.add(gasCostInToken);
    };
    return async function getRoutesWithQuotes(routes, { gasModel }) {
      const routesWithQuote = [];
      for (const route of routes) {
        try {
          const { pools, amount } = route;
          let quote = amount;
          const initializedTickCrossedList = Array(pools.length).fill(0);
          let quoteSuccess = true;
          for (const [pool, i] of each(pools)) {
            if (isV2Pool(pool) || isStablePool(pool)) {
              quote = getV2Quote(pool, quote, isStablePool(pool));
              continue;
            }
            if (isV3Pool(pool)) {
              const v3QuoteResult = await getV3Quote(pool, quote);
              if (!v3QuoteResult || v3QuoteResult.quote.quotient === sdk.ZERO) {
                quoteSuccess = false;
                break;
              }
              const { quote: v3Quote, numOfTicksCrossed } = v3QuoteResult;
              quote = v3Quote;
              initializedTickCrossedList[i] = numOfTicksCrossed;
            }
          }
          if (!quoteSuccess) {
            continue;
          }
          const { gasEstimate, gasCostInUSD, gasCostInToken } = gasModel.estimateGasCost(
            {
              ...route,
              quote
            },
            { initializedTickCrossedList }
          );
          routesWithQuote.push({
            ...route,
            quote,
            quoteAdjustedForGas: adjustQuoteForGas(quote, gasCostInToken),
            gasEstimate,
            gasCostInUSD,
            gasCostInToken
          });
        } catch (e) {
        }
      }
      return routesWithQuote;
    };
  };
  return {
    getRouteWithQuotesExactIn: createGetRoutesWithQuotes(true),
    getRouteWithQuotesExactOut: createGetRoutesWithQuotes(false)
  };
}
function createGetV2Quote(isExactIn = true) {
  return function getV2Quote({ reserve0, reserve1 }, amount, isStable) {
    const [currencyA, currencyB] = reserve0.wrapped.currency.sortsBefore(reserve1.wrapped.currency) ? [reserve0.wrapped.currency, reserve1.wrapped.currency] : [reserve1.wrapped.currency, reserve0.wrapped.currency];
    sdk.Pair.getAddress = computePairAddress.bind(sdk.Pair, currencyA, currencyB, isStable);
    const pair = new sdk.Pair(reserve0.wrapped, reserve1.wrapped);
    const [quote] = isExactIn ? pair.getOutputAmount(amount.wrapped) : pair.getInputAmount(amount.wrapped);
    return quote;
  };
}
function createGetV3Quote(isExactIn = true) {
  return async function getV3Quote(pool, amount) {
    const { token0, token1, fee, sqrtRatioX96, liquidity, ticks, tick } = pool;
    if (!ticks?.length) {
      return null;
    }
    try {
      const v3Pool = new v3Sdk.Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick, ticks);
      const [quote, poolAfter] = isExactIn ? await v3Pool.getOutputAmount(amount.wrapped) : await v3Pool.getInputAmount(amount.wrapped);
      if (quote.quotient <= BigInt(0)) {
        return null;
      }
      const { tickCurrent: tickAfter } = poolAfter;
      const numOfTicksCrossed = v3Sdk.TickList.countInitializedTicksCrossed(ticks, tick, tickAfter);
      return {
        quote,
        numOfTicksCrossed
      };
    } catch (e) {
      return null;
    }
  };
}

// evm/utils/abortControl.ts
var AbortError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AbortError";
  }
};
function abortInvariant(signal, message) {
  if (signal?.aborted) {
    throw new AbortError(message || "Signal aborted");
  }
}
function isAbortError(error) {
  return error instanceof Error && error.name === "AbortError";
}

// evm/abis/algebra/IQuoterV2.ts
var algebraQuoterV2ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_WNativeToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_poolDeployer",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "WNativeToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "amount0Delta",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "amount1Delta",
        "type": "int256"
      },
      {
        "internalType": "bytes",
        "name": "path",
        "type": "bytes"
      }
    ],
    "name": "algebraSwapCallback",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolDeployer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "path",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "amountInRequired",
        "type": "uint256"
      }
    ],
    "name": "quoteExactInput",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amountOutList",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amountInList",
        "type": "uint256[]"
      },
      {
        "internalType": "uint160[]",
        "name": "sqrtPriceX96AfterList",
        "type": "uint160[]"
      },
      {
        "internalType": "uint32[]",
        "name": "initializedTicksCrossedList",
        "type": "uint32[]"
      },
      {
        "internalType": "uint256",
        "name": "gasEstimate",
        "type": "uint256"
      },
      {
        "internalType": "uint16[]",
        "name": "feeList",
        "type": "uint16[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "deployer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint160",
            "name": "limitSqrtPrice",
            "type": "uint160"
          }
        ],
        "internalType": "struct IQuoterV2.QuoteExactInputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "quoteExactInputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint160",
        "name": "sqrtPriceX96After",
        "type": "uint160"
      },
      {
        "internalType": "uint32",
        "name": "initializedTicksCrossed",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "gasEstimate",
        "type": "uint256"
      },
      {
        "internalType": "uint16",
        "name": "fee",
        "type": "uint16"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "path",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "amountOutRequired",
        "type": "uint256"
      }
    ],
    "name": "quoteExactOutput",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amountOutList",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amountInList",
        "type": "uint256[]"
      },
      {
        "internalType": "uint160[]",
        "name": "sqrtPriceX96AfterList",
        "type": "uint160[]"
      },
      {
        "internalType": "uint32[]",
        "name": "initializedTicksCrossedList",
        "type": "uint32[]"
      },
      {
        "internalType": "uint256",
        "name": "gasEstimate",
        "type": "uint256"
      },
      {
        "internalType": "uint16[]",
        "name": "feeList",
        "type": "uint16[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "deployer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint160",
            "name": "limitSqrtPrice",
            "type": "uint160"
          }
        ],
        "internalType": "struct IQuoterV2.QuoteExactOutputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "quoteExactOutputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint160",
        "name": "sqrtPriceX96After",
        "type": "uint160"
      },
      {
        "internalType": "uint32",
        "name": "initializedTicksCrossed",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "gasEstimate",
        "type": "uint256"
      },
      {
        "internalType": "uint16",
        "name": "fee",
        "type": "uint16"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// evm/multicall/src/constants/contracts.ts
var MULTICALL_ADDRESS = {
  [84532 /* BASE_SEPOLIA */]: "0xf08e7861984cb4d2ba8b69e3c4ae20443dfa3c31",
  [943 /* PULSECHAIN_TESTNET */]: "0x3aA5461Db8c839973CDfb374778846B0454C0837"
};

// evm/multicall/src/constants/blockConflictTolerance.ts
var DEFAULT_BLOCK_CONFLICT_TOLERANCE = 0;
var BLOCK_CONFLICT_TOLERANCE = {
  [84532 /* BASE_SEPOLIA */]: 3
};

// evm/multicall/src/constants/gasLimit.ts
var DEFAULT_GAS_LIMIT = BigInt(15e7);
var DEFAULT_GAS_LIMIT_BY_CHAIN = {
  [84532 /* BASE_SEPOLIA */]: DEFAULT_GAS_LIMIT
};
var DEFAULT_GAS_BUFFER = BigInt(3e6);
var DEFAULT_GAS_BUFFER_BY_CHAIN = {
  [84532 /* BASE_SEPOLIA */]: DEFAULT_GAS_BUFFER
};

// evm/multicall/src/abis/IMulticall.ts
var iMulticallABI = [
  {
    inputs: [],
    name: "gasLeft",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "gaslimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "uint256", name: "gasLimit", type: "uint256" },
          { internalType: "bytes", name: "callData", type: "bytes" }
        ],
        internalType: "struct MultiCallV2.Call[]",
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "multicall",
    outputs: [
      { internalType: "uint256", name: "blockNumber", type: "uint256" },
      {
        components: [
          { internalType: "bool", name: "success", type: "bool" },
          { internalType: "uint256", name: "gasUsed", type: "uint256" },
          { internalType: "bytes", name: "returnData", type: "bytes" }
        ],
        internalType: "struct MultiCallV2.Result[]",
        name: "returnData",
        type: "tuple[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "uint256", name: "gasLimit", type: "uint256" },
          { internalType: "bytes", name: "callData", type: "bytes" }
        ],
        internalType: "struct MultiCallV2.Call[]",
        name: "calls",
        type: "tuple[]"
      },
      { internalType: "uint256", name: "gasBuffer", type: "uint256" }
    ],
    name: "multicallWithGasLimitation",
    outputs: [
      { internalType: "uint256", name: "blockNumber", type: "uint256" },
      {
        components: [
          { internalType: "bool", name: "success", type: "bool" },
          { internalType: "uint256", name: "gasUsed", type: "uint256" },
          { internalType: "bytes", name: "returnData", type: "bytes" }
        ],
        internalType: "struct MultiCallV2.Result[]",
        name: "returnData",
        type: "tuple[]"
      },
      { internalType: "uint256", name: "lastSuccessIndex", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// evm/multicall/src/getMulticallContract.ts
function getMulticallContract({ chainId, client }) {
  const address = MULTICALL_ADDRESS[chainId];
  if (!address) {
    throw new Error(`PancakeMulticall not supported on chain ${chainId}`);
  }
  return viem.getContract({ abi: iMulticallABI, address, publicClient: client });
}

// evm/multicall/src/getGasLimit.ts
function toBigInt(num) {
  return typeof num === "bigint" ? num : BigInt(num.toString());
}
function getDefaultGasLimit(chainId) {
  const gasLimitOnChain = chainId && DEFAULT_GAS_LIMIT_BY_CHAIN[chainId];
  return gasLimitOnChain !== void 0 ? gasLimitOnChain : DEFAULT_GAS_LIMIT;
}
function getDefaultGasBuffer(chainId) {
  const gasBufferOnChain = chainId && DEFAULT_GAS_BUFFER_BY_CHAIN[chainId];
  return gasBufferOnChain !== void 0 ? gasBufferOnChain : DEFAULT_GAS_BUFFER;
}
async function getGasLimitOnChain({ chainId, client }) {
  const multicall = getMulticallContract({ chainId, client });
  const gasLeft = await multicall.read.gasLeft();
  return gasLeft;
}
async function getGasLimit({
  chainId,
  gasLimit: gasLimitInput,
  maxGasLimit: maxGasLimitInput = getDefaultGasLimit(chainId),
  gasBuffer: gasBufferInput = getDefaultGasBuffer(chainId),
  client
}) {
  const gasLimitOverride = gasLimitInput && toBigInt(gasLimitInput);
  const maxGasLimit = toBigInt(maxGasLimitInput);
  const gasBuffer = toBigInt(gasBufferInput);
  const gasLimit = gasLimitOverride || await getGasLimitOnChain({ chainId, client }) || maxGasLimit;
  const minGasLimit = gasLimit < maxGasLimit ? gasLimit : maxGasLimit;
  return minGasLimit - gasBuffer;
}
function isViemAbortError(e) {
  return e instanceof viem.BaseError && e.walk((err) => err instanceof viem.TimeoutError) instanceof viem.TimeoutError;
}

// evm/multicall/src/getBlockConflictTolerance.ts
function getBlockConflictTolerance(chainId) {
  return BLOCK_CONFLICT_TOLERANCE[chainId] || DEFAULT_BLOCK_CONFLICT_TOLERANCE;
}

// evm/multicall/src/multicall.ts
async function multicallByGasLimit(calls, {
  chainId,
  gasBuffer = getDefaultGasBuffer(chainId),
  client,
  dropUnexecutedCalls,
  signal,
  retryFailedCallsWithGreaterLimit,
  ...rest
}) {
  const gasLimit = await getGasLimit({
    chainId,
    gasBuffer,
    client,
    ...rest
  });
  const callResult = await callByChunks(splitCallsIntoChunks(calls, gasLimit), {
    gasBuffer,
    client,
    chainId,
    dropUnexecutedCalls,
    signal
  });
  if (!retryFailedCallsWithGreaterLimit) {
    return callResult;
  }
  const { gasLimitMultiplier: retryGasLimitMultiplier } = retryFailedCallsWithGreaterLimit;
  async function retryFailedCalls(result) {
    if (result.results.every((r) => r.success)) {
      return result;
    }
    let callsToRetry = [];
    const failedCallIndexes = [];
    for (const [index, { success }] of result.results.entries()) {
      if (!success) {
        failedCallIndexes.push(index);
        callsToRetry.push(calls[index]);
      }
    }
    if (callsToRetry.some((c) => BigInt(c.gasLimit) > gasLimit)) {
      console.warn(
        "Failed to retry with greater limit. The gas limit of some of the calls exceeds the maximum gas limit set by chain"
      );
      return result;
    }
    callsToRetry = callsToRetry.map((c) => ({ ...c, gasLimit: BigInt(c.gasLimit) * BigInt(retryGasLimitMultiplier) }));
    const retryResult = await callByChunks(splitCallsIntoChunks(callsToRetry, gasLimit), {
      gasBuffer,
      client,
      chainId,
      dropUnexecutedCalls,
      signal
    });
    const resultsAfterRetry = [...result.results];
    for (const [retryIndex, originalIndex] of failedCallIndexes.entries()) {
      resultsAfterRetry[originalIndex] = retryResult.results[retryIndex];
    }
    return retryFailedCalls({
      results: resultsAfterRetry,
      blockNumber: retryResult.blockNumber
    });
  }
  return retryFailedCalls(callResult);
}
function formatCallReturn([blockNumber, results, successIndex]) {
  const lastSuccessIndex = Number(successIndex);
  return {
    lastSuccessIndex,
    blockNumber,
    results: results.slice(0, lastSuccessIndex + 1).map(({ gasUsed, success, returnData }) => ({
      gasUsed,
      success,
      result: returnData
    }))
  };
}
async function call(calls, params) {
  const {
    chainId,
    client,
    gasBuffer = getDefaultGasBuffer(chainId),
    blockConflictTolerance = getBlockConflictTolerance(chainId),
    dropUnexecutedCalls = false,
    signal
  } = params;
  if (!calls.length) {
    return {
      results: [],
      blockNumber: 0n
    };
  }
  abortInvariant(signal, "Multicall aborted");
  const contract = getMulticallContract({ chainId, client });
  try {
    const { result } = await contract.simulate.multicallWithGasLimitation([calls, gasBuffer]);
    const { results, lastSuccessIndex, blockNumber } = formatCallReturn(result);
    if (lastSuccessIndex === calls.length - 1) {
      return {
        results,
        blockNumber
      };
    }
    console.warn(
      `Gas limit reached. Total num of ${calls.length} calls. First ${lastSuccessIndex + 1} calls executed. The remaining ${calls.length - lastSuccessIndex - 1} calls are not executed. Pls try adjust the gas limit per call.`
    );
    const remainingCalls = calls.slice(lastSuccessIndex + 1);
    if (dropUnexecutedCalls) {
      return {
        results: [...results, ...remainingCalls.map(() => ({ result: "0x", gasUsed: 0n, success: false }))],
        blockNumber
      };
    }
    const { results: remainingResults, blockNumber: nextBlockNumber } = await call(
      calls.slice(lastSuccessIndex + 1),
      params
    );
    if (Number(nextBlockNumber - blockNumber) > blockConflictTolerance) {
      throw new Error(
        `Multicall failed because of block conflict. Latest calls are made at block ${nextBlockNumber} while last calls made at block ${blockNumber}. Block conflict tolerance is ${blockConflictTolerance}`
      );
    }
    return {
      results: [...results, ...remainingResults],
      // Use the latest block number
      blockNumber: nextBlockNumber
    };
  } catch (e) {
    if (isViemAbortError(e)) {
      throw new AbortError(e.message);
    }
    throw e;
  }
}
async function callByChunks(chunks, params) {
  try {
    const { blockConflictTolerance = getBlockConflictTolerance(params.chainId) } = params;
    const callReturns = await Promise.all(chunks.map((chunk2) => call(chunk2, params)));
    let minBlock = 0n;
    let maxBlock = 0n;
    let results = [];
    for (const { results: callResults, blockNumber } of callReturns) {
      if (minBlock === 0n || blockNumber < minBlock) {
        minBlock = blockNumber;
      }
      if (blockNumber > maxBlock) {
        maxBlock = blockNumber;
      }
      if (Number(maxBlock - minBlock) > blockConflictTolerance) {
        throw new Error(
          `Multicall failed because of block conflict. Min block is ${minBlock} while max block is ${maxBlock}. Block conflict tolerance is ${blockConflictTolerance}`
        );
      }
      results = [...results, ...callResults];
    }
    return {
      results,
      blockNumber: maxBlock
    };
  } catch (e) {
    if (e instanceof Error && e.message.includes("Storage invocations limit reached") && chunks[0].length > 1) {
      return callByChunks(divideChunks(chunks), params);
    }
    throw e;
  }
}
function divideChunks(chunks) {
  const newChunks = [];
  for (const chunk2 of chunks) {
    const half = Math.ceil(chunk2.length / 2);
    const firstHalf = chunk2.slice(0, half);
    const secondHalf = chunk2.slice(half);
    if (firstHalf.length) {
      newChunks.push(firstHalf);
    }
    if (secondHalf.length) {
      newChunks.push(secondHalf);
    }
  }
  return newChunks;
}
function splitCallsIntoChunks(calls, gasLimit) {
  const chunks = [[]];
  let gasLeft = gasLimit;
  for (const callRequest of calls) {
    const { target, callData, gasLimit: gasCostLimit } = callRequest;
    const singleGasLimit = toBigInt(gasCostLimit);
    const currentChunk = chunks[chunks.length - 1];
    if (singleGasLimit > gasLeft) {
      chunks.push([callRequest]);
      gasLeft = gasLimit - singleGasLimit;
      if (gasLeft < 0n) {
        console.warn(
          `Multicall request may fail as the gas cost of a single call exceeds the gas limit ${gasLimit}. Gas cost: ${singleGasLimit}. To: ${target}. Data: ${callData}`
        );
      }
      continue;
    }
    currentChunk.push(callRequest);
    gasLeft -= singleGasLimit;
  }
  return chunks;
}

// evm/abis/InterfaceMulticall.ts
var InterfaceMulticall_default = [
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address"
      }
    ],
    name: "getEthBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes"
          }
        ],
        internalType: "struct PancakeInterfaceMulticall.Call[]",
        name: "calls",
        type: "tuple[]"
      }
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256"
      },
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool"
          },
          {
            internalType: "uint256",
            name: "gasUsed",
            type: "uint256"
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes"
          }
        ],
        internalType: "struct PancakeInterfaceMulticall.Result[]",
        name: "returnData",
        type: "tuple[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// evm/v3-router/providers/multicallProvider.ts
var IMulticallProvider = class {
};

// evm/v3-router/providers/multicallSwapProvider.ts
var PancakeMulticallProvider = class extends IMulticallProvider {
  constructor(chainId, provider, gasLimitPerCall = 1e6) {
    super();
    this.chainId = chainId;
    this.provider = provider;
    this.gasLimitPerCall = gasLimitPerCall;
    this.provider = provider;
  }
  async callSameFunctionOnMultipleContracts(params) {
    const { addresses, functionName, functionParams, abi, additionalConfig } = params;
    const gasLimitPerCall = additionalConfig?.gasLimitPerCall ?? this.gasLimitPerCall;
    const callData = viem.encodeFunctionData({
      abi,
      functionName,
      args: functionParams
    });
    const calls = addresses.map((address) => {
      return {
        target: address,
        callData,
        gasLimit: BigInt(gasLimitPerCall)
      };
    });
    const { results: result, blockNumber } = await multicallByGasLimit(calls, {
      gasLimit: additionalConfig?.gasLimit,
      gasBuffer: additionalConfig?.gasBuffer,
      dropUnexecutedCalls: additionalConfig?.dropUnexecutedCalls,
      chainId: this.chainId,
      client: this.provider,
      signal: additionalConfig?.signal
    });
    const results = [];
    const gasUsedForSuccess = [];
    const gasUsedForFail = [];
    for (const { result: callResult, success, gasUsed } of result) {
      if (callResult === "0x" || !success) {
        results.push({
          success: false,
          returnData: callResult
        });
        gasUsedForFail.push(Number(gasUsed));
        continue;
      }
      try {
        results.push({
          success: true,
          result: viem.decodeFunctionResult({
            abi,
            functionName,
            data: callResult
          })
        });
        gasUsedForSuccess.push(Number(gasUsed));
      } catch (e) {
        results.push({
          success: false,
          returnData: callResult
        });
      }
    }
    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats__default.default.percentile(gasUsedForSuccess, 99),
      approxGasUsedPerFailCall: stats__default.default.percentile(gasUsedForFail, 99)
    };
  }
  async callSameFunctionOnContractWithMultipleParams(params) {
    const { address, functionName, functionParams, abi, additionalConfig } = params;
    const gasLimitPerCall = additionalConfig?.gasLimitPerCall ?? this.gasLimitPerCall;
    const calls = functionParams.map((functionParam) => {
      const callData = viem.encodeFunctionData({
        abi,
        functionName,
        args: functionParam
      });
      return {
        target: address,
        callData,
        gasLimit: BigInt(gasLimitPerCall)
      };
    });
    const { results: result, blockNumber } = await multicallByGasLimit(calls, {
      gasLimit: additionalConfig?.gasLimit,
      gasBuffer: additionalConfig?.gasBuffer,
      dropUnexecutedCalls: additionalConfig?.dropUnexecutedCalls,
      chainId: this.chainId,
      client: this.provider,
      signal: additionalConfig?.signal
    });
    const results = [];
    const gasUsedForSuccess = [];
    const gasUsedForFail = [];
    for (const { result: callResult, success, gasUsed } of result) {
      if (callResult === "0x" || !success) {
        results.push({
          success: false,
          returnData: callResult
        });
        gasUsedForFail.push(Number(gasUsed));
        continue;
      }
      try {
        results.push({
          success: true,
          result: viem.decodeFunctionResult({
            abi,
            functionName,
            data: callResult
          })
        });
        gasUsedForSuccess.push(Number(gasUsed));
      } catch (e) {
        results.push({
          success: false,
          returnData: callResult
        });
      }
    }
    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats__default.default.percentile(gasUsedForSuccess, 99),
      approxGasUsedPerFailCall: stats__default.default.percentile(gasUsedForFail, 99)
    };
  }
  async callMultipleFunctionsOnSameContract(params) {
    const { address, functionNames, functionParams, additionalConfig, abi } = params;
    const gasLimitPerCall = additionalConfig?.gasLimitPerCall ?? this.gasLimitPerCall;
    const calls = functionNames.map((functionName, i) => {
      const callData = viem.encodeFunctionData({
        abi,
        functionName,
        args: functionParams ? functionParams[i] : []
      });
      return {
        target: address,
        callData,
        gasLimit: BigInt(gasLimitPerCall)
      };
    });
    const { results: result, blockNumber } = await multicallByGasLimit(calls, {
      gasLimit: additionalConfig?.gasLimit,
      gasBuffer: additionalConfig?.gasBuffer,
      dropUnexecutedCalls: additionalConfig?.dropUnexecutedCalls,
      chainId: this.chainId,
      client: this.provider,
      signal: additionalConfig?.signal
    });
    const results = [];
    const gasUsedForSuccess = [];
    const gasUsedForFail = [];
    for (const [i, { result: callResult, success, gasUsed }] of result.entries()) {
      if (callResult === "0x" || !success) {
        results.push({
          success: false,
          returnData: callResult
        });
        gasUsedForFail.push(Number(gasUsed));
        continue;
      }
      try {
        results.push({
          success: true,
          result: viem.decodeFunctionResult({
            abi,
            functionName: functionNames[i],
            data: callResult
          })
        });
        gasUsedForSuccess.push(Number(gasUsed));
      } catch (e) {
        results.push({
          success: false,
          returnData: callResult
        });
      }
    }
    return {
      blockNumber,
      results,
      approxGasUsedPerSuccessCall: stats__default.default.percentile(gasUsedForSuccess, 99),
      approxGasUsedPerFailCall: stats__default.default.percentile(gasUsedForFail, 99)
    };
  }
};
PancakeMulticallProvider.abi = InterfaceMulticall_default;

// evm/v3-router/providers/onChainQuoteProvider.ts
var DEFAULT_BATCH_RETRIES = 2;
var SUCCESS_RATE_CONFIG = {
  [84532 /* BASE_SEPOLIA */]: 0.1
};
var BlockConflictError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "BlockConflictError";
  }
};
var SuccessRateError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "SuccessRateError";
  }
};
var ProviderBlockHeaderError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "ProviderBlockHeaderError";
  }
};
var ProviderTimeoutError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "ProviderTimeoutError";
  }
};
var ProviderGasError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "ProviderGasError";
  }
};
var retryControllerFactory = ({ retries }) => {
  const errors = [];
  let remainingRetries = retries || 0;
  return {
    shouldRetry: (error) => !isAbortError(error) && remainingRetries > 0 && errors.every((err) => err.name !== error.name),
    onRetry: (error) => {
      errors.push(error);
      remainingRetries -= 1;
    },
    getErrorsOnPreviousRetries: () => errors
  };
};
var defaultAdjustQuoteForGas = ({ isExactIn, quote, gasCostInToken }) => isExactIn ? quote.subtract(gasCostInToken) : quote.add(gasCostInToken);
function onChainQuoteProviderFactory({ getQuoteFunctionName, getQuoterAddress, abi, getCallInputs }) {
  return function createOnChainQuoteProvider({
    onChainProvider,
    gasLimit,
    multicallConfigs: multicallConfigsOverride,
    onAdjustQuoteForGas = defaultAdjustQuoteForGas
  }) {
    const createGetRoutesWithQuotes = (isExactIn = true) => {
      const functionName = getQuoteFunctionName(isExactIn);
      const adjustQuoteForGas = ({ quote, gasCostInToken }) => onAdjustQuoteForGas({ quote, gasCostInToken, isExactIn });
      return async function getRoutesWithQuote(routes, { blockNumber: blockNumberFromConfig, gasModel, retry: retryOptions, signal }) {
        if (!routes.length) {
          return [];
        }
        const {
          amount: {
            currency: { chainId }
          }
        } = routes[0];
        const quoterAddress = getQuoterAddress(chainId);
        const minSuccessRate = SUCCESS_RATE_CONFIG[chainId];
        const multicallConfigs = multicallConfigsOverride?.[chainId] || BATCH_MULTICALL_CONFIGS[chainId] || BATCH_MULTICALL_CONFIGS[84532 /* BASE_SEPOLIA */];
        const {
          defaultConfig: { gasLimitPerCall: defaultGasLimitPerCall, dropUnexecutedCalls }
        } = multicallConfigs;
        const chainProvider = onChainProvider({ chainId });
        const providerConfig = { blockNumber: blockNumberFromConfig };
        const multicall2Provider = new PancakeMulticallProvider(chainId, chainProvider, defaultGasLimitPerCall);
        const inputs = routes.map((route) => getCallInputs(route, isExactIn));
        const retryOptionsWithDefault = {
          retries: DEFAULT_BATCH_RETRIES,
          minTimeout: 25,
          maxTimeout: 250,
          ...retryOptions
        };
        const { shouldRetry, onRetry } = retryControllerFactory(retryOptionsWithDefault);
        async function getQuotes({ gasLimitPerCall }) {
          try {
            const { results, blockNumber, approxGasUsedPerSuccessCall } = await multicall2Provider.callSameFunctionOnContractWithMultipleParams({
              address: quoterAddress,
              abi,
              functionName,
              functionParams: inputs,
              providerConfig,
              additionalConfig: {
                dropUnexecutedCalls,
                gasLimitPerCall,
                gasLimit,
                signal
              }
            });
            const successRateError = validateSuccessRate(results, minSuccessRate);
            if (successRateError) {
              throw successRateError;
            }
            return {
              results,
              blockNumber,
              approxGasUsedPerSuccessCall
            };
          } catch (err) {
            if (err instanceof SuccessRateError || err instanceof BlockConflictError || isAbortError(err)) {
              throw err;
            }
            const slicedErrMsg = err.message.slice(0, 500);
            if (err.message.includes("header not found")) {
              throw new ProviderBlockHeaderError(slicedErrMsg);
            }
            if (err.message.includes("timeout")) {
              throw new ProviderTimeoutError(`Request had ${inputs.length} inputs. ${slicedErrMsg}`);
            }
            if (err.message.includes("out of gas")) {
              throw new ProviderGasError(slicedErrMsg);
            }
            throw new Error(`Unknown error from provider: ${slicedErrMsg}`);
          }
        }
        const quoteResult = await retry__default.default(async (bail) => {
          try {
            const quotes = await getQuotes({
              gasLimitPerCall: defaultGasLimitPerCall
            });
            return quotes;
          } catch (e) {
            const error = e instanceof Error ? e : new Error(`Unexpected error type ${e}`);
            if (!shouldRetry(error)) {
              return bail(error);
            }
            if (error instanceof SuccessRateError) {
              onRetry(error);
              const { successRateFailureOverrides } = multicallConfigs;
              return getQuotes({
                gasLimitPerCall: successRateFailureOverrides.gasLimitPerCall
              });
            }
            if (error instanceof ProviderGasError) {
              onRetry(error);
              const { gasErrorFailureOverride } = multicallConfigs;
              return getQuotes({
                gasLimitPerCall: gasErrorFailureOverride.gasLimitPerCall
              });
            }
            throw error;
          }
        }, retryOptionsWithDefault);
        if (!quoteResult) {
          throw new Error(`Unexpected empty quote result ${quoteResult}`);
        }
        const { results: quoteResults } = quoteResult;
        const routesWithQuote = processQuoteResults(quoteResults, routes, gasModel, adjustQuoteForGas, isExactIn);
        return routesWithQuote;
      };
    };
    return {
      getRouteWithQuotesExactIn: createGetRoutesWithQuotes(true),
      getRouteWithQuotesExactOut: createGetRoutesWithQuotes(false)
    };
  };
}
function validateSuccessRate(allResults, quoteMinSuccessRate) {
  const numResults = allResults.length;
  const numSuccessResults = allResults.filter((result) => result.success).length;
  const successRate = 1 * numSuccessResults / numResults;
  if (successRate < quoteMinSuccessRate) {
    return new SuccessRateError(`Quote success rate below threshold of ${quoteMinSuccessRate}: ${successRate}`);
  }
  return void 0;
}
function processQuoteResults(quoteResults, routes, gasModel, adjustQuoteForGas, isExactIn) {
  const routesWithQuote = [];
  for (let i = 0; i < quoteResults.length; i += 1) {
    const route = routes[i];
    const quoteResult = quoteResults[i];
    if (!quoteResult) {
      continue;
    }
    const { success } = quoteResult;
    if (!success) {
      continue;
    }
    const quoteCurrency = getQuoteCurrency(route, route.amount.currency);
    const quote = isExactIn ? sdk.CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, quoteResult.result[0][quoteResult.result[0].length - 1].toString()) : sdk.CurrencyAmount.fromRawAmount(quoteCurrency.wrapped, quoteResult.result[1][quoteResult.result[1].length - 1].toString());
    const { gasEstimate, gasCostInToken, gasCostInUSD } = gasModel.estimateGasCost(
      {
        ...route,
        quote
      },
      { initializedTickCrossedList: quoteResult.result[3] }
    );
    routesWithQuote.push({
      ...route,
      quote,
      quoteAdjustedForGas: adjustQuoteForGas({ quote, gasCostInToken }),
      feeList: quoteResult.result[5],
      amountOutList: quoteResult.result[0],
      amountInList: quoteResult.result[1],
      sqrtPriceX96AfterList: quoteResult.result[2],
      gasEstimate,
      gasCostInToken,
      gasCostInUSD
    });
  }
  return routesWithQuote;
}
var createMixedRouteOnChainQuoteProvider = onChainQuoteProviderFactory({
  getQuoterAddress: (chainId) => MIXED_ROUTE_QUOTER_ADDRESSES[chainId],
  getQuoteFunctionName: () => "quoteExactInput",
  abi: algebraQuoterV2ABI,
  getCallInputs: (route, isExactIn) => [
    encodeMixedRouteToPath(route, !isExactIn, false),
    `0x${route.amount.quotient.toString(16)}`
  ]
});
var createV3OnChainQuoteProvider = onChainQuoteProviderFactory({
  getQuoterAddress: (chainId) => V3_QUOTER_ADDRESSES[chainId],
  getQuoteFunctionName: (isExactIn) => isExactIn ? "quoteExactInput" : "quoteExactOutput",
  abi: algebraQuoterV2ABI,
  getCallInputs: (route, isExactIn) => [
    encodeMixedRouteToPath(route, !isExactIn, true),
    `0x${route.amount.quotient.toString(16)}`
  ]
});

// evm/v3-router/providers/quoteProviders.ts
function createQuoteProvider(config) {
  const { onChainProvider, multicallConfigs, gasLimit } = config;
  const offChainQuoteProvider = createOffChainQuoteProvider();
  const mixedRouteOnChainQuoteProvider = createMixedRouteOnChainQuoteProvider({
    onChainProvider,
    multicallConfigs,
    gasLimit
  });
  const v3OnChainQuoteProvider = createV3OnChainQuoteProvider({ onChainProvider, multicallConfigs, gasLimit });
  const createGetRouteWithQuotes = (isExactIn = true) => {
    const getOffChainQuotes = isExactIn ? offChainQuoteProvider.getRouteWithQuotesExactIn : offChainQuoteProvider.getRouteWithQuotesExactOut;
    const getMixedRouteQuotes = isExactIn ? mixedRouteOnChainQuoteProvider.getRouteWithQuotesExactIn : mixedRouteOnChainQuoteProvider.getRouteWithQuotesExactOut;
    const getV3Quotes = isExactIn ? v3OnChainQuoteProvider.getRouteWithQuotesExactIn : v3OnChainQuoteProvider.getRouteWithQuotesExactOut;
    return async function getRoutesWithQuotes(routes, { blockNumber, gasModel, signal }) {
      const v3SingleHopRoutes = [];
      const v3MultihopRoutes = [];
      const mixedRoutesHaveV3Pool = [];
      const routesCanQuoteOffChain = [];
      for (const route of routes) {
        if (route.type === 0 /* V2 */ || route.type === 2 /* STABLE */) {
          mixedRoutesHaveV3Pool.push(route);
          continue;
        }
        if (route.type === 1 /* V3 */) {
          if (route.pools.length === 1) {
            v3SingleHopRoutes.push(route);
            continue;
          }
          v3MultihopRoutes.push(route);
          continue;
        }
        const { pools } = route;
        if (pools.some((pool) => isV3Pool(pool))) {
          mixedRoutesHaveV3Pool.push(route);
          continue;
        }
        routesCanQuoteOffChain.push(route);
      }
      const results = await Promise.allSettled([
        getOffChainQuotes(routesCanQuoteOffChain, { blockNumber, gasModel, signal }),
        getMixedRouteQuotes(mixedRoutesHaveV3Pool, { blockNumber, gasModel, retry: { retries: 0 }, signal }),
        getV3Quotes(v3SingleHopRoutes, { blockNumber, gasModel, signal }),
        getV3Quotes(v3MultihopRoutes, { blockNumber, gasModel, retry: { retries: 1 }, signal })
      ]);
      if (results.every((result) => result.status === "rejected")) {
        throw new Error(results.map((result) => result.reason).join(","));
      }
      return results.filter((result) => result.status === "fulfilled").reduce((acc, cur) => [...acc, ...cur.value], []);
    };
  };
  return {
    getRouteWithQuotesExactIn: createGetRouteWithQuotes(true),
    getRouteWithQuotesExactOut: createGetRouteWithQuotes(false),
    getConfig: () => config
  };
}
var baseSepoliaChain = /* @__PURE__ */ viem.defineChain({
  id: 84532,
  network: "baseSepolia",
  name: "Base Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://base-sepolia-rpc.publicnode.com"]
    },
    public: {
      http: ["https://base-sepolia-rpc.publicnode.com"]
    }
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://sepolia.basescan.org"
    },
    etherscan: {
      name: "Basescan",
      url: "https://sepolia.basescan.org"
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 1059647
    }
  }
});
var pulsechainTestnetChain = /* @__PURE__ */ viem.defineChain({
  id: 943,
  network: "pulsechain-testnet",
  name: "PulseChain Testnet",
  nativeCurrency: { name: "tPLS", symbol: "tPLS", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.v4.testnet.pulsechain.com"]
    },
    public: {
      http: ["https://rpc.v4.testnet.pulsechain.com"]
    }
  },
  blockExplorers: {
    default: {
      name: "PulseChain Testnet Explorer",
      url: "https://otter-testnet-pulsechain.g4mm4.io/"
    }
  }
});
var publicClient = {
  [84532 /* BASE_SEPOLIA */]: viem.createPublicClient({
    chain: baseSepoliaChain,
    transport: viem.fallback([viem.http("https://base-sepolia-rpc.publicnode.com"), viem.http("https://sepolia.base.org")], { rank: false }),
    batch: {
      multicall: {
        batchSize: 1024 * 200
      }
    }
  }),
  [943 /* PULSECHAIN_TESTNET */]: viem.createPublicClient({
    chain: pulsechainTestnetChain,
    transport: viem.http("https://rpc.v4.testnet.pulsechain.com"),
    batch: {
      multicall: {
        batchSize: 1024 * 200
      }
    }
  })
};
var quoteProvider = {
  [84532 /* BASE_SEPOLIA */]: createQuoteProvider({
    onChainProvider: () => publicClient[84532 /* BASE_SEPOLIA */]
  }),
  [943 /* PULSECHAIN_TESTNET */]: createQuoteProvider({
    onChainProvider: () => publicClient[943 /* PULSECHAIN_TESTNET */]
  })
};
var v3SubgraphClient = {
  [84532 /* BASE_SEPOLIA */]: new graphqlRequest.GraphQLClient("https://api.studio.thegraph.com/query/50593/integral-v12/v1.0.0"),
  [943 /* PULSECHAIN_TESTNET */]: new graphqlRequest.GraphQLClient("")
};
var v2SubgraphClient = {
  [84532 /* BASE_SEPOLIA */]: new graphqlRequest.GraphQLClient(""),
  [943 /* PULSECHAIN_TESTNET */]: new graphqlRequest.GraphQLClient("")
};

// evm/v3-router/schema.ts
var schema_exports = {};
__export(schema_exports, {
  zPools: () => zPools,
  zRouterGetParams: () => zRouterGetParams,
  zRouterPostParams: () => zRouterPostParams
});
var zChainId = zod.z.nativeEnum(ChainId);
var zFee = zod.z.number();
var zTradeType = zod.z.nativeEnum(sdk.TradeType);
var zPoolType = zod.z.nativeEnum(PoolType);
var zPoolTypes = zod.z.array(zPoolType);
var zAddress = zod.z.custom((val) => /^0x[a-fA-F0-9]{40}$/.test(val));
var zBigNumber = zod.z.string().regex(/^[0-9]+$/);
var zCurrency = zod.z.object({
  address: zAddress,
  decimals: zod.z.number(),
  symbol: zod.z.string()
}).required();
var zCurrencyAmount = zod.z.object({
  currency: zCurrency.required(),
  value: zBigNumber
}).required();
var zV2Pool = zod.z.object({
  type: zPoolType,
  reserve0: zCurrencyAmount,
  reserve1: zCurrencyAmount
}).required();
var zV3Pool = zod.z.object({
  type: zPoolType,
  token0: zCurrency,
  token1: zCurrency,
  fee: zFee,
  liquidity: zBigNumber,
  sqrtRatioX96: zBigNumber,
  tick: zod.z.number(),
  address: zAddress,
  token0ProtocolFee: zod.z.string(),
  token1ProtocolFee: zod.z.string()
}).required();
var zStablePool = zod.z.object({
  type: zPoolType,
  reserve0: zCurrencyAmount,
  reserve1: zCurrencyAmount
}).required();
var zPools = zod.z.array(zod.z.union([zV2Pool, zV3Pool, zStablePool]));
var zRouterGetParams = zod.z.object({
  chainId: zChainId,
  tradeType: zTradeType,
  amount: zCurrencyAmount,
  currency: zCurrency,
  gasPriceWei: zBigNumber.optional(),
  maxHops: zod.z.number().optional(),
  maxSplits: zod.z.number().optional(),
  blockNumber: zBigNumber.optional(),
  poolTypes: zPoolTypes.optional()
}).required({
  chainId: true,
  tradeType: true,
  amount: true,
  currency: true,
  candidatePools: true
});
var zRouterPostParams = zod.z.object({
  chainId: zChainId,
  tradeType: zTradeType,
  amount: zCurrencyAmount,
  currency: zCurrency,
  candidatePools: zPools,
  gasPriceWei: zBigNumber.optional(),
  maxHops: zod.z.number().optional(),
  maxSplits: zod.z.number().optional(),
  blockNumber: zBigNumber.optional(),
  poolTypes: zPoolTypes.optional(),
  onChainQuoterGasLimit: zBigNumber.optional(),
  nativeCurrencyUsdPrice: zod.z.number().optional(),
  quoteCurrencyUsdPrice: zod.z.number().optional()
}).required({
  chainId: true,
  tradeType: true,
  amount: true,
  currency: true,
  candidatePools: true
});

// evm/abis/IMulticallExtended.ts
var multicallExtendedAbi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "previousBlockhash",
        type: "bytes32"
      },
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
];

// evm/v3-router/utils/multicallExtended.ts
function validateAndParseBytes32(bytes32) {
  if (!bytes32.match(/^0x[0-9a-fA-F]{64}$/)) {
    throw new Error(`${bytes32} is not valid bytes32.`);
  }
  return bytes32.toLowerCase();
}
var _MulticallExtended = class {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {
  }
  static encodeMulticall(calldatas, validation) {
    if (typeof validation === "undefined") {
      return v3Sdk.Multicall.encodeMulticall(calldatas);
    }
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas];
    }
    if (typeof validation === "string" && validation.startsWith("0x")) {
      const previousBlockhash = validateAndParseBytes32(validation);
      return viem.encodeFunctionData({
        abi: _MulticallExtended.ABI,
        functionName: "multicall",
        args: [previousBlockhash, calldatas]
      });
    }
    const deadline = BigInt(validation);
    return viem.encodeFunctionData({
      abi: _MulticallExtended.ABI,
      functionName: "multicall",
      args: [deadline, calldatas]
    });
  }
};
var MulticallExtended = _MulticallExtended;
MulticallExtended.ABI = multicallExtendedAbi;

// evm/abis/IPeripheryPaymentsWithFeeExtended.ts
var peripheryPaymentsWithFeeExtendedAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "pull",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "refundNativeToken",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      }
    ],
    name: "sweepToken",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      }
    ],
    name: "sweepToken",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "feeBips",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address"
      }
    ],
    name: "sweepTokenWithFee",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "feeBips",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address"
      }
    ],
    name: "sweepTokenWithFee",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      }
    ],
    name: "unwrapWNativeToken",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      }
    ],
    name: "unwrapWNativeToken",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "feeBips",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address"
      }
    ],
    name: "unwrapWNativeTokenWithFee",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountMinimum",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "feeBips",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "feeRecipient",
        type: "address"
      }
    ],
    name: "unwrapWNativeTokenWithFee",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "wrapETH",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

// evm/v3-router/utils/paymentsExtended.ts
function encodeFeeBips(fee) {
  return fee.multiply(1e4).quotient;
}
var _PaymentsExtended = class {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {
  }
  static encodeUnwrapWETH9(amountMinimum, recipient, feeOptions) {
    if (typeof recipient === "string") {
      recipient = sdk.validateAndParseAddress(recipient);
      if (feeOptions) {
        const feeBips = encodeFeeBips(feeOptions.fee);
        const feeRecipient = sdk.validateAndParseAddress(feeOptions.recipient);
        return viem.encodeFunctionData({
          abi: _PaymentsExtended.ABI,
          functionName: "unwrapWNativeTokenWithFee",
          args: [amountMinimum, recipient, feeBips, feeRecipient]
        });
      }
      return viem.encodeFunctionData({ abi: _PaymentsExtended.ABI, functionName: "unwrapWNativeToken", args: [amountMinimum, recipient] });
    }
    if (!!feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee);
      const feeRecipient = sdk.validateAndParseAddress(feeOptions.recipient);
      return viem.encodeFunctionData({
        abi: _PaymentsExtended.ABI,
        functionName: "unwrapWNativeTokenWithFee",
        args: [amountMinimum, feeBips, feeRecipient]
      });
    }
    return viem.encodeFunctionData({
      abi: _PaymentsExtended.ABI,
      functionName: "unwrapWNativeToken",
      args: [amountMinimum]
    });
  }
  static encodeSweepToken(token, amountMinimum, recipient, feeOptions) {
    if (typeof recipient === "string") {
      return v3Sdk.Payments.encodeSweepToken(token, amountMinimum, recipient, feeOptions);
    }
    if (!!feeOptions) {
      const feeBips = encodeFeeBips(feeOptions.fee);
      const feeRecipient = sdk.validateAndParseAddress(feeOptions.recipient);
      return viem.encodeFunctionData({
        abi: _PaymentsExtended.ABI,
        functionName: "sweepTokenWithFee",
        args: [token.address, amountMinimum, feeBips, feeRecipient]
      });
    }
    return viem.encodeFunctionData({
      abi: _PaymentsExtended.ABI,
      functionName: "sweepToken",
      args: [token.address, amountMinimum]
    });
  }
  static encodePull(token, amount) {
    return viem.encodeFunctionData({ abi: _PaymentsExtended.ABI, functionName: "pull", args: [token.address, amount] });
  }
  static encodeWrapETH(amount) {
    return viem.encodeFunctionData({ abi: _PaymentsExtended.ABI, functionName: "wrapETH", args: [amount] });
  }
};
var PaymentsExtended = _PaymentsExtended;
PaymentsExtended.ABI = peripheryPaymentsWithFeeExtendedAbi;

// evm/abis/algebra/algebraRouter.ts
var algebraRouterABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_WNativeToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_poolDeployer",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "WNativeToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "amount0Delta",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "amount1Delta",
        "type": "int256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "algebraSwapCallback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "path",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOutMinimum",
            "type": "uint256"
          }
        ],
        "internalType": "struct ISwapRouter.ExactInputParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "exactInput",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "deployer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOutMinimum",
            "type": "uint256"
          },
          {
            "internalType": "uint160",
            "name": "limitSqrtPrice",
            "type": "uint160"
          }
        ],
        "internalType": "struct ISwapRouter.ExactInputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "exactInputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "deployer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOutMinimum",
            "type": "uint256"
          },
          {
            "internalType": "uint160",
            "name": "limitSqrtPrice",
            "type": "uint160"
          }
        ],
        "internalType": "struct ISwapRouter.ExactInputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "exactInputSingleSupportingFeeOnTransferTokens",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "bytes",
            "name": "path",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountInMaximum",
            "type": "uint256"
          }
        ],
        "internalType": "struct ISwapRouter.ExactOutputParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "exactOutput",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "deployer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOut",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountInMaximum",
            "type": "uint256"
          },
          {
            "internalType": "uint160",
            "name": "limitSqrtPrice",
            "type": "uint160"
          }
        ],
        "internalType": "struct ISwapRouter.ExactOutputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "exactOutputSingle",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes[]",
        "name": "data",
        "type": "bytes[]"
      }
    ],
    "name": "multicall",
    "outputs": [
      {
        "internalType": "bytes[]",
        "name": "results",
        "type": "bytes[]"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolDeployer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "refundNativeToken",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "selfPermit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expiry",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "selfPermitAllowed",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expiry",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "selfPermitAllowedIfNecessary",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "selfPermitIfNecessary",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountMinimum",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "sweepToken",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountMinimum",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "feeBips",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "feeRecipient",
        "type": "address"
      }
    ],
    "name": "sweepTokenWithFee",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountMinimum",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "unwrapWNativeToken",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountMinimum",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "feeBips",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "feeRecipient",
        "type": "address"
      }
    ],
    "name": "unwrapWNativeTokenWithFee",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// evm/abis/IApproveAndCall.ts
var approveAndCallAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "approveMax",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "approveMaxMinusOne",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "approveZeroThenMax",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "approveZeroThenMaxMinusOne",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "callPositionManager",
    outputs: [
      {
        internalType: "bytes",
        name: "result",
        type: "bytes"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "getApprovalType",
    outputs: [
      {
        internalType: "enum IApproveAndCall.ApprovalType",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token0",
            type: "address"
          },
          {
            internalType: "address",
            name: "token1",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amount0Min",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amount1Min",
            type: "uint256"
          }
        ],
        internalType: "struct IApproveAndCall.IncreaseLiquidityParams",
        name: "params",
        type: "tuple"
      }
    ],
    name: "increaseLiquidity",
    outputs: [
      {
        internalType: "bytes",
        name: "result",
        type: "bytes"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token0",
            type: "address"
          },
          {
            internalType: "address",
            name: "token1",
            type: "address"
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24"
          },
          {
            internalType: "int24",
            name: "tickLower",
            type: "int24"
          },
          {
            internalType: "int24",
            name: "tickUpper",
            type: "int24"
          },
          {
            internalType: "uint256",
            name: "amount0Min",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "amount1Min",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address"
          }
        ],
        internalType: "struct IApproveAndCall.MintParams",
        name: "params",
        type: "tuple"
      }
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bytes",
        name: "result",
        type: "bytes"
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
];

// evm/v3-router/utils/approveAndCall.ts
function isMint(options) {
  return Object.keys(options).some((k) => k === "recipient");
}
var _ApproveAndCall = class {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {
  }
  static encodeApproveMax(token) {
    return viem.encodeFunctionData({
      abi: _ApproveAndCall.ABI,
      functionName: "approveMax",
      args: [token.address]
    });
  }
  static encodeApproveMaxMinusOne(token) {
    return viem.encodeFunctionData({
      abi: _ApproveAndCall.ABI,
      functionName: "approveMaxMinusOne",
      args: [token.address]
    });
  }
  static encodeApproveZeroThenMax(token) {
    return viem.encodeFunctionData({
      abi: _ApproveAndCall.ABI,
      functionName: "approveZeroThenMax",
      args: [token.address]
    });
  }
  static encodeApproveZeroThenMaxMinusOne(token) {
    return viem.encodeFunctionData({
      abi: _ApproveAndCall.ABI,
      functionName: "approveZeroThenMaxMinusOne",
      args: [token.address]
    });
  }
  static encodeCallPositionManager(calldatas) {
    invariant5__default.default(calldatas.length > 0, "NULL_CALLDATA");
    if (calldatas.length === 1) {
      return viem.encodeFunctionData({
        abi: _ApproveAndCall.ABI,
        functionName: "callPositionManager",
        args: calldatas
      });
    }
    const encodedMulticall = viem.encodeFunctionData({
      abi: v3Sdk.NonfungiblePositionManager.ABI,
      functionName: "multicall",
      args: [calldatas]
    });
    return viem.encodeFunctionData({
      abi: _ApproveAndCall.ABI,
      functionName: "callPositionManager",
      args: [encodedMulticall]
    });
  }
  /**
   * Encode adding liquidity to a position in the nft manager contract
   * @param position Forcasted position with expected amount out from swap
   * @param minimalPosition Forcasted position with custom minimal token amounts
   * @param addLiquidityOptions Options for adding liquidity
   * @param slippageTolerance Defines maximum slippage
   */
  static encodeAddLiquidity(position, minimalPosition, addLiquidityOptions, slippageTolerance) {
    let { amount0: amount0Min, amount1: amount1Min } = position.mintAmountsWithSlippage(slippageTolerance);
    if (minimalPosition.amount0.quotient < amount0Min) {
      amount0Min = minimalPosition.amount0.quotient;
    }
    if (minimalPosition.amount1.quotient < amount1Min) {
      amount1Min = minimalPosition.amount1.quotient;
    }
    if (isMint(addLiquidityOptions)) {
      return viem.encodeFunctionData({
        abi: _ApproveAndCall.ABI,
        functionName: "mint",
        args: [
          {
            token0: position.pool.token0.address,
            token1: position.pool.token1.address,
            fee: position.pool.fee,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            amount0Min,
            amount1Min,
            recipient: addLiquidityOptions.recipient
          }
        ]
      });
    }
    return viem.encodeFunctionData({
      abi: _ApproveAndCall.ABI,
      functionName: "increaseLiquidity",
      args: [
        {
          token0: position.pool.token0.address,
          token1: position.pool.token1.address,
          amount0Min,
          amount1Min,
          tokenId: BigInt(addLiquidityOptions.tokenId)
        }
      ]
    });
  }
  static encodeApprove(token, approvalType) {
    switch (approvalType) {
      case 1 /* MAX */:
        return _ApproveAndCall.encodeApproveMax(token.wrapped);
      case 2 /* MAX_MINUS_ONE */:
        return _ApproveAndCall.encodeApproveMaxMinusOne(token.wrapped);
      case 3 /* ZERO_THEN_MAX */:
        return _ApproveAndCall.encodeApproveZeroThenMax(token.wrapped);
      case 4 /* ZERO_THEN_MAX_MINUS_ONE */:
        return _ApproveAndCall.encodeApproveZeroThenMaxMinusOne(token.wrapped);
      default:
        throw new Error("Error: invalid ApprovalType");
    }
  }
};
var ApproveAndCall = _ApproveAndCall;
ApproveAndCall.ABI = approveAndCallAbi;

// evm/v3-router/utils/swapRouter.ts
var ZERO8 = BigInt(0);
var REFUND_ETH_PRICE_IMPACT_THRESHOLD = new customPoolsSdk.Percent(50, 100);
var _SwapRouter = class {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {
  }
  /**
   * @notice Generates the calldata for a Swap with a V2 Route.
   * @param trade The V2Trade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  // private static encodeV2Swap(
  //   trade: SmartRouterTrade<TradeType>,
  //   options: SwapOptions,
  //   routerMustCustody: boolean,
  //   performAggregatedSlippageCheck: boolean,
  // ): Hex {
  //   const amountIn: bigint = maximumAmountIn(trade, options.slippageTolerance).quotient
  //   const amountOut: bigint = minimumAmountOut(trade, options.slippageTolerance).quotient
  //   // V2 trade should have only one route
  //   const route = trade.routes[0]
  //   const path = []
  //   for (let i = 0; i <= route.path.length - 2; i++) {
  //     const token = route.path[i]
  //     const nextToken = route.path[i + 1]
  //     path.push({
  //       from: token.wrapped.address as Address,
  //       to: nextToken.wrapped.address as Address,
  //       stable: route.pools[path.length].type === PoolType.STABLE
  //     })
  //   }
  //   const recipient = routerMustCustody
  //     ? ADDRESS_THIS
  //     : typeof options.recipient === 'undefined'
  //     ? MSG_SENDER
  //     : validateAndParseAddress(options.recipient)
  //     if (trade.tradeType === TradeType.EXACT_INPUT) {
  //       const exactInputParams = [amountIn, performAggregatedSlippageCheck ? 0n : amountOut, path, recipient] as const
  //       return encodeFunctionData({
  //         abi: SwapRouter.ABI,
  //         functionName: 'swapExactTokensForTokens',
  //         args: exactInputParams,
  //       })
  //     }
  //     const exactOutputParams = [amountIn, amountOut, path, recipient] as const
  //     return encodeFunctionData({
  //       abi: SwapRouter.ABI,
  //       functionName: 'swapExactTokensForTokens',
  //       args: exactOutputParams,
  //     })
  // }
  /**
   * @notice Generates the calldata for a Swap with a V3 Route.
   * @param trade The V3Trade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @param performAggregatedSlippageCheck Flag for whether we want to perform an aggregated slippage check
   * @returns A string array of calldatas for the trade.
   */
  static encodeV3Swap(trade, options, routerMustCustody) {
    const calldatas = [];
    for (const route of trade.routes) {
      const { inputAmount: inputAmountJSBI, outputAmount: outputAmountJSBI, pools, path } = route;
      const amountIn = maximumAmountInBN(trade, options.slippageTolerance, inputAmountJSBI).quotient;
      const amountOut = minimumAmountOutBN(trade, options.slippageTolerance, outputAmountJSBI).quotient;
      const singleHop = pools.length === 1;
      const recipient = routerMustCustody ? customPoolsSdk.ADDRESS_ZERO : sdk.validateAndParseAddress(options.recipient);
      if (singleHop) {
        if (trade.tradeType === sdk.TradeType.EXACT_INPUT) {
          const exactInputSingleParams = {
            tokenIn: path[0].wrapped.address,
            tokenOut: path[1].wrapped.address,
            recipient,
            amountIn,
            amountOutMinimum: amountOut,
            limitSqrtPrice: BigInt(0),
            deployer: pools[0].deployer,
            deadline: BigInt(options.deadlineOrPreviousBlockhash || 0)
          };
          calldatas.push(
            viem.encodeFunctionData({
              abi: _SwapRouter.ABI,
              functionName: "exactInputSingle",
              args: [exactInputSingleParams]
            })
          );
        } else {
          const exactOutputSingleParams = {
            tokenIn: path[0].wrapped.address,
            tokenOut: path[1].wrapped.address,
            recipient,
            amountOut,
            amountInMaximum: amountIn,
            limitSqrtPrice: BigInt(0),
            deployer: pools[0].deployer,
            deadline: BigInt(options.deadlineOrPreviousBlockhash || 0)
          };
          calldatas.push(
            viem.encodeFunctionData({
              abi: _SwapRouter.ABI,
              functionName: "exactOutputSingle",
              args: [exactOutputSingleParams]
            })
          );
        }
      } else {
        const pathStr = encodeMixedRouteToPath(
          {
            ...route,
            input: new sdk.Token(inputAmountJSBI.currency.chainId, inputAmountJSBI.currency.wrapped.address, inputAmountJSBI.currency.decimals, inputAmountJSBI.currency.symbol || "", inputAmountJSBI.currency.name),
            output: new sdk.Token(outputAmountJSBI.currency.chainId, outputAmountJSBI.currency.wrapped.address, outputAmountJSBI.currency.decimals, outputAmountJSBI.currency.symbol || "", outputAmountJSBI.currency.name)
          },
          trade.tradeType === sdk.TradeType.EXACT_OUTPUT,
          true
        );
        if (trade.tradeType === sdk.TradeType.EXACT_INPUT) {
          const exactInputParams = {
            path: pathStr,
            recipient,
            amountIn,
            amountOutMinimum: amountOut,
            deployer: pools[0].deployer,
            deadline: BigInt(options.deadlineOrPreviousBlockhash || 0)
          };
          calldatas.push(
            viem.encodeFunctionData({
              abi: _SwapRouter.ABI,
              functionName: "exactInput",
              args: [exactInputParams]
            })
          );
        } else {
          const exactOutputParams = {
            path: pathStr,
            recipient,
            amountOut,
            amountInMaximum: amountIn,
            deployer: pools[0].deployer,
            deadline: BigInt(options.deadlineOrPreviousBlockhash || 0)
          };
          calldatas.push(
            viem.encodeFunctionData({
              abi: _SwapRouter.ABI,
              functionName: "exactOutput",
              args: [exactOutputParams]
            })
          );
        }
      }
    }
    return calldatas;
  }
  /**
   * @notice Generates the calldata for a MixedRouteSwap. Since single hop routes are not MixedRoutes, we will instead generate
   *         them via the existing encodeV3Swap and encodeV2Swap methods.
   * @param trade The MixedRouteTrade to encode.
   * @param options SwapOptions to use for the trade.
   * @param routerMustCustody Flag for whether funds should be sent to the router
   * @returns A string array of calldatas for the trade.
   */
  // private static encodeMixedRouteSwap(
  //   trade: SmartRouterTrade<TradeType>,
  //   options: SwapOptions,
  //   routerMustCustody: boolean,
  //   performAggregatedSlippageCheck: boolean,
  // ): Hex[] {
  //   let calldatas: Hex[] = []
  //   const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  //   for (const route of trade.routes) {
  //     const { inputAmount, outputAmount, pools } = route
  //     const amountIn: bigint = maximumAmountIn(trade, options.slippageTolerance, inputAmount).quotient
  //     const amountOut: bigint = minimumAmountOut(trade, options.slippageTolerance, outputAmount).quotient
  //     // flag for whether the trade is single hop or not
  //     const singleHop = pools.length === 1
  //     const recipient = routerMustCustody
  //       ? ADDRESS_THIS
  //       : typeof options.recipient === 'undefined'
  //       ? MSG_SENDER
  //       : validateAndParseAddress(options.recipient)
  //     const mixedRouteIsAllV3 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
  //       return r.pools.every(isV3Pool)
  //     }
  //     const mixedRouteIsAllV2 = (r: Omit<BaseRoute, 'input' | 'output'>) => {
  //       return r.pools.every(isV2Pool) || r.pools.every(isStablePool)
  //     }
  //     if (singleHop) {
  //       /// For single hop, since it isn't really a mixedRoute, we'll just mimic behavior of V3 or V2
  //       /// We don't use encodeV3Swap() or encodeV2Swap() because casting the trade to a V3Trade or V2Trade is overcomplex
  //       if (mixedRouteIsAllV3(route)) {
  //         calldatas = [
  //           ...calldatas,
  //           ...SwapRouter.encodeV3Swap(
  //             {
  //               ...trade,
  //               routes: [route],
  //               inputAmount,
  //               outputAmount,
  //             },
  //             options,
  //             routerMustCustody,
  //             performAggregatedSlippageCheck,
  //           ),
  //         ]
  //       } else if (mixedRouteIsAllV2(route)) {
  //         calldatas = [
  //           ...calldatas,
  //           SwapRouter.encodeV2Swap(
  //             {
  //               ...trade,
  //               routes: [route],
  //               inputAmount,
  //               outputAmount,
  //             },
  //             options,
  //             routerMustCustody,
  //             performAggregatedSlippageCheck,
  //           ),
  //         ]
  //       } else {
  //         throw new Error('Unsupported route to encode')
  //       }
  //     } else {
  //       const sections = partitionMixedRouteByProtocol(route)
  //       const isLastSectionInRoute = (i: number) => {
  //         return i === sections.length - 1
  //       }
  //       let outputToken
  //       let inputToken = inputAmount.currency.wrapped
  //       for (let i = 0; i < sections.length; i++) {
  //         const section = sections[i]
  //         /// Now, we get output of this section
  //         outputToken = getOutputOfPools(section, inputToken)
  //         const newRoute = buildBaseRoute([...section], inputToken, outputToken)
  //         /// Previous output is now input
  //         inputToken = outputToken.wrapped
  //         const lastSectionInRoute = isLastSectionInRoute(i)
  //         // By default router holds funds until the last swap, then it is sent to the recipient
  //         // special case exists where we are unwrapping WETH output, in which case `routerMustCustody` is set to true
  //         // and router still holds the funds. That logic bundled into how the value of `recipient` is calculated
  //         const recipientAddress = lastSectionInRoute ? recipient : ADDRESS_THIS
  //         const inAmount = i === 0 ? amountIn : BigInt(0)
  //         const outAmount = !lastSectionInRoute ? BigInt(0) : amountOut
  //         if (mixedRouteIsAllV3(newRoute)) {
  //           const pathStr = encodeMixedRouteToPath(newRoute, !isExactIn, true)
  //           if (isExactIn) {
  //             const exactInputParams = {
  //               path: pathStr,
  //               recipient: recipientAddress,
  //               amountIn: inAmount,
  //               amountOutMinimum: outAmount,
  //             }
  //             calldatas.push(
  //               encodeFunctionData({
  //                 abi: SwapRouter.ABI,
  //                 functionName: 'exactInput',
  //                 args: [exactInputParams],
  //               }),
  //             )
  //           } else {
  //             const exactOutputParams = {
  //               path: pathStr,
  //               recipient,
  //               amountOut: outAmount,
  //               amountInMaximum: inAmount,
  //             }
  //             calldatas.push(
  //               encodeFunctionData({
  //                 abi: SwapRouter.ABI,
  //                 functionName: 'exactOutput',
  //                 args: [exactOutputParams],
  //               }),
  //             )
  //           }
  //         } else if (mixedRouteIsAllV2(newRoute)) {
  //           const path = []
  //           for (let i = 0; i <= newRoute.path.length - 2; i++) {
  //             const token = newRoute.path[i]
  //             const nextToken = newRoute.path[i + 1]
  //             path.push({
  //               from: token.wrapped.address as Address,
  //               to: nextToken.wrapped.address as Address,
  //               stable: newRoute.pools[path.length].type === PoolType.STABLE
  //             })
  //           }
  //           if (isExactIn) {
  //             const exactInputParams = [
  //               inAmount, // amountIn
  //               outAmount, // amountOutMin
  //               path, // path
  //               recipientAddress, // to
  //             ] as const
  //             calldatas.push(
  //               encodeFunctionData({
  //                 abi: SwapRouter.ABI,
  //                 functionName: 'swapExactTokensForTokens',
  //                 args: exactInputParams,
  //               }),
  //             )
  //           } else {
  //             const exactOutputParams = [inAmount, outAmount, path, recipientAddress] as const
  //             calldatas.push(
  //               encodeFunctionData({
  //                 abi: SwapRouter.ABI,
  //                 functionName: 'swapExactTokensForTokens',
  //                 args: exactOutputParams,
  //               }),
  //             )
  //           }
  //         } else {
  //           throw new Error('Unsupported route')
  //         }
  //       }
  //     }
  //   }
  //   return calldatas
  // }
  static encodeSwaps(anyTrade, options) {
    const trades = !Array.isArray(anyTrade) ? [anyTrade] : anyTrade;
    trades.reduce((numOfTrades, trade) => numOfTrades + trade.routes.length, 0);
    const sampleTrade = trades[0];
    invariant5__default.default(
      trades.every((trade) => trade.inputAmount.currency.equals(sampleTrade.inputAmount.currency)),
      "TOKEN_IN_DIFF"
    );
    invariant5__default.default(
      trades.every((trade) => trade.outputAmount.currency.equals(sampleTrade.outputAmount.currency)),
      "TOKEN_OUT_DIFF"
    );
    invariant5__default.default(
      trades.every((trade) => trade.tradeType === sampleTrade.tradeType),
      "TRADE_TYPE_DIFF"
    );
    const calldatas = [];
    const inputIsNative = sampleTrade.inputAmount.currency.isNative;
    const outputIsNative = sampleTrade.outputAmount.currency.isNative;
    const routerMustCustody = outputIsNative || !!options.fee;
    if (options.inputTokenPermit) {
      invariant5__default.default(sampleTrade.inputAmount.currency.isToken, "NON_TOKEN_PERMIT");
      calldatas.push(v3Sdk.SelfPermit.encodePermit(sampleTrade.inputAmount.currency, options.inputTokenPermit));
    }
    for (const trade of trades) {
      if (trade.routes.length === 1 && trade.routes[0].type === 0 /* V2 */) ; else if (trade.routes.every((r) => r.type === 1 /* V3 */)) {
        for (const calldata of _SwapRouter.encodeV3Swap(
          trade,
          options,
          routerMustCustody
        )) {
          calldatas.push(calldata);
        }
      } else ;
    }
    const ZERO_IN = sdk.CurrencyAmount.fromRawAmount(sampleTrade.inputAmount.currency, 0);
    const ZERO_OUT = sdk.CurrencyAmount.fromRawAmount(sampleTrade.outputAmount.currency, 0);
    const minAmountOut = trades.reduce(
      (sum2, trade) => sum2.add(minimumAmountOutBN(trade, options.slippageTolerance)),
      ZERO_OUT
    );
    const quoteAmountOut = trades.reduce(
      (sum2, trade) => sum2.add(sdk.CurrencyAmount.fromRawAmount(trade.outputAmount.currency, trade.outputAmount.quotient.toString())),
      ZERO_OUT
    );
    const totalAmountIn = trades.reduce(
      (sum2, trade) => sum2.add(maximumAmountInBN(trade, options.slippageTolerance)),
      ZERO_IN
    );
    return {
      calldatas,
      sampleTrade,
      routerMustCustody,
      inputIsNative,
      outputIsNative,
      totalAmountIn,
      minimumAmountOut: minAmountOut,
      quoteAmountOut
    };
  }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  static swapCallParameters(trades, options) {
    const {
      calldatas,
      sampleTrade,
      routerMustCustody,
      inputIsNative,
      outputIsNative,
      totalAmountIn,
      minimumAmountOut: minAmountOut
    } = _SwapRouter.encodeSwaps(trades, options);
    if (routerMustCustody) {
      if (outputIsNative) {
        calldatas.push(PaymentsExtended.encodeUnwrapWETH9(minAmountOut.quotient, options.recipient, options.fee));
      } else {
        calldatas.push(
          PaymentsExtended.encodeSweepToken(
            sampleTrade.outputAmount.currency.wrapped,
            minAmountOut.quotient,
            options.recipient,
            options.fee
          )
        );
      }
    }
    if (inputIsNative && (sampleTrade.tradeType === sdk.TradeType.EXACT_OUTPUT || _SwapRouter.riskOfPartialFill(trades))) {
      calldatas.push(viem.encodeFunctionData({ abi: PaymentsExtended.ABI, functionName: "refundNativeToken" }));
    }
    return {
      calldata: MulticallExtended.encodeMulticall(calldatas),
      value: v3Sdk.toHex(inputIsNative ? totalAmountIn.quotient : ZERO8)
    };
  }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trades to produce call parameters for
   * @param options options for the call parameters
   */
  static swapAndAddCallParameters(trades, options, position, addLiquidityOptions, tokenInApprovalType, tokenOutApprovalType) {
    const {
      calldatas,
      inputIsNative,
      outputIsNative,
      sampleTrade,
      totalAmountIn: totalAmountSwapped,
      quoteAmountOut,
      minimumAmountOut: minAmountOut
    } = _SwapRouter.encodeSwaps(trades, options);
    if (options.outputTokenPermit) {
      invariant5__default.default(quoteAmountOut.currency.isToken, "NON_TOKEN_PERMIT_OUTPUT");
      calldatas.push(v3Sdk.SelfPermit.encodePermit(quoteAmountOut.currency, options.outputTokenPermit));
    }
    const zeroForOne = position.pool.token0.wrapped.address === totalAmountSwapped.currency.wrapped.address;
    const { positionAmountIn, positionAmountOut } = _SwapRouter.getPositionAmounts(position, zeroForOne);
    const tokenIn = inputIsNative ? baseSepoliaTokens.weth : positionAmountIn.currency.wrapped;
    const tokenOut = outputIsNative ? baseSepoliaTokens.weth : positionAmountOut.currency.wrapped;
    const amountOutRemaining = positionAmountOut.subtract(quoteAmountOut.wrapped);
    if (amountOutRemaining.greaterThan(sdk.CurrencyAmount.fromRawAmount(positionAmountOut.currency, 0))) {
      if (outputIsNative) {
        calldatas.push(PaymentsExtended.encodeWrapETH(amountOutRemaining.quotient));
      } else {
        calldatas.push(PaymentsExtended.encodePull(tokenOut, amountOutRemaining.quotient));
      }
    }
    if (inputIsNative) {
      calldatas.push(PaymentsExtended.encodeWrapETH(positionAmountIn.quotient));
    } else {
      calldatas.push(PaymentsExtended.encodePull(tokenIn, positionAmountIn.quotient));
    }
    if (tokenInApprovalType !== 0 /* NOT_REQUIRED */)
      calldatas.push(ApproveAndCall.encodeApprove(tokenIn, tokenInApprovalType));
    if (tokenOutApprovalType !== 0 /* NOT_REQUIRED */)
      calldatas.push(ApproveAndCall.encodeApprove(tokenOut, tokenOutApprovalType));
    const minimalPosition = v3Sdk.Position.fromAmounts({
      pool: position.pool,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      amount0: zeroForOne ? position.amount0.quotient.toString() : minAmountOut.quotient.toString(),
      amount1: zeroForOne ? minAmountOut.quotient.toString() : position.amount1.quotient.toString(),
      useFullPrecision: false
    });
    const slippageBn = new sdk.Percent(BigInt(options.slippageTolerance.numerator.toString()), BigInt(options.slippageTolerance.denominator.toString()));
    calldatas.push(
      ApproveAndCall.encodeAddLiquidity(position, minimalPosition, addLiquidityOptions, slippageBn)
    );
    if (inputIsNative) {
      calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO8));
    } else {
      calldatas.push(PaymentsExtended.encodeSweepToken(tokenIn, ZERO8));
    }
    if (outputIsNative) {
      calldatas.push(PaymentsExtended.encodeUnwrapWETH9(ZERO8));
    } else {
      calldatas.push(PaymentsExtended.encodeSweepToken(tokenOut, ZERO8));
    }
    let value;
    if (inputIsNative) {
      value = totalAmountSwapped.wrapped.add(positionAmountIn.wrapped).quotient;
    } else if (outputIsNative) {
      value = amountOutRemaining.quotient;
    } else {
      value = ZERO8;
    }
    return {
      calldata: MulticallExtended.encodeMulticall(calldatas, options.deadlineOrPreviousBlockhash),
      value: v3Sdk.toHex(value.toString())
    };
  }
  // if price impact is very high, there's a chance of hitting max/min prices resulting in a partial fill of the swap
  static riskOfPartialFill(trades) {
    if (Array.isArray(trades)) {
      return trades.some((trade) => {
        return _SwapRouter.v3TradeWithHighPriceImpact(trade);
      });
    }
    return _SwapRouter.v3TradeWithHighPriceImpact(trades);
  }
  static v3TradeWithHighPriceImpact(trade) {
    return !(trade.routes.length === 1 && trade.routes[0].type === 0 /* V2 */) && getPriceImpact(trade).greaterThan(REFUND_ETH_PRICE_IMPACT_THRESHOLD);
  }
  static getPositionAmounts(position, zeroForOne) {
    const { amount0, amount1 } = position.mintAmounts;
    const currencyAmount0 = sdk.CurrencyAmount.fromRawAmount(position.pool.token0, amount0);
    const currencyAmount1 = sdk.CurrencyAmount.fromRawAmount(position.pool.token1, amount1);
    const [positionAmountIn, positionAmountOut] = zeroForOne ? [currencyAmount0, currencyAmount1] : [currencyAmount1, currencyAmount0];
    return { positionAmountIn, positionAmountOut };
  }
};
var SwapRouter = _SwapRouter;
SwapRouter.ABI = algebraRouterABI;

exports.ADDITIONAL_BASES = ADDITIONAL_BASES;
exports.ADDRESS_THIS = ADDRESS_THIS;
exports.BASES_TO_CHECK_TRADES_AGAINST = BASES_TO_CHECK_TRADES_AGAINST;
exports.BASE_SWAP_COST_STABLE_SWAP = BASE_SWAP_COST_STABLE_SWAP;
exports.BASE_SWAP_COST_V2 = BASE_SWAP_COST_V2;
exports.BASE_SWAP_COST_V3 = BASE_SWAP_COST_V3;
exports.BATCH_MULTICALL_CONFIGS = BATCH_MULTICALL_CONFIGS;
exports.BETTER_TRADE_LESS_HOPS_THRESHOLD = BETTER_TRADE_LESS_HOPS_THRESHOLD;
exports.BIG_INT_TEN = BIG_INT_TEN;
exports.BIPS_BASE = BIPS_BASE;
exports.COST_PER_EXTRA_HOP_STABLE_SWAP = COST_PER_EXTRA_HOP_STABLE_SWAP;
exports.COST_PER_EXTRA_HOP_V2 = COST_PER_EXTRA_HOP_V2;
exports.COST_PER_HOP_V3 = COST_PER_HOP_V3;
exports.COST_PER_INIT_TICK = COST_PER_INIT_TICK;
exports.COST_PER_UNINIT_TICK = COST_PER_UNINIT_TICK;
exports.CUSTOM_BASES = CUSTOM_BASES;
exports.MIN_BNB = MIN_BNB;
exports.MIXED_ROUTE_QUOTER_ADDRESSES = MIXED_ROUTE_QUOTER_ADDRESSES;
exports.MSG_SENDER = MSG_SENDER;
exports.PoolType = PoolType;
exports.RouteType = RouteType;
exports.SMART_ROUTER_ADDRESSES = SMART_ROUTER_ADDRESSES;
exports.SmartRouter = smartRouter_exports;
exports.StableSwap = stableSwap_exports;
exports.SwapRouter = SwapRouter;
exports.Transformer = transformer_exports;
exports.V2_FEE_PATH_PLACEHOLDER = V2_FEE_PATH_PLACEHOLDER;
exports.V3_QUOTER_ADDRESSES = V3_QUOTER_ADDRESSES;
exports.getStableSwapPools = getStableSwapPools;
exports.isStableSwapSupported = isStableSwapSupported;
exports.usdGasTokensByChain = usdGasTokensByChain;
