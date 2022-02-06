import { Web3ReactState } from "@web3-react/types";
import { StoreSlice } from "./index";

interface OverrideWeb3ReactState extends Omit<Web3ReactState, "accounts"> {
  account?: string;
}

export interface Web3Slice extends OverrideWeb3ReactState {
  setWeb3(x: OverrideWeb3ReactState): void;
}

export const createWeb3Slice: StoreSlice<Web3Slice> = (set) => ({
  account: undefined,
  chainId: undefined,
  activating: false,
  error: undefined,
  setWeb3: (state) => set(state),
});
