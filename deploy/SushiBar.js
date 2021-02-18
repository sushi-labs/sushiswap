module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const sushi = await deployments.get("SushiToken")

  // console.log("SUSHI", sushi)

  await deploy("SushiBar", {
    from: deployer,
    args: [sushi.address],
    log: true,
    deterministicDeployment: false,
    gasLimit: 5198000,
  })
}

module.exports.tags = ["SushiBar"]
module.exports.dependencies = ["UniswapV2Factory", "SushiToken"]
