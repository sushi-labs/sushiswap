module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments
  
    const { deployer, dev } = await getNamedAccounts()
  
    await deploy("Timelock", {
        from: deployer,
        args: [dev, 172800],
        log: true,
        deterministicDeployment: false
    })
  }
  
  module.exports.tags = ["Timelock"]
  