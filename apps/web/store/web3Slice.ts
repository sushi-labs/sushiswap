import { Web3ReactState } from "@web3-react/types";
import { StoreSlice } from "app/store/index";

export interface Web3Slice extends Web3ReactState {
  setWeb3(x: Web3ReactState): void;
}

export const createWeb3Slice: StoreSlice<Web3Slice> = (set) => ({
  accounts: undefined,
  chainId: undefined,
  activating: false,
  error: undefined,
  setWeb3: (state) => set(state),
});
