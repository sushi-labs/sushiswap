"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBlockchainProvider = exports.IBlockchainAuthenticator = exports.IPendingRequests = void 0;
const misc_1 = require("./misc");
const provider_1 = require("./provider");
class IPendingRequests {
    constructor(storage) {
        this.storage = storage;
    }
}
exports.IPendingRequests = IPendingRequests;
class IBlockchainAuthenticator extends misc_1.IEvents {
    constructor(config) {
        super();
        this.config = config;
    }
}
exports.IBlockchainAuthenticator = IBlockchainAuthenticator;
class IBlockchainProvider extends provider_1.IJsonRpcProvider {
    constructor(connection, config) {
        super(connection);
    }
}
exports.IBlockchainProvider = IBlockchainProvider;
//# sourceMappingURL=blockchain.js.map