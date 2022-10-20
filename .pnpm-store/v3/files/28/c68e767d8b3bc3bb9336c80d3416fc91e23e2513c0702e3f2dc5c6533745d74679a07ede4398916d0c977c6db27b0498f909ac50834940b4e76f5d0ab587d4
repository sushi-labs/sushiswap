import { isWalletConnectSession, getLocal, setLocal, removeLocal } from "@walletconnect/utils";
class SessionStorage {
    constructor(storageId = "walletconnect") {
        this.storageId = storageId;
    }
    getSession() {
        let session = null;
        const json = getLocal(this.storageId);
        if (json && isWalletConnectSession(json)) {
            session = json;
        }
        return session;
    }
    setSession(session) {
        setLocal(this.storageId, session);
        return session;
    }
    removeSession() {
        removeLocal(this.storageId);
    }
}
export default SessionStorage;
//# sourceMappingURL=storage.js.map