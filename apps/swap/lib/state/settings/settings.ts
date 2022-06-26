import { createSettings } from './create'

// Create a multicall instance with default settings
export const settings: ReturnType<typeof createSettings> = createSettings()

export const { useSettings } = settings.hooks
