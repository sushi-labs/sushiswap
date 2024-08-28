import { IS_TESTNET } from './is-testnet'

export const FACTORY_CONTRACT = IS_TESTNET
  ? ''
  : 'TKWJdrQkqHisa1X8HUdHEfREvTzw4pMAaY' //sun.io factory contract address
export const ROUTER_CONTRACT = IS_TESTNET
  ? ''
  : 'TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax' //sun.io router contract address
export const MULTICALL_CONTRACT = IS_TESTNET
  ? ''
  : 'TGXuuKAb4bnrn137u39EKbYzKNXvdCes98'
