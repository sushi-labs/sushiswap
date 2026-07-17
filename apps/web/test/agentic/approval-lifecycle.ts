export type ApprovalLifecycleState =
  | 'allowance-refreshed'
  | 'failed'
  | 'gate-open'
  | 'idle'
  | 'receipt-found'
  | 'receipt-success'
  | 'request-created'
  | 'transaction-broadcast'
  | 'wallet-accepted'

export type ApprovalLifecycleEvent =
  | { readonly type: 'allowance-refreshed'; readonly sufficient: boolean }
  | { readonly reason: string; readonly type: 'failed' }
  | { readonly type: 'receipt-found'; readonly status: 'reverted' | 'success' }
  | { readonly type: 'request-created' }
  | { readonly type: 'transaction-broadcast' }
  | { readonly type: 'wallet-accepted' }

export interface ApprovalLifecycle {
  readonly failureReason?: string
  readonly history: readonly ApprovalLifecycleState[]
  readonly state: ApprovalLifecycleState
}

export function initialApprovalLifecycle(): ApprovalLifecycle {
  return { history: ['idle'], state: 'idle' }
}

export function transitionApprovalLifecycle(
  lifecycle: ApprovalLifecycle,
  event: ApprovalLifecycleEvent,
): ApprovalLifecycle {
  if (lifecycle.state === 'failed' || lifecycle.state === 'gate-open') {
    throw new Error(`Approval lifecycle is terminal at ${lifecycle.state}`)
  }

  if (event.type === 'failed') {
    return next(lifecycle, 'failed', event.reason)
  }

  switch (lifecycle.state) {
    case 'idle':
      requireEvent(event, 'request-created')
      return next(lifecycle, 'request-created')
    case 'request-created':
      requireEvent(event, 'wallet-accepted')
      return next(lifecycle, 'wallet-accepted')
    case 'wallet-accepted':
      requireEvent(event, 'transaction-broadcast')
      return next(lifecycle, 'transaction-broadcast')
    case 'transaction-broadcast':
      requireEvent(event, 'receipt-found')
      if (event.status === 'reverted') {
        return next(lifecycle, 'failed', 'Transaction receipt reverted')
      }
      return next(next(lifecycle, 'receipt-found'), 'receipt-success')
    case 'receipt-found':
      throw new Error('Receipt status must be handled with receipt discovery')
    case 'receipt-success':
      requireEvent(event, 'allowance-refreshed')
      if (!event.sufficient) {
        return next(
          lifecycle,
          'failed',
          'Fresh allowance is still insufficient',
        )
      }
      return next(next(lifecycle, 'allowance-refreshed'), 'gate-open')
    case 'allowance-refreshed':
      throw new Error('Allowance refresh must immediately resolve the gate')
  }
}

function next(
  lifecycle: ApprovalLifecycle,
  state: ApprovalLifecycleState,
  failureReason?: string,
): ApprovalLifecycle {
  return {
    failureReason,
    history: [...lifecycle.history, state],
    state,
  }
}

function requireEvent<TType extends ApprovalLifecycleEvent['type']>(
  event: ApprovalLifecycleEvent,
  type: TType,
): asserts event is Extract<ApprovalLifecycleEvent, { readonly type: TType }> {
  if (event.type !== type) {
    throw new Error(`Expected approval event ${type}, received ${event.type}`)
  }
}
