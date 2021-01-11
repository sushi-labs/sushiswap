module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const factory = await deployments.get("UniswapV2Factory")
  const bar = await deployments.get("SushiBar")
  const sushi = await deployments.get("SushiToken")

  await deploy("SushiMaker", {
    from: deployer,
    args: [factory, bar, sushi],
    log: true,
  })
}

module.exports.tags = ["SushiMaker"]
module.exports.dependencies = ["UniswapV2Factory", "SushiBar", "SushiToken"]
