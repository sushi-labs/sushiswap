import {renderHook, act} from '@testing-library/react-hooks'
import {useThrottle, useThrottleCallback} from './index'

jest.useFakeTimers()
const renderThrottle = (callback, ...args) =>
  renderHook(() => useThrottle(callback, ...args))
const renderThrottleCallback = (callback, ...args) =>
  renderHook(() => useThrottleCallback(callback, ...args))

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
        // @ts-ignore
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

describe('useThrottle()', () => {
  beforeEach(perf.install)
  afterEach(perf.uninstall)

  it('should fire at a rate of 30fps', () => {
    const cb = jest.fn()
    const {result} = renderThrottleCallback(cb, 30)

    for (let i = 0; i < 1 + Math.ceil(1000 / 30) * 2; i++) {
      perf.advanceBy(1)
      act(result.current)
    }

    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should fire at a rate of 60fps', () => {
    const cb = jest.fn()
    const {result} = renderThrottleCallback(cb, 60)

    for (let i = 0; i < 1 + Math.ceil(1000 / 60) * 4; i++) {
      perf.advanceBy(1)
      act(result.current)
    }

    expect(cb).toHaveBeenCalledTimes(4)
  })

  it('should fire a trailing call', () => {
    const cb = jest.fn()
    const {result} = renderThrottleCallback(cb, 60)

    act(result.current)
    perf.advanceBy(Math.ceil(1000 / 60))
    act(result.current)

    expect(cb).toHaveBeenCalledTimes(1)
    act(result.current)

    expect(cb).toHaveBeenCalledTimes(1)
    act(() => jest.advanceTimersByTime(1000 / 60))
    expect(cb).toHaveBeenCalledTimes(2)
  })

  test('callback leading', () => {
    const cb = jest.fn()
    const {result} = renderThrottleCallback(cb, 30, true)

    act(result.current)

    for (let i = 0; i < Math.ceil(1000 / 30) + 1; i++) {
      perf.advanceBy(1)
      act(result.current)
    }

    act(() => {
      jest.advanceTimersByTime(1000 / 30)
    })

    expect(cb).toHaveBeenCalledTimes(3)
  })

  it('should set the value provided to the callback', () => {
    const {result} = renderThrottle(1, 30)

    act(() => result.current[1](2))
    expect(result.current[0]).toBe(1)

    perf.advanceBy(1000 / 60)
    act(() => result.current[1](3))
    expect(result.current[0]).toBe(1)

    perf.advanceBy(1000 / 60)
    act(() => result.current[1](4))
    expect(result.current[0]).toBe(4)
  })

  it('should set value on first call when "leading" is true', () => {
    const {result} = renderThrottle(1, 30, true)

    act(() => result.current[1](2))
    expect(result.current[0]).toBe(2)

    perf.advanceBy(1000 / 60)
    act(() => result.current[1](3))
    expect(result.current[0]).toBe(2)

    perf.advanceBy(1000 / 60)
    act(() => result.current[1](4))
    expect(result.current[0]).toBe(4)
  })
})
