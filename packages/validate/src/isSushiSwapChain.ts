import { ChainId } from "@sushiswap/chain";
import {
  SUSHISWAP_SUBGRAPH_NAME,
  SushiSwapChainId,
} from "../../../config/graph/dist";

export const isSushiSwapChain = (
  chainId: ChainId
): chainId is SushiSwapChainId =>
  Object.keys(SUSHISWAP_SUBGRAPH_NAME).map(Number).includes(chainId);
