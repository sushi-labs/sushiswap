import { useThrottle } from '@react-hook/throttle';
import useEvent from '@react-hook/event';
const win = typeof window === 'undefined' ? null : window;

const getScrollY = () => win.scrollY !== void 0 ? win.scrollY : win.pageYOffset === void 0 ? 0 : win.pageYOffset;

export const useWindowScroll = (fps = 30) => {
  const state = useThrottle(typeof window === 'undefined' ? 0 : getScrollY, fps, true);
  useEvent(win, 'scroll', () => state[1](getScrollY()));
  return state[0];
};
export default useWindowScroll;