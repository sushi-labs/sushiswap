module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
  
    const { deployer, dev } = await getNamedAccounts()
  
    await deploy("ERC20Mock", {
      from: deployer,
      args: ["Mintage USD", "mUSD", "10000000000000000000000000000000"],
      log: true,
      deterministicDeployment: false
    })
  }

  module.exports.tags = ["ERC20Mock"]
  