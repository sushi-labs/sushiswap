import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ChainId, chainName } from '@sushiswap/chain'
import {
  Native,
  SUSHI,
  SUSHI_ADDRESS,
  Token,
  Type,
} from '@sushiswap/currency'
import {
  getCurrencyCombinations,
  LiquidityProviders,
} from '@sushiswap/router'
import {
  RToken,
} from '@sushiswap/tines'
import { expect } from 'chai'
import { Contract } from 'ethers'
import { ethers, network } from 'hardhat'

import { TestDataFetcher } from './TestDataFetcher'


interface TestEnvironment {
  chainId: ChainId
  provider: any
  rp: Contract
  user: SignerWithAddress
  user2: SignerWithAddress

}

async function getTestEnvironment(): Promise<TestEnvironment> {

  const provider = ethers.provider
  const chainId = network.config.chainId as ChainId

  console.log('Prepare Environment, chainId:', chainId)

  const RouteProcessor = await ethers.getContractFactory('RouteProcessor')
  const routeProcessor = await RouteProcessor.deploy(bentoBoxV1Address[chainId as BentoBoxV1ChainId])
  await routeProcessor.deployed()

  console.log(`Network: ${chainName[chainId]}, Forked Block: ${provider.blockNumber}`)

  const [Alice] = await ethers.getSigners()
  return {
    chainId,
    provider,
    rp: routeProcessor,
    user: Alice,
    user2: await ethers.getSigner('0xbc4a6be1285893630d45c881c6c343a65fdbe278'),
  }
}


describe('Get pools', async function () {
  let env: TestEnvironment
  let currency0: Type
  let currency1: Type
  before (async function () {

   env = await getTestEnvironment()
  
   currency0 = Native.onChain(env.chainId)
   currency1 = SUSHI[env.chainId as keyof typeof SUSHI]
  })

  it.skip('V2', async function () {
    const currencyCombination = getCurrencyCombinations(env.chainId, currency0, currency1)
    const poolCodeMap = await TestDataFetcher.getPairs(
      env.chainId,
      env.provider,
      LiquidityProviders.SushiSwap,
      currencyCombination
    )
    console.log("V2 pools found:", poolCodeMap.size)
    
    expect(poolCodeMap.size).equal(35)
  })


  it('TRIDENT', async function () {
    const currencyCombination = getCurrencyCombinations(env.chainId, currency0, currency1)
    const poolCodeMap = await TestDataFetcher.getPairs(
      env.chainId,
      env.provider,
      LiquidityProviders.Trident,
      currencyCombination
    )
    console.log("TRIDENT pools found:", poolCodeMap.size)
    // console.log("TRIDENT pools:", Array.from(poolCodeMap.values()).map((p) => `${p.pool.reserve0} ${p.pool.reserve1}`))
    
    expect(poolCodeMap.size).equal(21)
  })

})