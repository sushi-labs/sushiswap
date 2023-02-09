import { useQuery } from '@tanstack/react-query'

import {queryClient} from "../../../PersistQueryClientProvider";
import {carbonOffsetKey} from "./constants";

queryClient.setQueryDefaults(carbonOffsetKey,{
  queryFn: () => {
    const data = queryClient.getQueryData<boolean>(carbonOffsetKey)
    if (typeof data === 'undefined') {
      queryClient.setQueryData<boolean>(carbonOffsetKey, () => {
        return false
      })

      return false
    }

    return data
  },
})

export const useCarbonOffset = () => {
  return useQuery<unknown, unknown, boolean>({
    queryKey: carbonOffsetKey,
    cacheTime: Infinity,
  })
}
