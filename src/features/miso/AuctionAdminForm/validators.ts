import { getAddress } from '@ethersproject/address'

interface ValidatorData {
  value: string
  imageSizeThreshold?: number
  maxCharactersThreshold?: number
}

type Validator = (data: ValidatorData) => Promise<string | boolean>

export const isAddressValidator: Validator = async (data) => {
  if (!data.value) return 'Invalid input'
  try {
    getAddress(data.value)
  } catch {
    return 'Invalid address'
  }

  return true
}

// @ts-ignore TYPE NEEDS FIXING
export const pipeline = async (data: ValidatorData, validators: Validator[], resolve, reject) => {
  // Always set field on input
  resolve()

  // No validation required
  if (data.value.length === 0) {
    // Reset error
    reject()
    return resolve()
  }

  try {
    await Promise.all(
      validators.map(async (validator) => {
        const result = await validator(data)
        if (typeof result === 'string') {
          throw new Error(result)
        }

        return true
      })
    )

    // Reset error
    reject()
  } catch (e) {
    // @ts-ignore TYPE NEEDS FIXING
    reject(e.message)
  }
}

export const testImage = (url?: string, timeout?: number) =>
  new Promise((res) => {
    timeout = timeout || 5000
    let timedOut = false
    // @ts-ignore TYPE NEEDS FIXING
    let timer
    const img = new Image()

    img.onerror = img.onabort = function () {
      if (!timedOut) {
        // @ts-ignore TYPE NEEDS FIXING
        clearTimeout(timer)
        res('error')
      }
    }

    img.onload = function () {
      if (!timedOut) {
        // @ts-ignore TYPE NEEDS FIXING
        clearTimeout(timer)
        res('success')
      }
    }

    img.src = url || ''

    timer = setTimeout(function () {
      timedOut = true
      // reset .src to invalid URL so it stops previous
      // loading, but doesn't trigger new load
      img.src = '//!!!!/test.jpg'
      res('timeout')
    }, timeout)
  })
