// const { WNATIVE_ADDRESS } = require("@sushiswap/core-sdk");

// module.exports = async function ({ getNamedAccounts, deployments }) {
//   const { deploy } = deployments;

//   const { deployer } = await getNamedAccounts();

//   const chainId = await getChainId();

//   let wethAddress;

//   if (chainId === "31337") {
//     wethAddress = (await deployments.get("WETH9Mock")).address;
//   } else if (chainId in WNATIVE_ADDRESS) {
//     wethAddress = WNATIVE_ADDRESS[chainId];
//   } else {
//     throw Error("No WNATIVE ADDRESS!");
//   }

//   await deploy("BentoBoxV1", {
//     from: deployer,
//     args: [wethAddress],
//     log: true,
//     deterministicDeployment: false,
//   });
// };

// module.exports.tags = ["BentoBox"];
