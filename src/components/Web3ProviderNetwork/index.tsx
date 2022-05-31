import { NetworkContextName } from 'app/constants'
import { createWeb3ReactRoot } from 'web3-react-core'

const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName)

// @ts-ignore TYPE NEEDS FIXING
function Web3ProviderNetwork({ children, getLibrary }) {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>
}

export default Web3ProviderNetwork
