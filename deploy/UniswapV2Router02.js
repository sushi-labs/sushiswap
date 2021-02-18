const WETH = {
  "1": '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  "3": "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  "4": "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  "5": "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  "42": "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
  "1287": "0x1Ff68A3621C17a38E689E5332Efcab9e6bE88b5D",
  "79377087078960": "0xf8456e5e6A225C2C1D74D8C9a4cB2B1d5dc1153b"
}

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()

  const wethAddress = chainId in WETH ? WETH[chainId] : (await deployments.get("WETH9Mock")).address

  const factoryAddress = (await deployments.get("UniswapV2Factory")).address

  await deploy("UniswapV2Router02", {
    from: deployer,
    args: [factoryAddress, wethAddress],
    log: true,
    deterministicDeployment: false,
    gasLimit: 5198000,
  })
}

module.exports.tags = ["UniswapV2Router02"]
module.exports.dependencies = ["UniswapV2Factory", "Mocks"]
