const { SUSHI_ADDRESS } = require("@sushiswap/core-sdk");

module.exports = async function ({ ethers, deployments, getNamedAccounts }) {
  const { deploy } = deployments;

  const { deployer, dev } = await getNamedAccounts();

  const chainId = await getChainId();

  let sushiAddress;

  if (chainId === "31337") {
    sushiAddress = (await deployments.get("SushiToken")).address;
  } else if (chainId in SUSHI_ADDRESS) {
    sushiAddress = SUSHI_ADDRESS[chainId];
  } else {
    throw Error("No SUSHI!");
  }

  await deploy("MiniChefV2", {
    from: deployer,
    args: [sushiAddress],
    log: true,
    deterministicDeployment: false,
  });

  const miniChefV2 = await ethers.getContract("MiniChefV2");
  if ((await miniChefV2.owner()) !== dev) {
    console.log("Transfer ownership of MiniChef to dev");
    await (await miniChefV2.transferOwnership(dev, true, false)).wait();
  }
};

module.exports.tags = ["MiniChefV2"];
// module.exports.dependencies = ["UniswapV2Factory", "UniswapV2Router02"]
