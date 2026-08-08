import { createProductionConfig } from './production'
import type { PublicWagmiConfig } from './public'
import { createTestConfig } from './test'

export { createProductionConfig }
export { createTestConfig }

const createWagmiConfig = () => {
  const isTest = process.env.NEXT_PUBLIC_APP_ENV === 'test'

  const config = (() => {
    if (isTest) {
      return createTestConfig() as unknown as PublicWagmiConfig
    }
    return createProductionConfig()
  })()

  return config as PublicWagmiConfig
}

const wagmiConfigSingleton = createWagmiConfig()

export const getWagmiConfig = () => wagmiConfigSingleton
