module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const { address } = await deploy("SushiToken", {
    from: deployer,
    log: true,
    deterministicDeployment: false,
    gasLimit: 5198000,
  })

  console.log(`SUSHI token deployed at ${address}`)
}

module.exports.tags = ["SushiToken"]
module.exports.dependencies = ["UniswapV2Factory"]
