import { useRef, useEffect } from 'react';

var useLatest = current => {
  var storedValue = useRef(current);
  useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
};

export default useLatest;
//# sourceMappingURL=index.dev.mjs.map
