import { createMulticall } from '@uniswap/redux-multicall'
import { useInterfaceMulticall } from 'app/hooks/useContract'
import useBlockNumber from 'app/hooks/useBlockNumber'
import { combineReducers, createStore } from 'redux'
import { useNetwork } from 'wagmi'

const multicall = createMulticall()
const reducer = combineReducers({ [multicall.reducerPath]: multicall.reducer })
export const store = createStore(reducer)

export default multicall

export function MulticallUpdater() {
  const latestBlockNumber = useBlockNumber()
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id
  console.log(latestBlockNumber)
  const contract = useInterfaceMulticall()
  return <multicall.Updater chainId={chainId} latestBlockNumber={latestBlockNumber} contract={contract} />
}