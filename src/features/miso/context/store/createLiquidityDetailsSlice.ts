import { StoreSlice } from 'app/features/miso/context/types'

export interface ILiquidityDetails {
  tokenForLiquidity: number | null
  liqLockTime: number | null
  liqPercentage: number | null
  liqLauncherEnabled: boolean
}

export const liquidityDetailsDefaultValues = {
  tokenForLiquidity: null,
  liqLockTime: null,
  liqPercentage: null,
  liqLauncherEnabled: false,
}

interface ILiquidityDetailsSlice extends ILiquidityDetails {
  setLiquidityDetails: (_: ILiquidityDetails) => void
}

export const createLiquidityDetailsSlice: StoreSlice<ILiquidityDetailsSlice> = (set) => ({
  ...liquidityDetailsDefaultValues,
  setLiquidityDetails: (newState) => set(() => newState),
})
