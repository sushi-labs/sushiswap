import { ComponentType } from 'react'

export type ExtractProps<T> = T extends ComponentType<infer P> ? P : T

export type AnyTag = keyof JSX.IntrinsicElements
export type PropsOf<Tag> = Tag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[Tag] : never
export type Polymorphic<C, P extends AnyTag> = C & { as?: P } & PropsOf<P>
