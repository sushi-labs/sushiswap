module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const sushi = await deployments.get("SushiToken")

  console.log("Deploying Master Chef", deployer)

  const { address, newlyDeployed } = await deploy("MasterChef", {
    from: deployer,
    args: [sushi.address, dev, "1000", "0", "1000"],
    log: true,
  })

  if (newlyDeployed) {
    const sushi = await ethers.getContract("SushiToken")

    console.log("Owner", await sushi.owner(), "Deployer", deployer)

    // Transfer Sushi Ownership to Chef
    await sushi.transferOwnership(address)
  }

  console.log("Master Chef Deployed")
}

module.exports.tags = ["MasterChef"]
module.exports.dependencies = ["SushiToken"]
