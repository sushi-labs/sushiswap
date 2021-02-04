const DEFAULT_WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
const ROPSTEN_WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab"

const WETH_MAP = new Map()
WETH_MAP.set("1", DEFAULT_WETH)
WETH_MAP.set("3", ROPSTEN_WETH)

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  const wethAddress = WETH_MAP.has(chainId) ? WETH_MAP.get(chainId) : (await deployments.get("WETH9Mock")).address

  const factoryAddress = (await deployments.get("UniswapV2Factory")).address

  await deploy("UniswapV2Router02", {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
  })
}

module.exports.tags = ["UniswapV2Router02"]
module.exports.dependencies = ["UniswapV2Factory", "Mocks"]
