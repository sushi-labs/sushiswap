import { getDatabase } from '../database.js'
import { updateEvent } from '../events.js'

export async function markAsRead({
  account,
  ids,
}: {
  account: `0x${string}` | undefined
  ids: string | string[]
}) {
  try {
    const database = await getDatabase()

    if (!database) {
      throw new Error('Database not initialized')
    }

    if (!account) {
      console.error('Cant mark notifications as read for account: undefined')
      return
    }

    const idList = Array.isArray(ids) ? ids : [ids]

    const tx = database.transaction('notifications', 'readwrite')
    const store = tx.objectStore('notifications')

    const index = store.index('by-account')

    // only iterate notifications belonging to this account
    let cursor = await index.openCursor(account)
    while (cursor) {
      if (idList.includes(cursor.value.id)) {
        await cursor.update({
          ...cursor.value,
          isRead: true,
        })
      }
      cursor = await cursor.continue()
    }

    await tx.done

    dispatchEvent(updateEvent)
  } catch (error) {
    console.error('Error marking notifications as read:', error)
  }
}
