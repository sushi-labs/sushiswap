import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { chainName } from '@sushiswap/chain'
import { ethers } from 'hardhat'

const chainId = parseInt(process.argv[2]) as BentoBoxV1ChainId
console.log(`Deployment code for network ${chainName[chainId]} (${chainId})`)
console.log('BentoBox: ', bentoBoxV1Address[chainId])

getCode()

async function getCode() {
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor3')
  const deplTrans = RouteProcessor.getDeployTransaction(
    bentoBoxV1Address[chainId] || '0x0000000000000000000000000000000000000000'
  )
  console.log(deplTrans.data)
}
