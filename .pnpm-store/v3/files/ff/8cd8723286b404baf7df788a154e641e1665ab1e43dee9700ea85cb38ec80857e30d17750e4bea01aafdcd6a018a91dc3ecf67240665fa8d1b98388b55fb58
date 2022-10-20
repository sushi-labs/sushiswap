import * as React from 'react'

const useLatest = <T extends any>(current: T) => {
  const storedValue = React.useRef(current)
  React.useEffect(() => {
    storedValue.current = current
  })
  return storedValue
}

export default useLatest
