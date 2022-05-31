import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract, Signer, Wallet } from 'ethers'

import { ADDRESSES } from '../constants/Index'

export class ApprovalHelper {
  private Signer!: Signer
  private Provider!: JsonRpcProvider

  constructor() {
    this.Provider = new JsonRpcProvider(process.env.INFURA_URL)

    // @ts-ignore TYPE NEEDS FIXING
    const signer = new Wallet(process.env.TEST_PKEY, this.Provider)
    this.Signer = signer
  }

  public async approveRouter(tokenAddress: string, amount: number): Promise<void> {
    const approveFunction = ['function approve(address, uint256) external returns (bool)']
    const tokenContract = new Contract(tokenAddress, approveFunction, this.Signer)

    const tridentApproveTx = await tokenContract.approve(ADDRESSES.TRIDENT_ROUTER, amount)
    await tridentApproveTx.wait()

    const legacyApproveTx = await tokenContract.approve(ADDRESSES.LEGACY_ROUTER, amount)
    await legacyApproveTx.wait()
  }
}
