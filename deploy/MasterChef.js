module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const sushi = await deployments.get("SushiToken")

  console.log("Deploying Master Chef", deployer)
  
  const { address, newlyDeployed } = await deploy("MasterChef", {
    from: deployer,
    args: [sushi.address, dev, "1000000000000000000000", "0", "1000000000000000000000"],
    log: true,
    deterministicDeployment: false,
    gasLimit: 5198000,
  })

  if (newlyDeployed) {
    const sushi = await ethers.getContract("SushiToken")

    // Transfer Sushi Ownership to Chef
    await (await sushi.transferOwnership(address, { gasLimit: 5198000 })).wait()

    // Transfer ownership of MasterChef to dev
    const masterChef = await ethers.getContract("MasterChef")
    await (await masterChef.transferOwnership(dev, { gasLimit: 5198000 })).wait()
  }

  console.log("Master Chef Deployed")
}

module.exports.tags = ["MasterChef"]
module.exports.dependencies = ["UniswapV2Factory", "SushiToken"]
