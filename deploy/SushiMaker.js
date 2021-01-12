module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const factory = await deployments.get("UniswapV2Factory")
  const bar = await deployments.get("SushiBar")
  const sushi = await deployments.get("SushiToken")
  const weth = await deployments.get("WETH9Mock")

  await deploy("SushiMaker", {
    from: deployer,
    args: [factory.address, bar.address, sushi.address, weth.address],
    log: true,
  })
}

module.exports.tags = ["SushiMaker"]
module.exports.dependencies = ["UniswapV2Factory", "SushiBar", "SushiToken"]
