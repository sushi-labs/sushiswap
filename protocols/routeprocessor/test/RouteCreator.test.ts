import { ethers, network } from "hardhat";
import { RouteProcessor__factory } from "../types/index";
import { Swapper } from "../scripts/Swapper";
import { getBigNumber, MultiRoute, RouteStatus } from "@sushiswap/tines";
import { WETH9ABI } from "../ABI/WETH9";
import { HardhatNetworkConfig, ProviderConnectInfo } from "hardhat/types";
import { HEXer } from "../scripts/HEXer";
import { ERC20ABI } from "../ABI/ERC20";
import { BentoBox } from "../scripts/liquidityProviders/Trident";
import { Contract } from "ethers";
import { BentoBoxABI } from "../ABI/BentoBoxABI";
import { ChainKey, ChainId } from "@sushiswap/chain";
import { SUSHI, Token, WBTC, WNATIVE } from "@sushiswap/currency";
import { expect } from "chai";
import { RouteCreator } from "../scripts/RouteCreator";

const delay = async (ms: number) => new Promise(res => setTimeout(res, ms));

const WRAPPED_NATIVE: Record<number, Token>  = {
  [ChainId.ETHEREUM]: new Token({
    chainId: ChainId.ETHEREUM,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether"
  }),
  [ChainId.POLYGON]: new Token({
    chainId: ChainId.POLYGON,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    decimals: 18,
    symbol: "WMATIC",
    name: "Wrapped Matic"
  })
}

async function testRouteCreator(chainId: ChainId, amountIn: number, toToken: Token, swaps = 1) {
  console.log(`1. ${chainId} RouteProcessor deployment ...`);  
  // const [_, John] = await ethers.getSigners()
  // const provider = John.provider as Provider
  //const provider = ethers.getDefaultProvider()
  let provider
  switch(chainId) {
    case ChainId.ETHEREUM: 
      provider = new ethers.providers.AlchemyProvider("homestead", process.env.ALCHEMY_API_KEY)
      break
    case ChainId.POLYGON:
      provider = new ethers.providers.AlchemyProvider('matic', process.env.ALCHEMY_POLYGON_API_KEY)
      break
    default:
      throw new Error('Unsupported net!')
  }

  const amountInBN = getBigNumber(amountIn * 1e18)
  const baseWrappedToken = WRAPPED_NATIVE[chainId]

  const routeCreator = new RouteCreator(provider, chainId)
  routeCreator.startRouting(baseWrappedToken, amountInBN, toToken, 30e9)
  routeCreator.onRouteUpdate(r => {
    console.log('Pools:', routeCreator.routingState?.poolCodes?.size)
    const printed = routeCreator.routeToString(r, baseWrappedToken, toToken)
    console.log(printed);    
  })

  return new Promise((res, reg) => {})
}

describe("RouteCreator", async function () {
  it("Ethereum WETH => FEI check", async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url;
    if (forking_url !== undefined && forking_url.search('eth-mainnet') >= 0) {
      expect(process.env.ALCHEMY_API_KEY).not.undefined
      const FEI = new Token({
        chainId: ChainId.ETHEREUM,
        address: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
        decimals: 18,
        symbol: "FEI",
        name: "Fei USD"
      })
      await testRouteCreator(ChainId.ETHEREUM, 10, FEI)
    }
  })

  it("Polygon WMATIC => SUSHI check", async function () {
    const forking_url = (network.config as HardhatNetworkConfig)?.forking?.url;
    if (forking_url !== undefined && forking_url.search('polygon') >= 0) {
      expect(process.env.ALCHEMY_POLYGON_API_KEY).not.undefined
      await testRouteCreator(ChainId.POLYGON, 1_000_000, SUSHI[ChainId.POLYGON])
    }
  })
})