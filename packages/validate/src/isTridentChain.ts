import {
  SushiSwapChainId,
  TRIDENT_SUBGRAPH_NAME,
  TridentChainId,
} from "../../../config/graph/dist";

export const isTridentChain = (
  chainId: SushiSwapChainId | TridentChainId
): chainId is TridentChainId =>
  Object.keys(TRIDENT_SUBGRAPH_NAME).map(Number).includes(chainId);
