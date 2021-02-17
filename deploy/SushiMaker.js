const WETH = {
  "1": '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  "3": "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  "4": "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  "5": "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  "42": "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  "1287": "0x1Ff68A3621C17a38E689E5332Efcab9e6bE88b5D",
  "79377087078960": "0xf8456e5e6A225C2C1D74D8C9a4cB2B1d5dc1153b"
}

module.exports = async function ({ ethers, getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer, dev } = await getNamedAccounts()

  const chainId = await getChainId()

  const factory = await ethers.getContract("UniswapV2Factory")
  const bar = await ethers.getContract("SushiBar")
  const sushi = await ethers.getContract("SushiToken")
  const wethAddress = chainId in WETH ? WETH[chainId] : (await deployments.get("WETH9Mock")).address

  const { address, newlyDeployed } = await deploy("SushiMaker", {
    from: deployer,
    args: [factory.address, bar.address, sushi.address, wethAddress],
    log: true,
    deterministicDeployment: false,
    gasLimit: 5198000,
  })

  if (newlyDeployed) {
    // Transfer ownership of SushiMaker to dev
    const maker = await ethers.getContract("SushiMaker")
    console.log("Setting maker owner")
    await (await maker.transferOwnership(dev, true, false, { gasLimit: 5198000 })).wait()

    // Set FeeTo to maker
    console.log("Setting factory feeTo to maker address")
    await (await factory.setFeeTo(address, { gasLimit: 5198000 })).wait()
  }
}

module.exports.tags = ["SushiMaker"]
module.exports.dependencies = ["UniswapV2Factory", "SushiBar", "SushiToken"]
