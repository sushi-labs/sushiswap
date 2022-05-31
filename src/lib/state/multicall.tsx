import { createMulticall } from '@uniswap/redux-multicall'
import { useInterfaceMulticall } from 'app/hooks/useContract'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { useActiveWeb3React } from 'app/services/web3'
import { combineReducers, createStore } from 'redux'

const multicall = createMulticall()
const reducer = combineReducers({ [multicall.reducerPath]: multicall.reducer })
export const store = createStore(reducer)

export default multicall

export function MulticallUpdater() {
  const latestBlockNumber = useBlockNumber()
  const { chainId } = useActiveWeb3React()
  const contract = useInterfaceMulticall()
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}
