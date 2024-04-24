import { db } from '../db.js'
import {
  type PromiseNotification,
  type ResolvedNotification,
  isPromise,
} from './types.js'

export const createNotification = async (
  payload: PromiseNotification | ResolvedNotification,
) => {
  if (!payload.account) {
    console.error('Cant create notification for account: undefined')
    return
  }

  if (isPromise(payload)) {
    const id = await db.notifications.add({
      account: payload.account,
      chainId: payload.chainId,
      href: payload.href ?? '',
      txHash: payload.txHash ?? '',
      summary: payload.summary.pending,
      type: payload.type,
      timestamp: payload.timestamp,
      groupTimestamp: payload.groupTimestamp,
    })

    payload.promise
      .then(() =>
        db.notifications.update(id, { summary: payload.summary.completed }),
      )
      .catch(() =>
        db.notifications.update(id, { summary: payload.summary.failed }),
      )
  } else {
    db.notifications.add({
      account: payload.account,
      chainId: payload.chainId,
      href: payload.href ?? '',
      txHash: payload.txHash ?? '',
      summary: payload.summary,
      type: payload.type,
      timestamp: payload.timestamp,
      groupTimestamp: payload.groupTimestamp,
    })
  }
}
