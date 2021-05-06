module.exports = async function ({ deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  await deploy("WETH9Mock", {
    from: deployer,
    log: true,
    deterministicDeployment: false
  })
}

// module.exports.skip = ({ getChainId }) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const chainId = await getChainId()
//       resolve(chainId !== "31337")
//     } catch (error) {
//       reject(error)
//     }
//   })

// module.exports.tags = ["test"]
module.exports.tags = ["WETH9Mock"]
