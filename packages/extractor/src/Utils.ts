import { Token } from 'sushi/currency'

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

export function sortTokenPair(t0: Token, t1: Token): [Token, Token] {
  return t0.sortsBefore(t1) ? [t0, t1] : [t1, t0]
}

export function allFulfilled<T>(ps: Promise<T>[]): Promise<T[]> {
  return Promise.allSettled(ps).then((res) => {
    const out: T[] = []
    res.forEach((r) => {
      if (r.status === 'fulfilled') out.push(r.value)
    })
    return out
  })
}

type FunctionArgs<FunctionType> = FunctionType extends (...args: infer R) => any
  ? R
  : never

export class Index<A, B, Func extends (...args: any) => A> {
  map: Map<A, B>
  func: Func

  constructor(map: Map<A, B>, func: Func) {
    this.map = map
    this.func = func
  }

  get(...x: FunctionArgs<Func>): B | undefined {
    return this.map.get(this.func(...x))
  }

  set(...x: [...FunctionArgs<Func>, B]): typeof this {
    this.map.set(this.func(...x), x[x.length - 1])
    return this
  }

  has(...x: FunctionArgs<Func>): boolean {
    return this.map.has(this.func(...x))
  }
}

export class IndexArray<A, E, Func extends (...args: any) => A> extends Index<
  A,
  E[],
  Func
> {
  push(...x: [...FunctionArgs<Func>, E]): typeof this {
    const arr = this.map.get(this.func(...x))
    if (arr === undefined) this.map.set(this.func(...x), [x[x.length - 1]])
    else arr.push(x[x.length - 1])
    return this
  }
}
