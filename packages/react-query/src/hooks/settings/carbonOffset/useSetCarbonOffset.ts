import { useMutation } from '@tanstack/react-query'

import {queryClient} from "../../../PersistQueryClientProvider";
import {carbonOffsetKey} from "./constants";

export interface UseSetCarbonOffsetPayload {
  value: boolean
}


queryClient.setMutationDefaults(carbonOffsetKey, {
  mutationFn: async ({ value }: UseSetCarbonOffsetPayload) => {
    queryClient.setQueryData<boolean>(carbonOffsetKey, () => {
      console.log('here', value)

      return value
    })
  },
})


export const useSetCarbonOffset = () => {
  return useMutation({
    cacheTime: Infinity,
    mutationKey: carbonOffsetKey,
  })
}
