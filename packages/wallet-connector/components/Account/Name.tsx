import { useEnsName } from 'wagmi'
import { shortenAddress } from '@sushiswap/format'
import { classNames, Typography } from '@sushiswap/ui'
import { ReactNode } from 'react'
import { ChainId } from '@sushiswap/chain'

type Props = {
  address?: string
  children({ name, isEns }: { name: string; isEns: boolean }): JSX.Element
}

function Name({ address, children }: Props): JSX.Element {
  const { data } = useEnsName({
    address,
    chainId: ChainId.ETHEREUM,
  })

  return children({ name: !!data ? data : address, isEns: !!data })
}

export default Name
