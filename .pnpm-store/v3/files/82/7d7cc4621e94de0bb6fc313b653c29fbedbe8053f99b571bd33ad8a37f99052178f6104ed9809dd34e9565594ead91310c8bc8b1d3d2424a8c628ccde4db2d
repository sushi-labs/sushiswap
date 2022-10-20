import * as React from 'react'

function useEvent<
  T extends Window = Window,
  K extends keyof WindowEventMap = keyof WindowEventMap
>(
  target: Window | null,
  type: K,
  listener: WindowEventListener<K>,
  cleanup?: (...args: any[]) => void
): void
function useEvent<
  T extends Document = Document,
  K extends keyof DocumentEventMap = keyof DocumentEventMap
>(
  target: Document | null,
  type: K,
  listener: DocumentEventListener<K>,
  cleanup?: (...args: any[]) => void
): void
function useEvent<
  T extends HTMLElement = HTMLElement,
  K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
>(
  target: React.RefObject<T> | T | null,
  type: K,
  listener: ElementEventListener<K>,
  cleanup?: (...args: any[]) => void
): void
function useEvent(target: any, type: any, listener: any, cleanup: any): void {
  const storedListener = React.useRef(listener)
  const storedCleanup = React.useRef(cleanup)

  React.useEffect(() => {
    storedListener.current = listener
    storedCleanup.current = cleanup
  })

  React.useEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (!targetEl) return

    let didUnsubscribe = 0
    function listener(this: any, ...args: any[]) {
      if (didUnsubscribe) return
      storedListener.current.apply(this, args)
    }

    targetEl.addEventListener(type, listener)
    const cleanup = storedCleanup.current

    return () => {
      didUnsubscribe = 1
      targetEl.removeEventListener(type, listener)
      cleanup && cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, type])
}

export type ElementEventListener<
  K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap
> = (this: HTMLElement, ev: HTMLElementEventMap[K]) => any

export type DocumentEventListener<
  K extends keyof DocumentEventMap = keyof DocumentEventMap
> = (this: Document, ev: DocumentEventMap[K]) => any

export type WindowEventListener<
  K extends keyof WindowEventMap = keyof WindowEventMap
> = (this: Document, ev: WindowEventMap[K]) => any

export default useEvent
