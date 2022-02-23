import { ComponentType } from 'react'

export type ExtractProps<T> = T extends ComponentType<infer P> ? P : T
