import { client } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'
import { WagmiConfig } from '@sushiswap/wagmi'

export const WagmiProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
)
