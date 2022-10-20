import * as React from 'react';

const useLatest = current => {
  const storedValue = React.useRef(current);
  React.useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
};

export default useLatest;