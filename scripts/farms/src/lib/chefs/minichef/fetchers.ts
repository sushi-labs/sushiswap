import { ChainId } from "@sushiswap/chain";
import { ComplexRewarderTime, MiniChefV2 } from "@sushiswap/core";
import ComplexRewarderTimeABI from "@sushiswap/core/abi/ComplexRewarderTime.json";
import MiniChefV2ABI from "@sushiswap/core/abi/MiniChefV2.json";
import { MINICHEF_SUBGRAPH_NAME, SUBGRAPH_HOST } from "@sushiswap/graph-config";
import {
  ReadContractConfig,
  readContracts,
  ReadContractsConfig,
} from "@wagmi/core";
import { readContract } from "@wagmi/core";
import { BigNumber } from "ethers";

import { MINICHEF_ADDRESS } from "../../../config";

export async function getPoolLength(chainId: ChainId) {
  const poolLengthCall: ReadContractConfig = {
    address: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    abi: MiniChefV2ABI,
    functionName: "poolLength",
  };
  return readContract(poolLengthCall);
}

export async function getTotalAllocPoint(chainId: ChainId) {
  const totalAllocPointCall: ReadContractConfig = {
    address: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    abi: MiniChefV2ABI,
    functionName: "totalAllocPoint",
  };

  return readContract(totalAllocPointCall);
}

export async function getSushiPerSecond(chainId: ChainId) {
  const sushiPerSecondCall = {
    address: MINICHEF_ADDRESS[chainId],
    chainId: chainId,
    abi: MiniChefV2ABI,
    functionName: "sushiPerSecond",
  };
  return readContract(sushiPerSecondCall);
}

export async function getPoolInfos(poolLength: number, chainId: ChainId) {
  const poolInfoCalls: ReadContractsConfig["contracts"] = [
    ...Array(poolLength),
  ].map((_, i) => ({
    address: MINICHEF_ADDRESS[chainId],
    args: [i],
    chainId: chainId,
    abi: MiniChefV2ABI,
    functionName: "poolInfo",
  }));
  return readContracts<Awaited<ReturnType<MiniChefV2["poolInfo"]>>[]>({
    allowFailure: true,
    contracts: poolInfoCalls,
  });
}

export async function getLpTokens(poolLength: number, chainId: ChainId) {
  const lpTokenCalls: ReadContractsConfig["contracts"] = [
    ...Array(poolLength),
  ].map((_, i) => ({
    address: MINICHEF_ADDRESS[chainId],
    args: [i],
    chainId: chainId,
    abi: MiniChefV2ABI,
    functionName: "lpToken",
  }));
  return readContracts<Awaited<ReturnType<MiniChefV2["lpToken"]>>[]>({
    allowFailure: true,
    contracts: lpTokenCalls,
  });
}

export async function getRewarders(poolLength: number, chainId: ChainId) {
  const rewarderCalls: ReadContractsConfig["contracts"] = [
    ...Array(poolLength),
  ].map((_, i) => ({
    address: MINICHEF_ADDRESS[chainId],
    args: [i],
    chainId: chainId,
    abi: MiniChefV2ABI,
    functionName: "rewarder",
  }));
  return readContracts<Awaited<ReturnType<MiniChefV2["rewarder"]>>[]>({
    allowFailure: true,
    contracts: rewarderCalls,
  });
}

export async function getRewarderInfos(chainId: ChainId) {
  const { getBuiltGraphSDK } = await import("../../../../.graphclient");
  const subgraphName = MINICHEF_SUBGRAPH_NAME[chainId];
  console.log(chainId, subgraphName);
  const sdk = getBuiltGraphSDK({
    host: SUBGRAPH_HOST[chainId],
    name: subgraphName,
  });

  const { rewarders } = await sdk.MiniChefRewarders({
    where: {
      id_not: "0x0000000000000000000000000000000000000000",
      rewardToken_not: "0x0000000000000000000000000000000000000000",
    },
  });
  console.log("get rewarder infos");

  return Promise.all(
    rewarders.map(async (rewarder) => {
      try {
        if (chainId === 137) {
          const blacklist = [
            "0xb52b4b6779553a89e7f5f6f1d463595d88e88822",
            "0x0fc98e524095f7a0f09eb9786beba120060f8004",
            "0x9e21698426a29c32d7c0fdaeb7723c9856ba9ac7",
            "0x71581bf0ce397f50f87cc2490146d30a1e686461",
            "0x4db1c6364924b90310d68948fc7a3121fa9edf10",
            "0x99246001c6e458c63052fb4e3d04df6bd932a6a7",
          ];

          if (blacklist.includes(rewarder.id)) throw new Error();
        }
        if (chainId === 42161) {
          const blacklist = [
            "0x9c37b0b498da78830284afdcb534c3350b52e744",
            "0x948bfbb7bdb7e74ec8ed0859c79502408bee4de1",
            "0xec932d20ba851ac26630835771476dc2d1a3ac8d",
            "0xf6348d37950c79b9f7b02b4d97e04db7dea855ae",
            "0x1a9c20e2b0ac11ebecbdca626bba566c4ce8e606",
            "0xae961a7d116bfd9b2534ad27fe4d178ed188c87a",
            "0x3c61b93b64f59b5091a11a071083598ee8b5cb64",
          ];

          if (blacklist.includes(rewarder.id)) throw new Error();
        }

        const poolLength = await getPoolLength(chainId);

        const poolIds = !poolLength?.isZero()
          ? [...Array(poolLength?.toNumber()).keys()]
          : [];

        const poolInfoCalls: ReadContractsConfig["contracts"] = poolIds.map(
          (_, i) => ({
            address: rewarder.id,
            args: [i],
            chainId: chainId,
            abi: ComplexRewarderTimeABI,
            functionName: "poolInfo",
          })
        );

        const poolInfos = await readContracts<
          Awaited<ReturnType<ComplexRewarderTime["poolInfo"]>>[]
        >({
          allowFailure: true,
          contracts: poolInfoCalls,
        });

        return {
          id: rewarder.id,
          pools: poolIds.map((_, i) => ({
            // Minichef pool ID
            id: poolIds[i],
            allocPoint: Number(poolInfos[i].allocPoint),
          })),
          totalAllocPoint: poolInfos.reduce(
            (acc, cur) => (acc += cur.allocPoint.toNumber()),
            0
          ),
          rewardToken: rewarder.rewardToken,
          rewardPerSecond: BigNumber.from(rewarder.rewardPerSecond),
        };
      } catch (error) {
        // console.log('error', error)
        return {
          id: rewarder.id,
          rewardToken: rewarder.rewardToken,
          rewardPerSecond: BigNumber.from(rewarder.rewardPerSecond),
        };
      }
    })
  );
}
