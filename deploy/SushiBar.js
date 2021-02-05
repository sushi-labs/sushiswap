module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const sushi = await deployments.get("SushiToken")

  // console.log("SUSHI", sushi)

  await deploy("SushiBar", {
    from: deployer,
    args: [sushi.address],
    log: true,
    deterministicDeployment: true,
  })
}

module.exports.tags = ["SushiBar"]
module.exports.dependencies = ["SushiToken"]
