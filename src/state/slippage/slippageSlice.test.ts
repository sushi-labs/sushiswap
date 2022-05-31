import { Percent } from '@sushiswap/core-sdk'
import store, { AppState } from 'app/state'

import {
  formatSlippageInput,
  GLOBAL_DEFAULT_SLIPPAGE_PERCENT,
  GLOBAL_DEFAULT_SLIPPAGE_STR,
  selectSlippage,
  selectSlippageWithDefault,
  setSlippageInput,
  SlippageError,
  slippageSelectors,
  SlippageSliceState,
} from './slippageSlice'

describe('Slippage slice', () => {
  let slippageState: SlippageSliceState

  const getLatestState = () => {
    slippageState = store.getState().slippage
  }

  beforeEach(() => {
    slippageState = store.getState().slippage
  })

  afterEach(() => {
    store.dispatch(setSlippageInput(GLOBAL_DEFAULT_SLIPPAGE_STR))
  })

  it('should return the correct initial state', () => {
    expect(slippageState.input).toEqual(GLOBAL_DEFAULT_SLIPPAGE_STR)
  })

  it('should be able to change state', () => {
    const testStr = '.135'
    store.dispatch(setSlippageInput(testStr))
    getLatestState()
    expect(slippageState.input).toEqual(testStr)
  })

  describe('formatSlippageInput', () => {
    it('should format correctly with valid inputs', () => {
      store.dispatch(setSlippageInput('.3'))
      store.dispatch(formatSlippageInput())
      getLatestState()
      expect(slippageState.input).toEqual('0.30')

      store.dispatch(setSlippageInput('1.33'))
      store.dispatch(formatSlippageInput())
      getLatestState()
      expect(slippageState.input).toEqual('1.33')

      store.dispatch(setSlippageInput('5.655'))
      store.dispatch(formatSlippageInput())
      getLatestState()
      expect(slippageState.input).toEqual('5.66')

      store.dispatch(setSlippageInput('20'))
      store.dispatch(formatSlippageInput())
      getLatestState()
      expect(slippageState.input).toEqual('20.00')
    })

    it('should not change the value if it is already invalid', () => {
      store.dispatch(setSlippageInput('abcd'))
      store.dispatch(formatSlippageInput())
      getLatestState()
      expect(slippageState.input).toEqual('abcd')

      store.dispatch(setSlippageInput('.'))
      store.dispatch(formatSlippageInput())
      getLatestState()
      expect(slippageState.input).toEqual('.')

      store.dispatch(setSlippageInput(''))
      store.dispatch(formatSlippageInput())
      getLatestState()
      expect(slippageState.input).toEqual('')
    })
  })

  describe('slippageSelectors', () => {
    describe('input', () => {
      it('passes on input selector', () => {
        store.dispatch(setSlippageInput('test'))
        getLatestState()
        const selectors = slippageSelectors({ slippage: slippageState } as AppState)
        expect(selectors.input).toEqual('test')
      })
    })

    describe('error state', () => {
      it('handles invalid inputs', () => {
        store.dispatch(setSlippageInput('invalid'))
        getLatestState()
        const { error } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(error).toEqual(SlippageError.INVALID_INPUT)
      })

      it('handles zero', () => {
        store.dispatch(setSlippageInput('0'))
        getLatestState()
        const { error } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(error).toEqual(SlippageError.INVALID_INPUT)
      })

      it('handles negative inputs', () => {
        store.dispatch(setSlippageInput('-1.3'))
        getLatestState()
        const { error } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(error).toEqual(SlippageError.INVALID_INPUT)
      })

      it('handles inputs too small', () => {
        store.dispatch(setSlippageInput('.01'))
        getLatestState()
        const { error } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(error).toEqual(SlippageError.TOO_LOW)
      })

      it('handles inputs way too small', () => {
        store.dispatch(setSlippageInput('.001'))
        getLatestState()
        const { error } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(error).toEqual(SlippageError.INVALID_INPUT)
      })

      it('handles inputs too large', () => {
        store.dispatch(setSlippageInput('4'))
        getLatestState()
        const { error } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(error).toEqual(SlippageError.TOO_HIGH)
      })

      it('handles inputs way too large', () => {
        store.dispatch(setSlippageInput('60'))
        getLatestState()
        const { error } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(error).toEqual(SlippageError.INVALID_INPUT)
      })
    })

    describe('percent', () => {
      it('passes on slippage selector', () => {
        store.dispatch(setSlippageInput('1'))
        getLatestState()
        const { percent } = slippageSelectors({ slippage: slippageState } as AppState)
        expect(percent.equalTo(new Percent(1, 100))).toBeTruthy()
      })
    })
  })

  describe('selectSlippage', () => {
    it('correctly parses input', () => {
      store.dispatch(setSlippageInput('.2'))
      getLatestState()
      const slippage = selectSlippage({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(new Percent(2, 1000))).toBeTruthy()
    })

    it('correctly defaults to the global if input is not valid', () => {
      store.dispatch(setSlippageInput('.'))
      getLatestState()
      const slippage = selectSlippage({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(GLOBAL_DEFAULT_SLIPPAGE_PERCENT)).toBeTruthy()
    })

    it('correctly selects even if too high error is given', () => {
      store.dispatch(setSlippageInput('33'))
      getLatestState()
      const slippage = selectSlippage({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(new Percent(33, 100))).toBeTruthy()
    })

    it('correctly defaults to the global if input way too high', () => {
      store.dispatch(setSlippageInput('120'))
      getLatestState()
      const slippage = selectSlippage({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(GLOBAL_DEFAULT_SLIPPAGE_PERCENT)).toBeTruthy()
    })

    it('correctly defaults to global if way too low', () => {
      store.dispatch(setSlippageInput('.0001'))
      getLatestState()
      const slippage = selectSlippage({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(GLOBAL_DEFAULT_SLIPPAGE_PERCENT)).toBeTruthy()
    })

    it('correctly selects even if too low error is given', () => {
      store.dispatch(setSlippageInput('.01'))
      getLatestState()
      const slippage = selectSlippage({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(new Percent(1, 10_000))).toBeTruthy()
    })
  })

  describe('selectSlippageWithDefault', () => {
    it('goes to default if invalid input', () => {
      const fallbackPercent = new Percent(4, 10_000)
      store.dispatch(setSlippageInput('adsf'))
      getLatestState()
      const slippage = selectSlippageWithDefault(fallbackPercent)({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(fallbackPercent)).toBeTruthy()
    })

    it('parses correctly if valid input', () => {
      const fallbackPercent = new Percent(4, 10_000)
      store.dispatch(setSlippageInput('.2'))
      getLatestState()
      const slippage = selectSlippageWithDefault(fallbackPercent)({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(fallbackPercent)).toBeFalsy()
      expect(slippage.equalTo(new Percent(2, 1000))).toBeTruthy()
    })

    it('Does not default even if too high', () => {
      const fallbackPercent = new Percent(4, 10_000)
      store.dispatch(setSlippageInput('20'))
      getLatestState()
      const slippage = selectSlippageWithDefault(fallbackPercent)({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(fallbackPercent)).toBeFalsy()
      expect(slippage.equalTo(new Percent(20, 100))).toBeTruthy()
    })

    it('Does not default even if too low', () => {
      const fallbackPercent = new Percent(4, 10_000)
      store.dispatch(setSlippageInput('.01'))
      getLatestState()
      const slippage = selectSlippageWithDefault(fallbackPercent)({ slippage: slippageState } as AppState)
      expect(slippage.equalTo(fallbackPercent)).toBeFalsy()
      expect(slippage.equalTo(new Percent(1, 10_000))).toBeTruthy()
    })
  })
})
