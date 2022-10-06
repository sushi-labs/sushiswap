import { Token } from 'lib'

import { TokenTable } from './TokenTable'

interface Tokens {
  tokens: Token[]
}

export function Tokens({ tokens }: Tokens) {
  return (
    <>
      <TokenTable tokens={tokens} />
    </>
  )
}
