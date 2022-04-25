import { BigNumber } from "ethers";

export function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
  }
  