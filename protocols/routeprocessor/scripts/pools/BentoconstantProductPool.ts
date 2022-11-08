import { ConstantProductRPool, MultiRoute, RouteLeg } from "@sushiswap/tines";
import { ethers } from "hardhat";
import { HEXer } from "../HEXer";
import { PoolCode } from "./PoolCode";

export class BentoConstantProductPoolCode extends PoolCode {
  constructor(pool: ConstantProductRPool, providerName: string) {
    super(pool, `${providerName} ${pool.fee*100}%`)
  }

  getSwapCodeForRouteProcessor(leg: RouteLeg, route: MultiRoute, to: string): string {
    const coder = new ethers.utils.AbiCoder()
    // TODO: add unwrap bento = true variant 
    // address tokenIn, address recipient, bool unwrapBento
    const poolData = coder.encode(["address", "address", "bool"], [leg.tokenFrom.address, to, false])
    const code = new HEXer()
      .uint8(21)    // swapTrident
      .address(leg.poolAddress)
      .bytes(poolData)
      .toString()
      
    return code
  }
}