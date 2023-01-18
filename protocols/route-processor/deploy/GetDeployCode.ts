import { ChainId, chainName } from '@sushiswap/chain'
import { BentoBox } from '@sushiswap/router'
import { ethers } from 'hardhat'

const chainId = parseInt(process.argv[2]) as ChainId
console.log(`Deployment code for network ${chainName[chainId]} (${chainId})`)
console.log('BentoBox: ', BentoBox[chainId])

getCode()

async function getCode() {
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor')
  const deplTrans = RouteProcessor.getDeployTransaction(
    BentoBox[chainId] || '0x0000000000000000000000000000000000000000'
  )
  console.log(deplTrans.data)
}
