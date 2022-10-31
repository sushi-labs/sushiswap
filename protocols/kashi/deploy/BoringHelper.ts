import { ChainId } from '@sushiswap/chain'
import { WBTC_ADDRESS, WETH9_ADDRESS } from '@sushiswap/currency'
import type { HardhatRuntimeEnvironment } from 'hardhat/types'
import type { DeployFunction } from 'hardhat-deploy/types'

const ParametersPerChain = {
  [ChainId.AURORA]: {
    chef: '0x0000000000000000000000000000000000000000',
    maker: '0x0000000000000000000000000000000000000000',
    sushi: '0xFa94348467f64D5A457F75F8bc40495D33c65aBB',
    WETH: WETH9_ADDRESS[ChainId.AURORA],
    WBTC: WBTC_ADDRESS[ChainId.AURORA],
    sushiFactory: '0xc66F594268041dB60507F00703b152492fb176E7',
    uniV2Factory: '0x0000000000000000000000000000000000000000',
    bar: '0x0000000000000000000000000000000000000000',
    bentoBox: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
}

const deployFunction: DeployFunction = async function ({
  deployments,
  getChainId,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const chainId = parseInt(await getChainId())
  // @ts-ignore
  const parameters = ParametersPerChain[chainId]
  const { deployer } = await getNamedAccounts()

  if (!(chainId in WETH9_ADDRESS)) {
    throw Error(`No WETH9_ADDRESS for chain #${chainId}!`)
  }
  if (!(chainId in WBTC_ADDRESS)) {
    throw Error(`No WBTC_ADDRESS for chain #${chainId}!`)
  }

  await deploy('BoringHelperV1', {
    from: deployer,
    args: [
      parameters.chef,
      parameters.maker,
      parameters.sushi,
      parameters.WETH,
      parameters.WBTC,
      parameters.sushiFactory,
      parameters.uniV2Factory,
      parameters.bar,
      parameters.bentoBox,
    ],
    log: true,
    deterministicDeployment: false,
  })
}

export default deployFunction

deployFunction.dependencies = ['BentoBoxV1']

deployFunction.tags = ['BoringHelperV1']
