'use client'

// Export pre-configured client
export * from './client.js'

// Export actions
export * from './actions/index.js'

// Export hooks
export * from './hooks/index.js'

// Export systems
export * from './systems/index.js'

// Re-expert getPublicClient
export { getPublicClient } from '@wagmi/core'

// Re-export wagmi
export * from 'wagmi'

// Re-export useConnect to avoid ambiguity
export { useConnect } from './hooks/index.js'

// Re-export @wagmi/core
// export * from '@wagmi/core'
