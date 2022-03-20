import { createClient } from 'urql'
import { graphExchange } from '@graphprotocol/client-urql'
import { getBuiltGraphClient } from '../.graphclient'

const client = createClient({
  url: 'http://localhost:4000/graphql',
  exchanges: [graphExchange(getBuiltGraphClient)],
})

export default client
