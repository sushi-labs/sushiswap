import { BENTOBOX_ADDRESS, WNATIVE_ADDRESS } from "@sushiswap/core-sdk";
import { BentoBoxV1, MasterDeployer, WETH9 } from "../types";

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFunction: DeployFunction = async function ({
  ethers,
  deployments,
  getNamedAccounts,
  getChainId,
  run,
}: HardhatRuntimeEnvironment) {
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

  const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");

  const { address, newlyDeployed } = await deploy("TridentRouter", {
    from: deployer,
    args: [
      bentoBox ? bentoBox.address : BENTOBOX_ADDRESS[chainId],
      masterDeployer.address,
      wnative ? wnative.address : WNATIVE_ADDRESS[chainId],
    ],
    deterministicDeployment: false,
    waitConfirmations: process.env.VERIFY_ON_DEPLOY === "true" ? 10 : undefined,
  });

  if (newlyDeployed && process.env.VERIFY_ON_DEPLOY === "true") {
    try {
      await run("verify:verify", {
        address,
        constructorArguments: [
          bentoBox ? bentoBox.address : BENTOBOX_ADDRESS[chainId],
          masterDeployer.address,
          wnative ? wnative.address : WNATIVE_ADDRESS[chainId],
        ],
        contract: "contracts/TridentRouter.sol:TridentRouter",
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Avoid needing to whitelist master contract in fixtures
  if (chainId === 31337 && !(await bentoBox?.whitelistedMasterContracts(address))) {
    await bentoBox?.whitelistMasterContract(address, true);
  }
};

export default deployFunction;

// deployFunction.dependencies = ["ConstantProductPoolFactory"];

deployFunction.tags = ["TridentRouter"];
