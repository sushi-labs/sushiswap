import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId, chainName } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { ethers } from 'hardhat'

const chainId = parseInt(process.argv[2]) as ChainId

console.log(`Deployment code for network ${chainName[chainId]} (${chainId})`)

if (!(chainId in BENTOBOX_ADDRESS)) throw new Error('BENTOBOX_ADDRESS not found')
if (!(chainId in WNATIVE_ADDRESS)) throw new Error('WNATIVE_ADDRESS not found')

console.log('BentoBox: ', BENTOBOX_ADDRESS[chainId])
console.log('WNATIVE:', WNATIVE_ADDRESS[chainId])

getCode()

async function getCode() {
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor')
  const tx = RouteProcessor.getDeployTransaction(BENTOBOX_ADDRESS[chainId], WNATIVE_ADDRESS[chainId])
  console.log(tx.data)
}
