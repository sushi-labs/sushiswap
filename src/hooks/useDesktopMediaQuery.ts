import getConfig from 'next/config'
import { useMediaQuery } from 'react-responsive'
const { publicRuntimeConfig } = getConfig()

const useDesktopMediaQuery = () => {
  const { breakpoints } = publicRuntimeConfig
  return useMediaQuery({ query: `(min-width: ${breakpoints.lg}` })
}

export const useTouchDeviceMediaQuery = () => {
  return useMediaQuery({ query: `(hover: none) and (pointer: coarse)` })
}

export default useDesktopMediaQuery
