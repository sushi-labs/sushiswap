import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ChainId } from "@sushiswap/chain";
import { Native, SUSHI, Token, Type, WNATIVE } from "@sushiswap/currency";
import { getBigNumber, MultiRoute } from "@sushiswap/tines";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers, network } from "hardhat";
import { HardhatNetworkConfig } from "hardhat/types";

import { ERC20ABI } from "../ABI/ERC20";
import { WETH9ABI } from "../ABI/WETH9";
import { DataFetcher } from "../scripts/DataFetcher";
import { BentoBox } from "../scripts/liquidityProviders/Trident";
import { Router } from "../scripts/Router";

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

class BackCounter {
  start: number;
  current: number;

  constructor(start: number) {
    this.start = start;
    this.current = start;
  }

  async wait() {
    while (this.current > 0) {
      console.log(`Wait ${this.current} sec ...`);
      this.current--;
      await delay(1000);
    }
  }

  reset(startdiff = 0) {
    this.start += startdiff;
    if (this.start < 0) this.start = 0;
    this.current = this.start;
  }
}

async function testRouter(
  chainId: ChainId,
  amountIn: number,
  toToken: Token,
  swapFromWrapped = true,
  swaps = 1
) {
  let provider;
  switch (chainId) {
    case ChainId.ETHEREUM:
      provider = new ethers.providers.AlchemyProvider(
        "homestead",
        process.env.ALCHEMY_API_KEY
      );
      break;
    case ChainId.POLYGON:
      provider = new ethers.providers.AlchemyProvider(
        "matic",
        process.env.ALCHEMY_POLYGON_API_KEY
      );
      break;
    default:
      throw new Error("Unsupported net!");
  }

  const amountInBN = getBigNumber(amountIn * 1e18);
  const baseWrappedToken = WNATIVE[chainId];
  const native = Native.onChain(chainId);
  const fromToken = swapFromWrapped ? baseWrappedToken : native;

  console.log(`1. ${chainId} Find best route ...`);
  const backCounter = new BackCounter(4);
  const dataFetcher = new DataFetcher(provider, chainId);
  dataFetcher.startDataFetching();
  dataFetcher.fetchPoolsForToken(fromToken, toToken);
  const router = new Router(dataFetcher, fromToken, amountInBN, toToken, 30e9);
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString();
    console.log(printed);
    backCounter.reset(-1);
  });

  await backCounter.wait();
  router.stopRouting();
  dataFetcher.stopDataFetching();

  console.log(`2. ChainId=${chainId} RouteProcessor deployment ...`);

  const RouteProcessor = await ethers.getContractFactory("RouteProcessor");
  const routeProcessor = await RouteProcessor.deploy(
    BentoBox[chainId] || "0x0000000000000000000000000000000000000000",
    WNATIVE[chainId].address
  );
  await routeProcessor.deployed();

  console.log("3. User creation ...");
  const [Alice] = await ethers.getSigners();

  if (swapFromWrapped) {
    console.log(
      `4. Deposit user's ${amountIn} ${WNATIVE[chainId].symbol} to ${baseWrappedToken.symbol}`
    );
    await Alice.sendTransaction({
      to: baseWrappedToken.address,
      value: amountInBN.mul(swaps),
    });

    console.log(
      `5. Approve user's ${baseWrappedToken.symbol} to the route processor ...`
    );
    const WrappedBaseTokenContract = await new ethers.Contract(
      baseWrappedToken.address,
      WETH9ABI,
      Alice
    );
    await WrappedBaseTokenContract.connect(Alice).approve(
      routeProcessor.address,
      amountInBN.mul(swaps)
    );
  }

  console.log("6. Create route processor code ...");
  const route = router.getBestRoute() as MultiRoute;
  const rpParams = router.getCurrentRouteRPParams(
    Alice.address,
    routeProcessor.address
  );
  if (rpParams === undefined) {
    throw new Error("route is not created");
  }

  console.log("7. Call route processor ...");
  const toTokenContract = await new ethers.Contract(
    toToken.address,
    WETH9ABI,
    Alice
  );
  const balanceOutBNBefore = await toTokenContract
    .connect(Alice)
    .balanceOf(Alice.address);
  let tx;
  if (rpParams.value)
    tx = await routeProcessor.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
      { value: rpParams.value }
    );
  else
    tx = await routeProcessor.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode
    );
  const receipt = await tx.wait();

  console.log("8. Fetching user's output balance ...");
  const balanceOutBN = (
    await toTokenContract.connect(Alice).balanceOf(Alice.address)
  ).sub(balanceOutBNBefore);
  console.log(`    expected amountOut: ${route.amountOutBN.toString()}`);
  console.log(`    real amountOut:     ${balanceOutBN.toString()}`);
  const slippage = parseInt(
    balanceOutBN
      .sub(route.amountOutBN)
      .mul(10_000)
      .div(route.amountOutBN)
      .toString()
  );
  console.log(`    slippage: ${slippage / 100}%`);
  console.log(`    gas use: ${receipt.gasUsed.toString()}`);
}

interface TestEnvironment {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any;
  rp: Contract;
  user: SignerWithAddress;
  dataFetcher: DataFetcher;
}

async function getTestEnvironment(chainId: ChainId): Promise<TestEnvironment> {
  console.log("Prepare Environment:");

  console.log("    Create Provider ...");
  let provider;
  switch (chainId) {
    case ChainId.ETHEREUM:
      provider = new ethers.providers.AlchemyProvider(
        "homestead",
        process.env.ALCHEMY_API_KEY
      );
      break;
    case ChainId.POLYGON:
      provider = new ethers.providers.AlchemyProvider(
        "matic",
        process.env.ALCHEMY_POLYGON_API_KEY
      );
      break;
    default:
      throw new Error("Unsupported net!");
  }

  console.log("    Create DataFetcher ...");

  const dataFetcher = new DataFetcher(provider, chainId);
  dataFetcher.startDataFetching();

  console.log(`    ChainId=${chainId} RouteProcessor deployment ...`);
  const RouteProcessor = await ethers.getContractFactory("RouteProcessor");
  const routeProcessor = await RouteProcessor.deploy(
    BentoBox[chainId] || "0x0000000000000000000000000000000000000000",
    WNATIVE[chainId].address
  );
  await routeProcessor.deployed();

  console.log("    User creation ...");
  const [Alice] = await ethers.getSigners();

  return {
    provider,
    rp: routeProcessor,
    user: Alice,
    dataFetcher,
  };
}

async function makeSwap(
  env: TestEnvironment,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type
): Promise<BigNumber | undefined> {
  console.log("");
  console.log(
    `Make swap ${fromToken.symbol} -> ${
      toToken.symbol
    } amount: ${amountIn.toString()}`
  );

  if (fromToken instanceof Token) {
    console.log(
      `    Approve user's ${fromToken.symbol} to the route processor ...`
    );
    const WrappedBaseTokenContract = await new ethers.Contract(
      fromToken.address,
      ERC20ABI,
      env.user
    );
    await WrappedBaseTokenContract.connect(env.user).approve(
      env.rp.address,
      amountIn
    );
  }

  console.log("    Create Route ...");
  env.dataFetcher.fetchPoolsForToken(fromToken, toToken);
  const backCounter = new BackCounter(3);
  const router = new Router(
    env.dataFetcher,
    fromToken,
    amountIn,
    toToken,
    30e9
  );
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString();
    console.log(printed);
    backCounter.reset(-1);
  });
  await backCounter.wait();
  router.stopRouting();

  console.log("    Create route processor code ...");
  const rpParams = router.getCurrentRouteRPParams(
    env.user.address,
    env.rp.address
  );
  if (rpParams === undefined) return;

  console.log("    Call route processor ...");
  const route = router.getBestRoute() as MultiRoute;
  let balanceOutBNBefore: BigNumber;
  let toTokenContract: Contract | undefined = undefined;
  if (toToken instanceof Token) {
    toTokenContract = await new ethers.Contract(
      toToken.address,
      WETH9ABI,
      env.user
    );
    balanceOutBNBefore = await toTokenContract
      .connect(env.user)
      .balanceOf(env.user.address);
  } else {
    balanceOutBNBefore = await env.user.getBalance();
  }
  let tx;
  if (rpParams.value)
    tx = await env.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode,
      { value: rpParams.value }
    );
  else
    tx = await env.rp.processRoute(
      rpParams.tokenIn,
      rpParams.amountIn,
      rpParams.tokenOut,
      rpParams.amountOutMin,
      rpParams.to,
      rpParams.routeCode
    );
  const receipt = await tx.wait();

  console.log("    Fetching user's output balance ...");
  let balanceOutBN: BigNumber;
  if (toTokenContract) {
    balanceOutBN = (
      await toTokenContract.connect(env.user).balanceOf(env.user.address)
    ).sub(balanceOutBNBefore);
  } else {
    balanceOutBN = (await env.user.getBalance()).sub(balanceOutBNBefore);
  }
  console.log(`        expected amountOut: ${route.amountOutBN.toString()}`);
  console.log(`        real amountOut:     ${balanceOutBN.toString()}`);
  const slippage = parseInt(
    balanceOutBN
      .sub(route.amountOutBN)
      .mul(10_000)
      .div(route.amountOutBN)
      .toString()
  );
  console.log(`        slippage: ${slippage / 100}%`);
  console.log(`        gas use: ${receipt.gasUsed.toString()}`);

  return balanceOutBN;
}

describe("RouteCreator", async function () {
  it.skip("Ethereum WETH => FEI check", async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url;
    if (forking_url !== undefined && forking_url.search("eth-mainnet") >= 0) {
      expect(process.env.ALCHEMY_API_KEY).not.undefined;
      const FEI = new Token({
        chainId: ChainId.ETHEREUM,
        address: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
        decimals: 18,
        symbol: "FEI",
        name: "Fei USD",
      });
      await testRouter(ChainId.ETHEREUM, 10, FEI);
    }
  });

  it.skip("Polygon WMATIC => SUSHI check", async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url;
    if (forking_url !== undefined && forking_url.search("polygon") >= 0) {
      expect(process.env.ALCHEMY_POLYGON_API_KEY).not.undefined;
      await testRouter(ChainId.POLYGON, 1_000_000, SUSHI[ChainId.POLYGON]);
    }
  });

  it.skip("Polygon MATIC => WMATIC check", async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url;
    if (forking_url !== undefined && forking_url.search("polygon") >= 0) {
      expect(process.env.ALCHEMY_POLYGON_API_KEY).not.undefined;
      await testRouter(
        ChainId.POLYGON,
        1_000_000,
        WNATIVE[ChainId.POLYGON],
        false
      );
    }
  });

  it.skip("Polygon MATIC => SUSHI check", async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url;
    if (forking_url !== undefined && forking_url.search("polygon") >= 0) {
      expect(process.env.ALCHEMY_POLYGON_API_KEY).not.undefined;
      await testRouter(
        ChainId.POLYGON,
        1_000_000,
        SUSHI[ChainId.POLYGON],
        false
      );
    }
  });

  it("Native => SUSHI => Native check", async function () {
    let chainId;
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url;
    if (forking_url !== undefined && forking_url.search("polygon") >= 0) {
      chainId = ChainId.POLYGON;
      expect(process.env.ALCHEMY_POLYGON_API_KEY).not.undefined;
    } else if (
      forking_url !== undefined &&
      forking_url.search("eth-mainnet") >= 0
    ) {
      chainId = ChainId.ETHEREUM;
      expect(process.env.ALCHEMY_API_KEY).not.undefined;
    } else {
      return;
    }

    const env = await getTestEnvironment(chainId);

    const amountOut1 = await makeSwap(
      env,
      Native.onChain(chainId),
      getBigNumber(1 * 1e18),
      SUSHI[chainId]
    );
    if (amountOut1 === undefined) return;
    await makeSwap(env, SUSHI[chainId], amountOut1, Native.onChain(chainId));

    const amountOut2 = await makeSwap(
      env,
      Native.onChain(chainId),
      getBigNumber(1 * 1e18),
      WNATIVE[chainId]
    );
    if (amountOut2 === undefined) return;
    await makeSwap(env, WNATIVE[chainId], amountOut2, Native.onChain(chainId));
  });
});
