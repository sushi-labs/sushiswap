import { JsonRpcProvider } from '@ethersproject/providers'
import { BENTOBOX_ADDRESS, ChainId } from '@sushiswap/core-sdk'
import { Contract, Signer, utils, Wallet } from 'ethers'

import { ADDRESSES } from '../constants/Index'

export class BentoHelper {
  private Signer!: Signer
  private Provider!: JsonRpcProvider
  private BentoContract!: Contract

  constructor() {
    this.Provider = new JsonRpcProvider(process.env.INFURA_URL)

    // @ts-ignore TYPE NEEDS FIXING
    const signer = new Wallet(process.env.TEST_PKEY, this.Provider)
    this.Signer = signer

    const balanceOfFunction = ['function balanceOf(address, address) public view returns (uint256)']
    this.BentoContract = new Contract(BENTOBOX_ADDRESS[ChainId.KOVAN], balanceOfFunction, this.Signer)
  }

  public async getBentoBalance(tokenSymbol: string): Promise<number> {
    // @ts-ignore TYPE NEEDS FIXING
    const tokenAddress = ADDRESSES[tokenSymbol]

    const address = await this.Signer.getAddress()
    const balance = await this.BentoContract.balanceOf(tokenAddress, address)

    const balanceFormatted = utils.formatEther(balance.toString())

    return parseFloat(balanceFormatted)
  }
}
