import { TradeType } from '@pancakeswap/sdk';
import { ChainId } from '../chains/src';
import { z } from 'zod';
import { PoolType } from './types';
export declare const zPools: z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
export declare const zRouterGetParams: z.ZodObject<{
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
export declare const zRouterPostParams: z.ZodObject<{
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
export type RouterPostParams = z.infer<typeof zRouterPostParams>;
export type RouterGetParams = z.infer<typeof zRouterGetParams>;
export type SerializedPools = z.infer<typeof zPools>;
//# sourceMappingURL=schema.d.ts.map