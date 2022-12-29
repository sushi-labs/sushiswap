import { masterChefAbi } from "@sushiswap/abi";
import { ChainId } from "@sushiswap/chain";
import { readContract, readContracts } from "@wagmi/core";

import { MASTERCHEF_ADDRESS } from "../../../config";

export async function getPoolLength() {
  const poolLengthCall = {
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    abi: masterChefAbi,
    functionName: "poolLength",
  };
  return readContract(poolLengthCall);
}

export async function getTotalAllocPoint() {
  const totalAllocPointCall = {
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    chainId: ChainId.ETHEREUM,
    abi: masterChefAbi,
    functionName: "totalAllocPoint",
  };
  return readContract(totalAllocPointCall);
}

export async function getPoolInfos(poolLength: number) {
  const poolInfoCalls = [...Array(poolLength)].map((_, i) => ({
    address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
    args: [i],
    chainId: ChainId.ETHEREUM,
    abi: masterChefAbi,
    functionName: "poolInfo",
  }));
  return readContracts({
    allowFailure: true,
    contracts: poolInfoCalls,
  });
}
