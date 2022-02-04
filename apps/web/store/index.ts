import create from "zustand";
import { connectorsWithStore } from "app/connectors";

// Correct syntax but not possible
// since connectorsWithStore[0][2] has already called createStoreA()

// import createStoreA from '...'
// import createStoreB from '...'
//
// const useStore = create((set, get, api) => ({
//   ...createStoreA(set, get, api),
//   ...createStoreB(set, get, api),
// }))

const useStore = create((set, get) => ({
  web3: {
    ...connectorsWithStore[0][2],
  },
}));

export default useStore;
