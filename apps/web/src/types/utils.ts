export type IsEqual<A, B> = (<G>() => G extends (A & G) | G ? 1 : 2) extends <
  G,
>() => G extends (B & G) | G ? 1 : 2
  ? A
  : never

export type IsEqualMultiple<T extends readonly unknown[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? Rest extends readonly []
    ? First
    : Rest extends readonly [infer Second, ...infer Tail]
      ? IsEqual<First, Second> extends never
        ? never
        : IsEqualMultiple<[First, ...Tail]>
      : never
  : never
