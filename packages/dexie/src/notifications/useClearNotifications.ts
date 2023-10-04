
import {useCallback} from "react";

import {db} from "../db.js";

export const useClearNotifications = ({ account} : { account: string | `0x${string}`| undefined}) => {
    return useCallback(async () => {
        if (!account) return

        return db.notifications.where('account').equals(account).delete()
    }, [account])
}
