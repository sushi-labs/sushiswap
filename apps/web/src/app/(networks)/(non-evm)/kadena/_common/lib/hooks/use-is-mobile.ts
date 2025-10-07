import { useEffect, useState } from 'react'

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent
    const mobileRegex =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

    setIsMobile(mobileRegex.test(userAgent))
  }, [])

  return { isMobile }
}
