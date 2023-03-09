import { useAccount } from 'wagmi'

import { useNotifications } from '../state/storage'

export const useCreateNotification = () => {
  const { address } = useAccount()
  const [, { createNotification }] = useNotifications(address)
  return createNotification
}
