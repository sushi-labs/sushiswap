import { BigNumber } from "ethers";
import { DeployFunction, getDeployment } from ".";
import { IERC20Uniswap__factory } from "../../build/types/factories/IERC20Uniswap__factory";
import { UniswapV2Factory__factory } from "../../build/types/factories/UniswapV2Factory__factory";
import { UniswapV2Router02__factory } from "../../build/types/factories/UniswapV2Router02__factory";

export const deployLiquidity: DeployFunction = async (env) => {
  const [deployer] = env.celo.getSigners();
  if (!deployer) {
    throw new Error("No deployer.");
  }
  const deployerAddress = await deployer.getAddress();
  console.log("Deployer address: " + deployerAddress);

  const { kit } = await env.celo;

  // populate the first pool

  // $1 of initial liquidity
  const dollarAdd = BigNumber.from(10).pow(16);
  const celoAdd = BigNumber.from(10).pow(16);

  console.log("Adding liquidity to the CELO/cUSD pool");
  const {
    UniswapV2Router02: routerAddress,
    UniswapV2Factory: factoryAddress,
  } = await getDeployment("exchange", await deployer.getChainId());
  if (!routerAddress) {
    throw new Error("Router address not found");
  }

  const factory = UniswapV2Factory__factory.connect(factoryAddress!, deployer);
  console.log(await factory.pairCodeHash());
  const router = UniswapV2Router02__factory.connect(routerAddress, deployer);

  const cusdAddress = (await kit.contracts.getStableToken()).address;
  const celoAddress = (await kit.contracts.getGoldToken()).address;

  await (
    await IERC20Uniswap__factory.connect(cusdAddress, deployer).approve(
      routerAddress,
      "500000000000000000000000000"
    )
  ).wait();
  await (
    await IERC20Uniswap__factory.connect(celoAddress, deployer).approve(
      routerAddress,
      "100000000000000000000000000"
    )
  ).wait();

  await (
    await router.addLiquidity(
      celoAddress,
      cusdAddress,

      celoAdd,
      dollarAdd,
      0,
      0,
      deployerAddress,
      Math.floor(new Date().getTime() / 1000) + 30 * 60
    )
  ).wait();

  return {
    CeloCUSDPair: await router.pairFor(celoAddress, cusdAddress),
  };
};
