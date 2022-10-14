import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, configureChains, createClient } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from '@wagmi/core/providers/public'

const apiKey = process.env.ALCHEMY_ID as string

createClient(configureChains([...allChains, ...otherChains], [publicProvider(), alchemyProvider({ apiKey })]))
