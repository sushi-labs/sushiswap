module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const sushi = await ethers.getContract("SushiToken")
  const erc20 = await ethers.getContract("ERC20Mock")
  
  const { address } = await deploy("MasterChef", {
    from: deployer,
    args: [sushi.address, dev, "1000000000000000000000", "0", "1000000000000000000000"],
    log: true,
    deterministicDeployment: false
  })

  if (await sushi.owner() === deployer) {
    // Mint Sushi
    console.log("Mint Sushi")
    await (await sushi.mint(deployer, "1000000000000000000000", {from: deployer})).wait()
    await (await sushi.mint(dev, "1000000000000000000000", {from: deployer})).wait()
  }

  if (await sushi.owner() !== address) {
    // Transfer Sushi Ownership to Chef
    console.log("Transfer Sushi Ownership to Chef")
    await (await sushi.transferOwnership(address)).wait()
  }

  const masterChef = await ethers.getContract("MasterChef")
  if (await masterChef.owner() !== dev) {
    // Transfer ownership of MasterChef to dev
    console.log("Transfer ownership of MasterChef to dev")
    await (await masterChef.transferOwnership(dev)).wait()
  }
}

module.exports.tags = ["MasterChef"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "SushiToken", "ERC20Mock"]
