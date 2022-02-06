import { getPriorityConnectorWithStore } from "../connectors";
import create, { GetState, SetState } from "zustand";
import { createWeb3Slice, Web3Slice } from "./web3Slice";

const priorityConnectorWithStore = getPriorityConnectorWithStore();

export type StoreState = Web3Slice;
export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

const useStore = create<StoreState>((set, get) => ({
  ...createWeb3Slice(set, get),
}));

// Sync web3React store to our own store
// It's not pretty, but it works
priorityConnectorWithStore[2].subscribe(() => {
  const { accounts, chainId, activating, error } =
    priorityConnectorWithStore[2].getState();
  useStore
    .getState()
    .setWeb3({ account: accounts?.[0], chainId, activating, error });
});

export default useStore;
