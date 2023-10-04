import { Dexie, type Table } from 'dexie'

import { type ResolvedNotification } from './notifications/index.js'
import { type SavedToken } from './tokens/index.js'

export class SushiswapDexie extends Dexie {
  notifications!: Table<ResolvedNotification & { account: string }>
  tokens!: Table<SavedToken>

  constructor() {
    super('sushi')
    this.version(1).stores({
      notifications: '++id, account, chainId, href, txHash, summary, type, timestamp, groupTimestamp',
      tokens: 'id, address, chainId, decimals, name, symbol, status',
    })
  }
}

export const db = new SushiswapDexie()
