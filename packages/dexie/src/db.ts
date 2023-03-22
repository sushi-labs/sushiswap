import Dexie, { Table } from 'dexie';

import {ResolvedNotification} from "./hooks";

export class SushiswapDexie extends Dexie {
    notifications!: Table<ResolvedNotification & { account: string }>

    constructor() {
        super('sushi');
        this.version(1).stores({
            notifications: '++id, account, chainId, href, txHash, summary, type, timestamp, groupTimestamp', // Primary key and indexed props
        })
    }

}

export const db = new SushiswapDexie();
