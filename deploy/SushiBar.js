module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const sushi = await deployments.get("SushiToken")

  await deploy("SushiBar", {
    from: deployer,
    args: [sushi],
    log: true,
  })
}

module.exports.tags = ["SushiBar"]
module.exports.dependencies = ["SushiToken"]