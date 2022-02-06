import { Web3ReactState } from "@web3-react/types";
import { StoreSlice } from "./index";
import { ChainId } from "@sushiswap/core-sdk";

export interface Web3Slice extends Omit<Web3ReactState, "chainId"> {
  chainId?: ChainId;
  setWeb3(x: Web3ReactState): void;
}

export const createWeb3Slice: StoreSlice<Web3Slice> = (set) => ({
  accounts: undefined,
  chainId: undefined,
  activating: false,
  error: undefined,
  setWeb3: (state) => set(state),
});
