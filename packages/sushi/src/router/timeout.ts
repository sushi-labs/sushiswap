export async function promiseTimeout(
  promise: Promise<any>,
  time: number,
  exception?: any,
) {
  let timer: any
  return Promise.race([
    promise,
    new Promise((_res, _rej) => {
      timer = setTimeout(_rej, time, exception)
      return timer
    }),
  ]).finally(() => clearTimeout(timer))
}
