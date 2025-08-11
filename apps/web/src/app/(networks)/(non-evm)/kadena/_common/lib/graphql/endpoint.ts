import { IS_TESTNET } from '~kadena/_common/constants/is-testnet'

const TEST_GRAPHQL_ENDPOINT = 'http://38.23.32.124:3001/graphql'
export const GRAPHQL_ENDPOINT = IS_TESTNET
  ? TEST_GRAPHQL_ENDPOINT
  : 'https://api.mainnet.kadindexer.io/v0'
