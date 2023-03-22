import Dexie, { Table } from 'dexie';

import {ResolvedNotification} from "./notifications";
import {SavedToken} from "./tokens";

export class SushiswapDexie extends Dexie {
    notifications!: Table<ResolvedNotification & { account: string }>
    tokens!: Table<SavedToken>

    constructor() {
        super('sushi');
        this.version(1).stores({
            notifications: '++id, account, chainId, href, txHash, summary, type, timestamp, groupTimestamp',
            tokens: 'id, address, chainId, decimals, name, symbol, status'
        })
    }

}

export const db = new SushiswapDexie();
