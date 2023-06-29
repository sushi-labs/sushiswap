import {useCallback} from "react";

import {createNotification} from "./createNotification";

export const useCreateNotification = ({ account } : { account: string | `0x${string}`| undefined}) => {
   return useCallback(createNotification, [account])
}
