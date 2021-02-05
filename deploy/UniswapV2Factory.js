module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer, alice } = await getNamedAccounts()

  await deploy("UniswapV2Factory", {
    from: deployer,
    args: [alice],
    log: true,
    deterministicDeployment: true,
  })
}

module.exports.tags = ["UniswapV2Factory"]
