import {renderHook, act} from '@testing-library/react-hooks'
import useWindowScroll from './index'

const renderWindowScroll = (...args): any =>
  renderHook(() => useWindowScroll(...args))
const scrollEvent = document.createEvent('Event')
scrollEvent.initEvent('scroll', true, true)
const scrollTo = (value): void => {
  Object.defineProperty(window, 'scrollY', {value, configurable: true})
  window.dispatchEvent(scrollEvent)
}
const resetScroll = (): void => {
  scrollTo(0)
}

const mockPerf = () => {
  // @ts-ignore
  const original = global?.performance
  let ts = (typeof performance !== 'undefined' ? performance : Date).now()

  return {
    install: () => {
      ts = Date.now()
      const perfNowStub = jest
        .spyOn(performance, 'now')
        .mockImplementation(() => ts)
      // @ts-ignore
      global.performance = {
        now: perfNowStub,
      }
    },
    advanceBy: (amt: number) => (ts += amt),
    advanceTo: (t: number) => (ts = t),
    uninstall: () => {
      if (original) {
        //@ts-ignore
        global.performance = original
      }
    },
  }
}

const perf = mockPerf()
jest.useFakeTimers()

describe('useWindowScroll()', () => {
  beforeEach(() => {
    perf.install()
    resetScroll()
  })

  afterEach(perf.uninstall)

  it('should update scroll positon at 30fps', () => {
    const {result} = renderWindowScroll()
    act(() => scrollTo(1)) // fires leading
    expect(result.current).toBe(1)

    let i = 0

    for (; i < Math.ceil(1000 / 30); i++) {
      perf.advanceBy(1)
      expect(result.current).toBe(1)
      act(() => scrollTo(i))
    }

    expect(result.current).toBe(33)
  })

  it('should update scroll positon at 60fps', () => {
    const {result} = renderWindowScroll(60)
    act(() => scrollTo(1)) // fires leading
    expect(result.current).toBe(1)

    let i = 0

    for (; i < Math.ceil(1000 / 60); i++) {
      perf.advanceBy(1)
      expect(result.current).toBe(1)
      act(() => scrollTo(i))
    }

    expect(result.current).toBe(16)

    for (; i < Math.ceil(1000 / 60) * 2; i++) {
      perf.advanceBy(1)
      expect(result.current).toBe(16)
      act(() => scrollTo(i))
    }

    expect(result.current).toBe(33)
  })
})
