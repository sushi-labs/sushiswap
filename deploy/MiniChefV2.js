const { ChainId } = require("@sushiswap/sdk")


const SUSHI = {
  //[ChainId.MATIC]: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
  //[ChainId.RINKEBY]: '0x210177AAE9824141591BF30aE156Bfd906f18B71'
  [ChainId.RINKEBY]: '0x54d9ae2C2ffd3064651D331f1aD3FE7F41594691'
}

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  let sushiAddress;

  console.log('CHAIN ID: ' + chainId);
  console.log(ChainId);

  if (chainId === '31337') {
    sushiAddress = (await deployments.get("SushiToken")).address
  } else if (chainId in SUSHI) {
    sushiAddress = SUSHI[chainId]
  } else {
    throw Error("No SUSHI!")
  }

  await deploy("MiniChefV2", {
    from: deployer,
    args: [sushiAddress],
    log: true,
    deterministicDeployment: false
  })

  const miniChefV2 = await ethers.getContract("MiniChefV2")
  if (await miniChefV2.owner() !== dev) {
    console.log("Transfer ownership of MiniChef to dev")
    await (await miniChefV2.transferOwnership(dev, true, false)).wait()
  }
}

module.exports.tags = ["MiniChefV2"]
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
