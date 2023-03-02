import {NotificationData, NotificationStoredData} from '@sushiswap/ui/future/components/toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {nanoid} from "nanoid";

const createNotification = (id: string, prevData: Record<string, NotificationStoredData[]> | undefined, payload: NotificationData, state: 'failed' | 'pending' | 'completed') => {
  const { promise, summary, ...data } = payload

  const notification: NotificationStoredData = {
    ...data,
    id,
    summary: summary[state]
  }

  if (!prevData) {
    return {
      [payload.timestamp.toString()]: [notification],
    }
  } else {
    const state = { ...prevData }
    const index = state[payload.timestamp.toString()]?.findIndex(el => el.id === id)

    // Update notification if already added
    if (index >= 0) {
      state[payload.timestamp.toString()][index] = notification
    }

    // We got a group notification, push to group
    else if (state[payload.timestamp.toString()]) {
      state[payload.timestamp.toString()].push(notification)
    }

    else {
      state[payload.timestamp.toString()] = [notification]
    }

    return state
  }
}

export const useCreateNotification = ({ account }: { account: `0x${string}` | undefined }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['notifications', { account }],
    mutationFn: async (payload: NotificationData) => {
      const id = nanoid()
      // Set pending state initially
      queryClient.setQueryData<Record<string, NotificationStoredData[]>>(['notifications', { account }], (prevData) =>  createNotification(id, prevData, payload, 'pending'))

      // Check on promise and override when settled
      payload.promise.then(() => {
        queryClient.setQueryData<Record<string, NotificationStoredData[]>>(['notifications', { account }], (prevData) => createNotification(id, prevData, payload, 'completed'))
      }).catch(() => {
        queryClient.setQueryData<Record<string, NotificationStoredData[]>>(['notifications', { account }], (prevData) => createNotification(id, prevData, payload, 'failed'))
      })
    },
  })
}
