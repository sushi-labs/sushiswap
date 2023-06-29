import { WNATIVE_ADDRESS } from "@sushiswap/core-sdk";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { WETH9 } from "../types";

const deployFunction: DeployFunction = async function ({
  ethers,
  deployments,
  getNamedAccounts,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const weth9 = await ethers.getContract<WETH9>("WETH9");

  await deploy("BentoBoxV1", {
    from: deployer,
    args: [weth9.address],
    deterministicDeployment: false,
  });
};

export default deployFunction;

deployFunction.dependencies = ["WETH9"];

deployFunction.tags = ["BentoBoxV1"];

deployFunction.skip = ({ getChainId }) =>
  new Promise(async (resolve, reject) => {
    try {
      const chainId = await getChainId();
      resolve(chainId !== "31337");
    } catch (error) {
      reject(error);
    }
  });
