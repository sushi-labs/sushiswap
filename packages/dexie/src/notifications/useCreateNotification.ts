import { useCallback } from 'react'

import { createNotification } from './createNotification.js'

export const useCreateNotification = () => {
  return useCallback(createNotification, [])
}
