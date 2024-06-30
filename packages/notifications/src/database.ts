import { type DBSchema, openDB } from 'idb'

import type { ResolvedNotification } from './types'

interface NotificationDatabase extends DBSchema {
  notifications: {
    value: ResolvedNotification
    key: number
    indexes: { 'by-account': string }
  }
}

export const database = await (async () => {
  if (typeof localStorage === 'undefined') {
    return
  }

  return openDB<NotificationDatabase>('notifications', 1, {
    upgrade(db) {
      const notificationStore = db.createObjectStore('notifications', {
        keyPath: 'id',
        autoIncrement: true,
      })

      notificationStore.createIndex('by-account', 'account')
    },
  })
})()

export let updateCounter = 0
export function onUpdate() {
  updateCounter++
}
