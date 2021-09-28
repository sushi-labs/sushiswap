const { WETH9 } = require("@mistswapdex/sdk")

module.exports = async function ({ ethers: { getNamedSigner }, getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  const factory = await ethers.getContract("UniswapV2Factory")
  const bar = await ethers.getContract("SushiBar")
  const sushi = await ethers.getContract("SushiToken")
  
  let wethAddress;
  
  if (chainId === '31337') {
    wethAddress = (await deployments.get("WETH9Mock")).address
  } else if (chainId in WETH9) {
    wethAddress = WETH9[chainId].address
  } else {
    throw Error("No WETH!")
  }

  await deploy("SushiMaker", {
    from: deployer,
    args: [factory.address, bar.address, sushi.address, wethAddress],
    log: true,
    deterministicDeployment: false
  })

  const txOptions = {
    gasPrice: 1050000000,
    gasLimit: 5000000,
  }

  const maker = await ethers.getContract("SushiMaker")
  if (await maker.owner() !== dev) {
    console.log("Setting maker owner")
    await (await maker.transferOwnership(dev, true, false, txOptions)).wait()
  }
}

module.exports.tags = ["SushiMaker"]
module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02", "SushiBar", "SushiToken"]
