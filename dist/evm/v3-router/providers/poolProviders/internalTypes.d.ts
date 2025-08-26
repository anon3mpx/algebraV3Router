import { Currency } from "@pancakeswap/sdk";
import { Address } from "viem";
export interface PoolMeta {
    currencyA: Currency;
    currencyB: Currency;
    address: Address;
}
export interface V3PoolMeta extends PoolMeta {
    fee: number;
    deployer: Address;
}
//# sourceMappingURL=internalTypes.d.ts.map