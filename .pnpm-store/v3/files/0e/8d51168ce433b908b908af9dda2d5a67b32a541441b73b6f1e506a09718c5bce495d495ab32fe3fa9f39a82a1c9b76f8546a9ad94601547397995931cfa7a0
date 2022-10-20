import { BENTOBOX_ADDRESS, ChainId, WNATIVE, WNATIVE_ADDRESS } from "@sushiswap/core-sdk";

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BentoBoxV1, WETH9 } from "../types";

const deployFunction: DeployFunction = async function ({
  ethers,
  deployments,
  getNamedAccounts,
  getChainId,
  run,
}: HardhatRuntimeEnvironment) {
  console.debug("Running TridentSushiRollCP deploy script");
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const chainId = Number(await getChainId());

  const bentoBox = await ethers.getContractOrNull<BentoBoxV1>("BentoBoxV1");

  const wnative = await ethers.getContractOrNull<WETH9>("WETH9");

  if (!bentoBox && !(chainId in BENTOBOX_ADDRESS)) {
    throw Error(`No BENTOBOX on chain #${chainId}!`);
  }

  if (!wnative && !(chainId in WNATIVE_ADDRESS)) {
    throw Error(`No WNATIVE on chain #${chainId}!`);
  }

  const constantProductPoolFactory = await ethers.getContract("ConstantProductPoolFactory");
  const masterDeployer = await ethers.getContract("MasterDeployer");

  const { address, newlyDeployed } = await deploy("TridentSushiRollCP", {
    from: deployer,
    args: [
      bentoBox ? bentoBox.address : BENTOBOX_ADDRESS[chainId],
      constantProductPoolFactory.address,
      masterDeployer.address,
    ],
    deterministicDeployment: false,
    waitConfirmations: process.env.VERIFY_ON_DEPLOY === "true" ? 5 : undefined,
  });

  if (newlyDeployed && process.env.VERIFY_ON_DEPLOY === "true") {
    try {
      await run("verify:verify", {
        address,
        constructorArguments: [
          bentoBox ? bentoBox.address : BENTOBOX_ADDRESS[chainId],
          constantProductPoolFactory.address,
          masterDeployer.address,
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  console.debug("TridentSushiRollCP deployed at ", address);
};

export default deployFunction;

deployFunction.dependencies = ["ConstantProductPoolFactory"];

deployFunction.tags = ["TridentSushiRollCP"];
