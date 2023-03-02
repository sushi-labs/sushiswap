import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  ethers,
  run,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const masterDeployer = await ethers.getContract("MasterDeployer");

  const { address, newlyDeployed } = await deploy("ConstantProductPoolFactory", {
    from: deployer,
    deterministicDeployment: false,
    args: [masterDeployer.address],
    waitConfirmations: process.env.VERIFY_ON_DEPLOY === "true" ? 20 : undefined,
  });

  if (!(await masterDeployer.whitelistedFactories(address))) {
    console.debug("Add ConstantProductPoolFactory to MasterDeployer whitelist");
    await (await masterDeployer.addToWhitelist(address)).wait();
  }

  if (newlyDeployed && process.env.VERIFY_ON_DEPLOY === "true") {
    try {
      await run("verify:verify", {
        address,
        constructorArguments: [masterDeployer.address],
      });
    } catch (error) {
      console.error(error);
    }
  }
};

export default deployFunction;

deployFunction.dependencies = ["MasterDeployer"];

deployFunction.tags = ["ConstantProductPoolFactory"];
