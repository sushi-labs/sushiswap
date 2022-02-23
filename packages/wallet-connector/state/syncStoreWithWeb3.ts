import { InitializedConnector } from '../connectors'
import { useStore } from './store'
import produce from 'immer'

let unsubscribeFunc = () => {}

export const syncStoreWithWeb3 = (connector: InitializedConnector) => {
  unsubscribeFunc()
  unsubscribeFunc = connector.store.subscribe(({ accounts, activating, chainId, error }) => {
    useStore.setState(
      produce(useStore.getState(), (draft) => {
        draft.name = connector.name
        draft.connector = connector.instance
        draft.account = accounts?.[0]
        draft.chainId = chainId
        draft.activating = activating
        draft.error = error
      }),
    )
  })
}
