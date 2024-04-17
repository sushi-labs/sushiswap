export const delay = async (ms: number) =>
  new Promise((res) => setTimeout(res, ms))

export async function repeatAsync<RetType>(
  times: number,
  delayBetween: number,
  action: () => Promise<RetType>,
  failed: (e?: unknown) => void,
  print?: string,
) {
  let lastException
  for (let i = 0; i < times; ++i) {
    try {
      const ret = await action()
      if (print && i > 0) console.log(`attemps ${print}: ${i + 1}`)
      return ret
    } catch (e) {
      lastException = e
      if (delayBetween) await delay(delayBetween)
    }
  }
  failed(lastException)
}

export async function repeat<RetType>(
  times: number,
  action: () => Promise<RetType>,
): Promise<RetType> {
  for (let i = 0; i < times - 1; ++i) {
    try {
      return await action()
    } catch (_e) {
      // skip
    }
  }
  return await action()
}
