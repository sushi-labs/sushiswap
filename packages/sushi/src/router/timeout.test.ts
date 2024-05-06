import { describe, it } from 'vitest'
import { promiseTimeout } from './timeout.js'

const sleep = async (ms: number, msg = '') => {
  let _timeoutReference
  return new Promise((resolve) => {
    _timeoutReference = setTimeout(() => resolve(msg), ms)
    return _timeoutReference
  }).finally(() => clearTimeout(_timeoutReference))
}

describe('Promise Timeout', async () => {
  it('should timeout', async () => {
    const mainPromise = sleep(1000)
    await promiseTimeout(mainPromise, 500)
      .then(() => {
        throw 'expected to reject, but resolved'
      })
      .catch(() => {
        /**/
      })
  })
  it('should NOT timeout', async () => {
    const mainPromise = sleep(1000)
    await promiseTimeout(mainPromise, 1500)
      .then(() => {
        /**/
      })
      .catch(() => {
        throw 'expected to resolve, but rejected'
      })
  })
})
