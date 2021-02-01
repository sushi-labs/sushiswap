import { CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { UniswapV2Factory__factory } from "../../build/types/factories/UniswapV2Factory__factory";

const deployExchange: DeployFunction = async (env) => {
  const [
    deployer,
  ] = ((await env.ethers.getSigners()) as unknown) as CeloWallet[];
  if (!deployer) {
    throw new Error("No deployer.");
  }

  // We get the contract to deploy
  const UniswapV2Factory = new UniswapV2Factory__factory(deployer);
  console.log("Deployer address: " + deployer.address);
  const factory = await UniswapV2Factory.deploy(deployer.address);

  console.log("UniswapV2Factory deployed to:", factory.address);
};

export default deployExchange;
