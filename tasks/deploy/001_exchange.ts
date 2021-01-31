import { deployContract } from "@ubeswap/solidity-create2-deployer";
import { DeployFunction } from ".";
import factoryContract from "../../build/artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json";
import routerContract from "../../build/artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json";

const salt = "Tayo'y magsayawan";

export const deployExchange: DeployFunction = async (env) => {
  const [deployer] = env.celo.getSigners();
  if (!deployer) {
    throw new Error("No deployer.");
  }
  const deployerAddress = await deployer.getAddress();
  console.log("Deployer address: " + deployerAddress);

  console.log("Deploying factory...");
  const factory = await deployContract({
    salt,
    contractBytecode: factoryContract.bytecode,
    signer: deployer,
    constructorTypes: ["address"],
    constructorArgs: [await deployer.getAddress()],
  });

  console.log("Deploying router...");
  const router = await deployContract({
    salt,
    contractBytecode: routerContract.bytecode,
    signer: deployer,
    constructorTypes: ["address"],
    constructorArgs: [factory.address],
  });

  return {
    UniswapV2Factory: factory.address,
    UniswapV2Router02: router.address,
  };
};
