import * as React from 'react';
import { QueriesObserver, notifyManager } from '@tanstack/query-core';
import { useQueryClient } from './QueryClientProvider.mjs';
import { useIsRestoring } from './isRestoring.mjs';
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';

// - `context` is omitted as it is passed as a root-level option to `useQueries` instead.

function useQueries({
  queries,
  context
}) {
  const queryClient = useQueryClient({
    context
  });
  const isRestoring = useIsRestoring();
  const defaultedQueries = React.useMemo(() => queries.map(options => {
    const defaultedOptions = queryClient.defaultQueryOptions(options); // Make sure the results are already in fetching state before subscribing or updating options

    defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic';
    return defaultedOptions;
  }), [queries, queryClient, isRestoring]);
  const [observer] = React.useState(() => new QueriesObserver(queryClient, defaultedQueries));
  const result = observer.getOptimisticResult(defaultedQueries);
  useSyncExternalStore(React.useCallback(onStoreChange => isRestoring ? () => undefined : observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  React.useEffect(() => {
    // Do not notify on updates because of changes in the options because
    // these changes should already be reflected in the optimistic result.
    observer.setQueries(defaultedQueries, {
      listeners: false
    });
  }, [defaultedQueries, observer]);
  return result;
}

export { useQueries };
//# sourceMappingURL=useQueries.mjs.map
