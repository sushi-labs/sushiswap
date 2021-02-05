module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const { address } = await deploy("SushiToken", {
    from: deployer,
    log: true,
    deterministicDeployment: false,
  })

  console.log(`SUSHI token deployed at ${address}`)
}

module.exports.tags = ["SushiToken"]
