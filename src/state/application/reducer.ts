import { createSlice, nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { DEFAULT_TXN_DISMISS_MS } from 'app/constants'

export type PopupContent =
  | {
      txn: {
        hash: string
        success?: boolean
        summary?: string
      }
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: TokenList
        newList: TokenList
        auto: boolean
      }
    }

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  DELEGATE,
  VOTE,
  LANGUAGE,
  NETWORK,
}

type PopupList = Array<{
  key: string
  show: boolean
  content: PopupContent
  removeAfterMs: number | null
}>

export interface ApplicationState {
  readonly chainId: number | null
  readonly openModal: ApplicationModal | null
  readonly popupList: PopupList
  readonly kashiApprovalPending: string
}

const initialState: ApplicationState = {
  chainId: null,
  openModal: null,
  popupList: [],
  kashiApprovalPending: '',
}

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateChainId(state, action) {
      const { chainId } = action.payload
      state.chainId = chainId
    },
    setOpenModal(state, action) {
      state.openModal = action.payload
    },
    addPopup(state, { payload: { content, key, removeAfterMs = DEFAULT_TXN_DISMISS_MS } }) {
      state.popupList = (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ])
    },
    removePopup(state, { payload: { key } }) {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false
        }
      })
    },
    setKashiApprovalPending(state, action) {
      state.kashiApprovalPending = action.payload
    },
  },
})

export const { updateChainId, setOpenModal, addPopup, removePopup, setKashiApprovalPending } = applicationSlice.actions
export default applicationSlice.reducer
