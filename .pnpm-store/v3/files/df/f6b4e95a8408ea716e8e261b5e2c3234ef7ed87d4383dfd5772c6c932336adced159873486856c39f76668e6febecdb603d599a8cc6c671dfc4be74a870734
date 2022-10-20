import * as React from 'react';
import { parseFilterArgs, notifyManager } from '@tanstack/query-core';
import { useQueryClient } from './QueryClientProvider.mjs';
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';

function useIsFetching(arg1, arg2, arg3) {
  const [filters, options = {}] = parseFilterArgs(arg1, arg2, arg3);
  const queryClient = useQueryClient({
    context: options.context
  });
  const queryCache = queryClient.getQueryCache();
  return useSyncExternalStore(React.useCallback(onStoreChange => queryCache.subscribe(notifyManager.batchCalls(onStoreChange)), [queryCache]), () => queryClient.isFetching(filters), () => queryClient.isFetching(filters));
}

export { useIsFetching };
//# sourceMappingURL=useIsFetching.mjs.map
