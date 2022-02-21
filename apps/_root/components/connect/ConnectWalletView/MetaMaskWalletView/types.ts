import { WalletView } from '../types'
import { MetaMask } from '@web3-react/metamask'

export interface MetaMaskWalletView extends WalletView {
  connector: MetaMask
}
