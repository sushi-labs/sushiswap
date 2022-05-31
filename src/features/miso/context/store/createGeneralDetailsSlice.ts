import { StoreSlice } from 'app/features/miso/context/types'

export interface IGeneralDetails {
  paymentCurrencyAddress: string
  startDate: string
  endDate: string
}

export const generalDetailsDefaultValues = {
  paymentCurrencyAddress: '',
  startDate: '',
  endDate: '',
}

interface IGeneralDetailsSlice extends IGeneralDetails {
  setGeneralDetails: (_: IGeneralDetails) => void
}

export const createGeneralDetails: StoreSlice<IGeneralDetailsSlice> = (set) => ({
  ...generalDetailsDefaultValues,
  setGeneralDetails: (newState) => set(() => newState),
})
