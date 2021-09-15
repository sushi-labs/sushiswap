const BENSWAP_ROUTER = new Map()
BENSWAP_ROUTER.set("10000", "0xa194133ED572D86fe27796F2feADBAFc062cB9E0")
BENSWAP_ROUTER.set("10001", "0x221C2c57B0dAec7aF9A3B03c384c0C99e066b612")

module.exports = async function ({ getNamedAccounts, getChainId, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  if (!BENSWAP_ROUTER.has(chainId)) {
    throw Error("No Uniswap Router")
  }

  const benswapRouterAddress = BENSWAP_ROUTER.get(chainId)

  const sushiswapRouterAddress = (await deployments.get("UniswapV2Router02")).address

  await deploy("SushiRoll", {
    from: deployer,
    args: [benswapRouterAddress, sushiswapRouterAddress],
    log: true,
    deterministicDeployment: false
  })
}

module.exports.tags = ["SushiRoll"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
