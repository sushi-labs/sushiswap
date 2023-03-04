import { BENTOBOX_ADDRESS } from '@sushiswap/address'
import { ChainId, chainName } from '@sushiswap/chain'
import { ethers } from 'hardhat'

const chainId = parseInt(process.argv[2]) as ChainId
console.log(`Deployment code for network ${chainName[chainId]} (${chainId})`)
console.log('BentoBox: ', BENTOBOX_ADDRESS[chainId])

getCode()

async function getCode() {
  const RouteProcessor = await ethers.getContractFactory('RouteProcessor2')
  const deplTrans = RouteProcessor.getDeployTransaction(
    BENTOBOX_ADDRESS[chainId] || '0x0000000000000000000000000000000000000000'
  )
  console.log(deplTrans.data)
}
