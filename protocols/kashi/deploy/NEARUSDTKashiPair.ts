import { ChainId } from '@sushiswap/chain'
import { NEAR_ADDRESS, USDT_ADDRESS } from '@sushiswap/currency'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const ParametersPerChain = {
  [ChainId.AURORA]: {
    bentoBox: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    collateral: USDT_ADDRESS[ChainId.AURORA],
    asset: NEAR_ADDRESS[ChainId.AURORA],
    oracle: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    decimals: '1000000000000000000000000000000', // 1e30
  },
}

const deployFunction: DeployFunction = async function ({ deployments, ethers, getChainId }: HardhatRuntimeEnvironment) {
  const { get } = deployments
  const chainId = parseInt(await getChainId())
  // @ts-ignore
  const parameters = ParametersPerChain[chainId]

  const bentoBox = await ethers.getContractAt('BentoBoxV1', parameters.bentoBox)
  const kashiPairMasterContractForNear = await get('KashiPairMediumRiskV1ForNear')

  if (!kashiPairMasterContractForNear) {
    throw Error(`No KashiPair master contract for chain #${chainId}!`)
  }
  if (!(chainId in USDT_ADDRESS)) {
    throw Error(`No USDT_ADDRESS for chain #${chainId}!`)
  }
  if (!(chainId in NEAR_ADDRESS)) {
    throw Error(`No NEAR_ADDRESS for chain #${chainId}!`)
  }

  const NEARUSDFlux = '0x0a9A9cF9bDe10c861Fc1e45aCe4ea097eaa268eD'
  const USDTUSDFlux = '0x5c8C275Bb70C66330F5f60E17530f37a50E6185E'
  const oracleData = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint256'],
    [NEARUSDFlux, USDTUSDFlux, parameters.decimals]
  )

  const initData = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address', 'address', 'bytes'],
    [parameters.collateral, parameters.asset, parameters.oracle, oracleData]
  )

  const tx = await (await bentoBox.deploy(kashiPairMasterContractForNear.address, initData, true)).wait()
  const deployEvent = tx?.events?.[0]
  console.log('NEAR/USDT KashiPair clone', deployEvent?.args?.cloneAddress)
}

export default deployFunction

deployFunction.dependencies = ['KashiPairMediumRiskV1ForNear']

deployFunction.tags = ['NEARUSDTKashiPair']
