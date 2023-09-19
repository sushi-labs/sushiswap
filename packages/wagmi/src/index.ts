'use client'

// Export pre-configured client
export * from './client'

// Export actions
export * from './actions'

// Export hooks
export * from './hooks'

// Export systems
export * from './systems'

// Re-export getPublicClient
export { getPublicClient } from '@wagmi/core'

// Re-export wagmi
export * from 'wagmi'

// Re-export useConnect to avoid ambiguity
export { useConnect } from './hooks'

// Re-export @wagmi/core
// export * from '@wagmi/core'
