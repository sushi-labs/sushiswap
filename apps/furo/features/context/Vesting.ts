import { BigNumber } from 'ethers'
import { Furo } from './Furo'
import { VestingRepresentation } from './representations'

export class Vesting extends Furo {
  public readonly steps: BigNumber
  public readonly cliffAmount: BigNumber
  public readonly stepAmount: BigNumber
  public readonly cliffDuration: number
  public readonly stepDuration: number

  public constructor({ vesting }: { vesting: VestingRepresentation }) {
    super({ furo: vesting })
    this.steps = BigNumber.from(vesting.steps)
    this.cliffAmount = BigNumber.from(vesting.cliffAmount)
    this.stepAmount = BigNumber.from(vesting.stepAmount)
    this.cliffDuration = parseInt(vesting.cliffDuration)
  }
}
