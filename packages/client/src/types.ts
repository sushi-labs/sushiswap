/**
 * API is called with strings as arguments, need to convert those into their respective types.
 * ALso need to consider zod.defaults, which is why we can't use the output type directly.
 */
export type GetApiInputFromOutput<I extends object, O extends Partial<Record<keyof I, unknown>>> = {
  [K in keyof I]: (I[K] extends undefined ? undefined : unknown) & O[K]
}
