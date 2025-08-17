export type EckoWalletAccount = {
  account: string
  publicKey: string
}

export type EckoWalletConnectSuccess = {
  status: 'success'
  message: 'Connected successfully'
  account: EckoWalletAccount
}

export type EckoWalletConnectFail = {
  status: 'fail'
  message: 'Connect fail'
}
