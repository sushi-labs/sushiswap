import { ChainId, chainName } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { ethers } from 'hardhat'

import { BentoBox } from '../scripts/liquidityProviders/Trident'

const chainId = parseInt(process.argv[2]) as ChainId
console.log(`Deployment code for network ${chainName[chainId]} (${chainId})`)
console.log('BentoBox: ', BentoBox[chainId])
console.log('WNATIVE:', WNATIVE_ADDRESS[chainId])

if (WNATIVE_ADDRESS[chainId] === undefined) {
  console.log("Can't geerate code: Unknown chain !!!")
} else getCode()

async function getCode() {
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor')
  const deplTrans = RouteProcessor.getDeployTransaction(
    BentoBox[chainId] || '0x0000000000000000000000000000000000000000',
    WNATIVE_ADDRESS[chainId]
  )
  console.log(deplTrans.data)
}
