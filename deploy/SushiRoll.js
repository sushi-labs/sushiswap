module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const uniRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

  const sushiRouterAddress = (await deployments.get("UniswapV2Router02")).address

  await deploy("SushiRoll", {
    from: deployer,
    args: [uniRouterAddress, sushiRouterAddress],
    log: true,
    deterministicDeployment: true,
  })
}

module.exports.tags = ["SushiRoll"]
module.exports.dependencies = ["UniswapV2Router02"]