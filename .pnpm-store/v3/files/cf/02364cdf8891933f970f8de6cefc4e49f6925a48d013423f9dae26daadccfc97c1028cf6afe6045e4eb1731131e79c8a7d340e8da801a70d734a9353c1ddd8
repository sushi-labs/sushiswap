import {useThrottle} from '@react-hook/throttle'
import useEvent from '@react-hook/event'

const win = typeof window === 'undefined' ? null : window
const getScrollY = (): number =>
  (win as Window).scrollY !== void 0
    ? (win as Window).scrollY
    : (win as Window).pageYOffset === void 0
    ? 0
    : (win as Window).pageYOffset

export const useWindowScroll = (fps = 30): number => {
  const state = useThrottle(
    typeof window === 'undefined' ? 0 : getScrollY,
    fps,
    true
  )
  useEvent(win, 'scroll', (): void => state[1](getScrollY()))
  return state[0]
}

export default useWindowScroll
