module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()
  const [ deployerSigner, devSigner ] = await ethers.getSigners()

  const delay = 259200; // 3 days
  const { address } = await deploy("Timelock", {
    from: deployer,
    args: [dev, delay],
    log: true,
    deterministicDeployment: false
  })

  const txOptions = {
    gasPrice: 1050000000,
    gasLimit: 5000000,
    from: dev,
  }

  const masterChef = await ethers.getContract("MasterChef")
  if (await masterChef.owner() !== address) {
    // Transfer ownership of MasterChef to Timelock
    console.log("Transfer ownership of MasterChef to Timelock")
    await (await masterChef.connect(devSigner).transferOwnership(address, txOptions)).wait()
  }
}

module.exports.tags = ["TimeLock"]
module.exports.dependencies = ["MasterChef"]
