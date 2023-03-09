export type LoadingState<T> = { isLoading: true; isError: boolean; data?: T }
export type SuccessState<T> = { isLoading: false; isError: boolean; data: T }
export type ErrorState<T> = { isLoading: false; isError: true; data?: T }
