import { createAction } from '@reduxjs/toolkit'

import { Strategy } from './types'

export const setStrategy = createAction<Strategy>('inari/setStrategy')
export const setZapIn = createAction<boolean>('inari/setZapIn')
export const setValues = createAction<{ inputValue: string; outputValue: string }>('inari/setInputValue')
