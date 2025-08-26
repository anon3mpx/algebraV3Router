import { Address } from 'viem';
import { Percent, TradeType } from '@pancakeswap/sdk';
import { FeeOptions, MethodParameters, PermitOptions, Position } from '@pancakeswap/v3-sdk';
import { Percent as PercentJSBI } from '@cryptoalgebra/custom-pools-sdk';
import { SmartRouterTrade } from '../types';
import { Validation } from './multicallExtended';
import { ApprovalTypes, CondensedAddLiquidityOptions } from './approveAndCall';
/**
 * Options for producing the arguments to send calls to the router.
 */
export interface SwapOptions {
    /**
     * How much the execution price is allowed to move unfavorably from the trade execution price.
     */
    slippageTolerance: Percent | PercentJSBI;
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
export interface SwapAndAddOptions extends SwapOptions {
    /**
     * The optional permit parameters for pulling in remaining output token.
     */
    outputTokenPermit?: PermitOptions;
}
type AnyTradeType = SmartRouterTrade<TradeType> | SmartRouterTrade<TradeType>[];
/**
 * Represents the Pancakeswap V2 + V3 + StableSwap SwapRouter02, and has static methods for helping execute trades.
 */
export declare abstract class SwapRouter {
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
export {};
//# sourceMappingURL=swapRouter.d.ts.map