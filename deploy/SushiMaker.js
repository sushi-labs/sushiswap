const DEFAULT_WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
const ROPSTEN_WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab"

const WETH_MAP = new Map()
WETH_MAP.set("1", DEFAULT_WETH)
WETH_MAP.set("3", ROPSTEN_WETH)

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  const factory = await deployments.get("UniswapV2Factory")
  const bar = await deployments.get("SushiBar")
  const sushi = await deployments.get("SushiToken")

  console.log("HAS WETH IN MAP?", WETH_MAP.has(chainId), chainId)

  const wethAddress = WETH_MAP.has(chainId) ? WETH_MAP.get(chainId) : (await deployments.get("WETH9Mock")).address

  await deploy("SushiMaker", {
    from: deployer,
    args: [factory.address, bar.address, sushi.address, wethAddress],
    log: true,
  })
}

module.exports.tags = ["SushiMaker"]
module.exports.dependencies = ["UniswapV2Factory", "SushiBar", "SushiToken"]
