export function getClearinghouseStateForDex<T>(
  clearinghouseStates:
    | readonly (readonly [dex: string, state: T])[]
    | undefined,
  dexName: string,
): T | undefined {
  return clearinghouseStates?.find(([dex]) => dex === dexName)?.[1]
}
