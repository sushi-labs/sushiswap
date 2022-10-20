import { parsePersonalSign, parseTransactionData, convertArrayBufferToHex, convertHexToArrayBuffer, getClientMeta, payloadId, uuid, formatRpcError, parseWalletConnectUri, convertNumberToHex, isJsonRpcResponseSuccess, isJsonRpcResponseError, isSilentPayload, getLocal, signingMethods, mobileLinkChoiceKey, isMobile, removeLocal, } from "@walletconnect/utils";
import SocketTransport from "@walletconnect/socket-transport";
import { ERROR_SESSION_CONNECTED, ERROR_SESSION_DISCONNECTED, ERROR_SESSION_REJECTED, ERROR_MISSING_JSON_RPC, ERROR_MISSING_RESULT, ERROR_MISSING_ERROR, ERROR_MISSING_METHOD, ERROR_MISSING_ID, ERROR_INVALID_RESPONSE, ERROR_INVALID_URI, ERROR_MISSING_REQUIRED, ERROR_QRCODE_MODAL_NOT_PROVIDED, ERROR_QRCODE_MODAL_USER_CLOSED, } from "./errors";
import EventManager from "./events";
import SessionStorage from "./storage";
import { getBridgeUrl } from "./url";
class Connector {
    constructor(opts) {
        this.protocol = "wc";
        this.version = 1;
        this._bridge = "";
        this._key = null;
        this._clientId = "";
        this._clientMeta = null;
        this._peerId = "";
        this._peerMeta = null;
        this._handshakeId = 0;
        this._handshakeTopic = "";
        this._connected = false;
        this._accounts = [];
        this._chainId = 0;
        this._networkId = 0;
        this._rpcUrl = "";
        this._eventManager = new EventManager();
        this._clientMeta = getClientMeta() || opts.connectorOpts.clientMeta || null;
        this._cryptoLib = opts.cryptoLib;
        this._sessionStorage = opts.sessionStorage || new SessionStorage(opts.connectorOpts.storageId);
        this._qrcodeModal = opts.connectorOpts.qrcodeModal;
        this._qrcodeModalOptions = opts.connectorOpts.qrcodeModalOptions;
        this._signingMethods = [...signingMethods, ...(opts.connectorOpts.signingMethods || [])];
        if (!opts.connectorOpts.bridge && !opts.connectorOpts.uri && !opts.connectorOpts.session) {
            throw new Error(ERROR_MISSING_REQUIRED);
        }
        if (opts.connectorOpts.bridge) {
            this.bridge = getBridgeUrl(opts.connectorOpts.bridge);
        }
        if (opts.connectorOpts.uri) {
            this.uri = opts.connectorOpts.uri;
        }
        const session = opts.connectorOpts.session || this._getStorageSession();
        if (session) {
            this.session = session;
        }
        if (this.handshakeId) {
            this._subscribeToSessionResponse(this.handshakeId, "Session request rejected");
        }
        this._transport =
            opts.transport ||
                new SocketTransport({
                    protocol: this.protocol,
                    version: this.version,
                    url: this.bridge,
                    subscriptions: [this.clientId],
                });
        this._subscribeToInternalEvents();
        this._initTransport();
        if (opts.connectorOpts.uri) {
            this._subscribeToSessionRequest();
        }
        if (opts.pushServerOpts) {
            this._registerPushServer(opts.pushServerOpts);
        }
    }
    set bridge(value) {
        if (!value) {
            return;
        }
        this._bridge = value;
    }
    get bridge() {
        return this._bridge;
    }
    set key(value) {
        if (!value) {
            return;
        }
        const key = convertHexToArrayBuffer(value);
        this._key = key;
    }
    get key() {
        if (this._key) {
            const key = convertArrayBufferToHex(this._key, true);
            return key;
        }
        return "";
    }
    set clientId(value) {
        if (!value) {
            return;
        }
        this._clientId = value;
    }
    get clientId() {
        let clientId = this._clientId;
        if (!clientId) {
            clientId = this._clientId = uuid();
        }
        return this._clientId;
    }
    set peerId(value) {
        if (!value) {
            return;
        }
        this._peerId = value;
    }
    get peerId() {
        return this._peerId;
    }
    set clientMeta(value) {
    }
    get clientMeta() {
        let clientMeta = this._clientMeta;
        if (!clientMeta) {
            clientMeta = this._clientMeta = getClientMeta();
        }
        return clientMeta;
    }
    set peerMeta(value) {
        this._peerMeta = value;
    }
    get peerMeta() {
        const peerMeta = this._peerMeta;
        return peerMeta;
    }
    set handshakeTopic(value) {
        if (!value) {
            return;
        }
        this._handshakeTopic = value;
    }
    get handshakeTopic() {
        return this._handshakeTopic;
    }
    set handshakeId(value) {
        if (!value) {
            return;
        }
        this._handshakeId = value;
    }
    get handshakeId() {
        return this._handshakeId;
    }
    get uri() {
        const _uri = this._formatUri();
        return _uri;
    }
    set uri(value) {
        if (!value) {
            return;
        }
        const { handshakeTopic, bridge, key } = this._parseUri(value);
        this.handshakeTopic = handshakeTopic;
        this.bridge = bridge;
        this.key = key;
    }
    set chainId(value) {
        this._chainId = value;
    }
    get chainId() {
        const chainId = this._chainId;
        return chainId;
    }
    set networkId(value) {
        this._networkId = value;
    }
    get networkId() {
        const networkId = this._networkId;
        return networkId;
    }
    set accounts(value) {
        this._accounts = value;
    }
    get accounts() {
        const accounts = this._accounts;
        return accounts;
    }
    set rpcUrl(value) {
        this._rpcUrl = value;
    }
    get rpcUrl() {
        const rpcUrl = this._rpcUrl;
        return rpcUrl;
    }
    set connected(value) {
    }
    get connected() {
        return this._connected;
    }
    set pending(value) {
    }
    get pending() {
        return !!this._handshakeTopic;
    }
    get session() {
        return {
            connected: this.connected,
            accounts: this.accounts,
            chainId: this.chainId,
            bridge: this.bridge,
            key: this.key,
            clientId: this.clientId,
            clientMeta: this.clientMeta,
            peerId: this.peerId,
            peerMeta: this.peerMeta,
            handshakeId: this.handshakeId,
            handshakeTopic: this.handshakeTopic,
        };
    }
    set session(value) {
        if (!value) {
            return;
        }
        this._connected = value.connected;
        this.accounts = value.accounts;
        this.chainId = value.chainId;
        this.bridge = value.bridge;
        this.key = value.key;
        this.clientId = value.clientId;
        this.clientMeta = value.clientMeta;
        this.peerId = value.peerId;
        this.peerMeta = value.peerMeta;
        this.handshakeId = value.handshakeId;
        this.handshakeTopic = value.handshakeTopic;
    }
    on(event, callback) {
        const eventEmitter = {
            event,
            callback,
        };
        this._eventManager.subscribe(eventEmitter);
    }
    off(event) {
        this._eventManager.unsubscribe(event);
    }
    async createInstantRequest(instantRequest) {
        this._key = await this._generateKey();
        const request = this._formatRequest({
            method: "wc_instantRequest",
            params: [
                {
                    peerId: this.clientId,
                    peerMeta: this.clientMeta,
                    request: this._formatRequest(instantRequest),
                },
            ],
        });
        this.handshakeId = request.id;
        this.handshakeTopic = uuid();
        this._eventManager.trigger({
            event: "display_uri",
            params: [this.uri],
        });
        this.on("modal_closed", () => {
            throw new Error(ERROR_QRCODE_MODAL_USER_CLOSED);
        });
        const endInstantRequest = () => {
            this.killSession();
        };
        try {
            const result = await this._sendCallRequest(request);
            if (result) {
                endInstantRequest();
            }
            return result;
        }
        catch (error) {
            endInstantRequest();
            throw error;
        }
    }
    async connect(opts) {
        if (!this._qrcodeModal) {
            throw new Error(ERROR_QRCODE_MODAL_NOT_PROVIDED);
        }
        if (this.connected) {
            return {
                chainId: this.chainId,
                accounts: this.accounts,
            };
        }
        await this.createSession(opts);
        return new Promise(async (resolve, reject) => {
            this.on("modal_closed", () => reject(new Error(ERROR_QRCODE_MODAL_USER_CLOSED)));
            this.on("connect", (error, payload) => {
                if (error) {
                    return reject(error);
                }
                resolve(payload.params[0]);
            });
        });
    }
    async createSession(opts) {
        if (this._connected) {
            throw new Error(ERROR_SESSION_CONNECTED);
        }
        if (this.pending) {
            return;
        }
        this._key = await this._generateKey();
        const request = this._formatRequest({
            method: "wc_sessionRequest",
            params: [
                {
                    peerId: this.clientId,
                    peerMeta: this.clientMeta,
                    chainId: opts && opts.chainId ? opts.chainId : null,
                },
            ],
        });
        this.handshakeId = request.id;
        this.handshakeTopic = uuid();
        this._sendSessionRequest(request, "Session update rejected", {
            topic: this.handshakeTopic,
        });
        this._eventManager.trigger({
            event: "display_uri",
            params: [this.uri],
        });
    }
    approveSession(sessionStatus) {
        if (this._connected) {
            throw new Error(ERROR_SESSION_CONNECTED);
        }
        this.chainId = sessionStatus.chainId;
        this.accounts = sessionStatus.accounts;
        this.networkId = sessionStatus.networkId || 0;
        this.rpcUrl = sessionStatus.rpcUrl || "";
        const sessionParams = {
            approved: true,
            chainId: this.chainId,
            networkId: this.networkId,
            accounts: this.accounts,
            rpcUrl: this.rpcUrl,
            peerId: this.clientId,
            peerMeta: this.clientMeta,
        };
        const response = {
            id: this.handshakeId,
            jsonrpc: "2.0",
            result: sessionParams,
        };
        this._sendResponse(response);
        this._connected = true;
        this._setStorageSession();
        this._eventManager.trigger({
            event: "connect",
            params: [
                {
                    peerId: this.peerId,
                    peerMeta: this.peerMeta,
                    chainId: this.chainId,
                    accounts: this.accounts,
                },
            ],
        });
    }
    rejectSession(sessionError) {
        if (this._connected) {
            throw new Error(ERROR_SESSION_CONNECTED);
        }
        const message = sessionError && sessionError.message ? sessionError.message : ERROR_SESSION_REJECTED;
        const response = this._formatResponse({
            id: this.handshakeId,
            error: { message },
        });
        this._sendResponse(response);
        this._connected = false;
        this._eventManager.trigger({
            event: "disconnect",
            params: [{ message }],
        });
        this._removeStorageSession();
    }
    updateSession(sessionStatus) {
        if (!this._connected) {
            throw new Error(ERROR_SESSION_DISCONNECTED);
        }
        this.chainId = sessionStatus.chainId;
        this.accounts = sessionStatus.accounts;
        this.networkId = sessionStatus.networkId || 0;
        this.rpcUrl = sessionStatus.rpcUrl || "";
        const sessionParams = {
            approved: true,
            chainId: this.chainId,
            networkId: this.networkId,
            accounts: this.accounts,
            rpcUrl: this.rpcUrl,
        };
        const request = this._formatRequest({
            method: "wc_sessionUpdate",
            params: [sessionParams],
        });
        this._sendSessionRequest(request, "Session update rejected");
        this._eventManager.trigger({
            event: "session_update",
            params: [
                {
                    chainId: this.chainId,
                    accounts: this.accounts,
                },
            ],
        });
        this._manageStorageSession();
    }
    async killSession(sessionError) {
        const message = sessionError ? sessionError.message : "Session Disconnected";
        const sessionParams = {
            approved: false,
            chainId: null,
            networkId: null,
            accounts: null,
        };
        const request = this._formatRequest({
            method: "wc_sessionUpdate",
            params: [sessionParams],
        });
        await this._sendRequest(request);
        this._handleSessionDisconnect(message);
    }
    async sendTransaction(tx) {
        if (!this._connected) {
            throw new Error(ERROR_SESSION_DISCONNECTED);
        }
        const parsedTx = parseTransactionData(tx);
        const request = this._formatRequest({
            method: "eth_sendTransaction",
            params: [parsedTx],
        });
        const result = await this._sendCallRequest(request);
        return result;
    }
    async signTransaction(tx) {
        if (!this._connected) {
            throw new Error(ERROR_SESSION_DISCONNECTED);
        }
        const parsedTx = parseTransactionData(tx);
        const request = this._formatRequest({
            method: "eth_signTransaction",
            params: [parsedTx],
        });
        const result = await this._sendCallRequest(request);
        return result;
    }
    async signMessage(params) {
        if (!this._connected) {
            throw new Error(ERROR_SESSION_DISCONNECTED);
        }
        const request = this._formatRequest({
            method: "eth_sign",
            params,
        });
        const result = await this._sendCallRequest(request);
        return result;
    }
    async signPersonalMessage(params) {
        if (!this._connected) {
            throw new Error(ERROR_SESSION_DISCONNECTED);
        }
        params = parsePersonalSign(params);
        const request = this._formatRequest({
            method: "personal_sign",
            params,
        });
        const result = await this._sendCallRequest(request);
        return result;
    }
    async signTypedData(params) {
        if (!this._connected) {
            throw new Error(ERROR_SESSION_DISCONNECTED);
        }
        const request = this._formatRequest({
            method: "eth_signTypedData",
            params,
        });
        const result = await this._sendCallRequest(request);
        return result;
    }
    async updateChain(chainParams) {
        if (!this._connected) {
            throw new Error("Session currently disconnected");
        }
        const request = this._formatRequest({
            method: "wallet_updateChain",
            params: [chainParams],
        });
        const result = await this._sendCallRequest(request);
        return result;
    }
    unsafeSend(request, options) {
        this._sendRequest(request, options);
        this._eventManager.trigger({
            event: "call_request_sent",
            params: [{ request, options }],
        });
        return new Promise((resolve, reject) => {
            this._subscribeToResponse(request.id, (error, payload) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!payload) {
                    throw new Error(ERROR_MISSING_JSON_RPC);
                }
                resolve(payload);
            });
        });
    }
    async sendCustomRequest(request, options) {
        if (!this._connected) {
            throw new Error(ERROR_SESSION_DISCONNECTED);
        }
        switch (request.method) {
            case "eth_accounts":
                return this.accounts;
            case "eth_chainId":
                return convertNumberToHex(this.chainId);
            case "eth_sendTransaction":
            case "eth_signTransaction":
                if (request.params) {
                    request.params[0] = parseTransactionData(request.params[0]);
                }
                break;
            case "personal_sign":
                if (request.params) {
                    request.params = parsePersonalSign(request.params);
                }
                break;
            default:
                break;
        }
        const formattedRequest = this._formatRequest(request);
        const result = await this._sendCallRequest(formattedRequest, options);
        return result;
    }
    approveRequest(response) {
        if (isJsonRpcResponseSuccess(response)) {
            const formattedResponse = this._formatResponse(response);
            this._sendResponse(formattedResponse);
        }
        else {
            throw new Error(ERROR_MISSING_RESULT);
        }
    }
    rejectRequest(response) {
        if (isJsonRpcResponseError(response)) {
            const formattedResponse = this._formatResponse(response);
            this._sendResponse(formattedResponse);
        }
        else {
            throw new Error(ERROR_MISSING_ERROR);
        }
    }
    transportClose() {
        this._transport.close();
    }
    async _sendRequest(request, options) {
        const callRequest = this._formatRequest(request);
        const encryptionPayload = await this._encrypt(callRequest);
        const topic = typeof (options === null || options === void 0 ? void 0 : options.topic) !== "undefined" ? options.topic : this.peerId;
        const payload = JSON.stringify(encryptionPayload);
        const silent = typeof (options === null || options === void 0 ? void 0 : options.forcePushNotification) !== "undefined"
            ? !options.forcePushNotification
            : isSilentPayload(callRequest);
        this._transport.send(payload, topic, silent);
    }
    async _sendResponse(response) {
        const encryptionPayload = await this._encrypt(response);
        const topic = this.peerId;
        const payload = JSON.stringify(encryptionPayload);
        const silent = true;
        this._transport.send(payload, topic, silent);
    }
    async _sendSessionRequest(request, errorMsg, options) {
        this._sendRequest(request, options);
        this._subscribeToSessionResponse(request.id, errorMsg);
    }
    _sendCallRequest(request, options) {
        this._sendRequest(request, options);
        this._eventManager.trigger({
            event: "call_request_sent",
            params: [{ request, options }],
        });
        return this._subscribeToCallResponse(request.id);
    }
    _formatRequest(request) {
        if (typeof request.method === "undefined") {
            throw new Error(ERROR_MISSING_METHOD);
        }
        const formattedRequest = {
            id: typeof request.id === "undefined" ? payloadId() : request.id,
            jsonrpc: "2.0",
            method: request.method,
            params: typeof request.params === "undefined" ? [] : request.params,
        };
        return formattedRequest;
    }
    _formatResponse(response) {
        if (typeof response.id === "undefined") {
            throw new Error(ERROR_MISSING_ID);
        }
        const baseResponse = { id: response.id, jsonrpc: "2.0" };
        if (isJsonRpcResponseError(response)) {
            const error = formatRpcError(response.error);
            const errorResponse = Object.assign(Object.assign(Object.assign({}, baseResponse), response), { error });
            return errorResponse;
        }
        else if (isJsonRpcResponseSuccess(response)) {
            const successResponse = Object.assign(Object.assign({}, baseResponse), response);
            return successResponse;
        }
        throw new Error(ERROR_INVALID_RESPONSE);
    }
    _handleSessionDisconnect(errorMsg) {
        const message = errorMsg || "Session Disconnected";
        if (!this._connected) {
            if (this._qrcodeModal) {
                this._qrcodeModal.close();
            }
            removeLocal(mobileLinkChoiceKey);
        }
        if (this._connected) {
            this._connected = false;
        }
        if (this._handshakeId) {
            this._handshakeId = 0;
        }
        if (this._handshakeTopic) {
            this._handshakeTopic = "";
        }
        if (this._peerId) {
            this._peerId = "";
        }
        this._eventManager.trigger({
            event: "disconnect",
            params: [{ message }],
        });
        this._removeStorageSession();
        this.transportClose();
    }
    _handleSessionResponse(errorMsg, sessionParams) {
        if (sessionParams) {
            if (sessionParams.approved) {
                if (!this._connected) {
                    this._connected = true;
                    if (sessionParams.chainId) {
                        this.chainId = sessionParams.chainId;
                    }
                    if (sessionParams.accounts) {
                        this.accounts = sessionParams.accounts;
                    }
                    if (sessionParams.peerId && !this.peerId) {
                        this.peerId = sessionParams.peerId;
                    }
                    if (sessionParams.peerMeta && !this.peerMeta) {
                        this.peerMeta = sessionParams.peerMeta;
                    }
                    this._eventManager.trigger({
                        event: "connect",
                        params: [
                            {
                                peerId: this.peerId,
                                peerMeta: this.peerMeta,
                                chainId: this.chainId,
                                accounts: this.accounts,
                            },
                        ],
                    });
                }
                else {
                    if (sessionParams.chainId) {
                        this.chainId = sessionParams.chainId;
                    }
                    if (sessionParams.accounts) {
                        this.accounts = sessionParams.accounts;
                    }
                    this._eventManager.trigger({
                        event: "session_update",
                        params: [
                            {
                                chainId: this.chainId,
                                accounts: this.accounts,
                            },
                        ],
                    });
                }
                this._manageStorageSession();
            }
            else {
                this._handleSessionDisconnect(errorMsg);
            }
        }
        else {
            this._handleSessionDisconnect(errorMsg);
        }
    }
    async _handleIncomingMessages(socketMessage) {
        const activeTopics = [this.clientId, this.handshakeTopic];
        if (!activeTopics.includes(socketMessage.topic)) {
            return;
        }
        let encryptionPayload;
        try {
            encryptionPayload = JSON.parse(socketMessage.payload);
        }
        catch (error) {
            return;
        }
        const payload = await this._decrypt(encryptionPayload);
        if (payload) {
            this._eventManager.trigger(payload);
        }
    }
    _subscribeToSessionRequest() {
        this._transport.subscribe(this.handshakeTopic);
    }
    _subscribeToResponse(id, callback) {
        this.on(`response:${id}`, callback);
    }
    _subscribeToSessionResponse(id, errorMsg) {
        this._subscribeToResponse(id, (error, payload) => {
            if (error) {
                this._handleSessionResponse(error.message);
                return;
            }
            if (isJsonRpcResponseSuccess(payload)) {
                this._handleSessionResponse(errorMsg, payload.result);
            }
            else if (payload.error && payload.error.message) {
                this._handleSessionResponse(payload.error.message);
            }
            else {
                this._handleSessionResponse(errorMsg);
            }
        });
    }
    _subscribeToCallResponse(id) {
        return new Promise((resolve, reject) => {
            this._subscribeToResponse(id, (error, payload) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (isJsonRpcResponseSuccess(payload)) {
                    resolve(payload.result);
                }
                else if (payload.error && payload.error.message) {
                    reject(new Error(payload.error.message));
                }
                else {
                    reject(new Error(ERROR_INVALID_RESPONSE));
                }
            });
        });
    }
    _subscribeToInternalEvents() {
        this.on("display_uri", () => {
            if (this._qrcodeModal) {
                this._qrcodeModal.open(this.uri, () => {
                    this._eventManager.trigger({
                        event: "modal_closed",
                        params: [],
                    });
                }, this._qrcodeModalOptions);
            }
        });
        this.on("connect", () => {
            if (this._qrcodeModal) {
                this._qrcodeModal.close();
            }
        });
        this.on("call_request_sent", (error, payload) => {
            const { request } = payload.params[0];
            if (isMobile() && this._signingMethods.includes(request.method)) {
                const mobileLinkUrl = getLocal(mobileLinkChoiceKey);
                if (mobileLinkUrl) {
                    window.location.href = mobileLinkUrl.href;
                }
            }
        });
        this.on("wc_sessionRequest", (error, payload) => {
            if (error) {
                this._eventManager.trigger({
                    event: "error",
                    params: [
                        {
                            code: "SESSION_REQUEST_ERROR",
                            message: error.toString(),
                        },
                    ],
                });
            }
            this.handshakeId = payload.id;
            this.peerId = payload.params[0].peerId;
            this.peerMeta = payload.params[0].peerMeta;
            const internalPayload = Object.assign(Object.assign({}, payload), { method: "session_request" });
            this._eventManager.trigger(internalPayload);
        });
        this.on("wc_sessionUpdate", (error, payload) => {
            if (error) {
                this._handleSessionResponse(error.message);
            }
            this._handleSessionResponse("Session disconnected", payload.params[0]);
        });
    }
    _initTransport() {
        this._transport.on("message", (socketMessage) => this._handleIncomingMessages(socketMessage));
        this._transport.on("open", () => this._eventManager.trigger({ event: "transport_open", params: [] }));
        this._transport.on("close", () => this._eventManager.trigger({ event: "transport_close", params: [] }));
        this._transport.on("error", () => this._eventManager.trigger({
            event: "transport_error",
            params: ["Websocket connection failed"],
        }));
        this._transport.open();
    }
    _formatUri() {
        const protocol = this.protocol;
        const handshakeTopic = this.handshakeTopic;
        const version = this.version;
        const bridge = encodeURIComponent(this.bridge);
        const key = this.key;
        const uri = `${protocol}:${handshakeTopic}@${version}?bridge=${bridge}&key=${key}`;
        return uri;
    }
    _parseUri(uri) {
        const result = parseWalletConnectUri(uri);
        if (result.protocol === this.protocol) {
            if (!result.handshakeTopic) {
                throw Error("Invalid or missing handshakeTopic parameter value");
            }
            const handshakeTopic = result.handshakeTopic;
            if (!result.bridge) {
                throw Error("Invalid or missing bridge url parameter value");
            }
            const bridge = decodeURIComponent(result.bridge);
            if (!result.key) {
                throw Error("Invalid or missing key parameter value");
            }
            const key = result.key;
            return { handshakeTopic, bridge, key };
        }
        else {
            throw new Error(ERROR_INVALID_URI);
        }
    }
    async _generateKey() {
        if (this._cryptoLib) {
            const result = await this._cryptoLib.generateKey();
            return result;
        }
        return null;
    }
    async _encrypt(data) {
        const key = this._key;
        if (this._cryptoLib && key) {
            const result = await this._cryptoLib.encrypt(data, key);
            return result;
        }
        return null;
    }
    async _decrypt(payload) {
        const key = this._key;
        if (this._cryptoLib && key) {
            const result = await this._cryptoLib.decrypt(payload, key);
            return result;
        }
        return null;
    }
    _getStorageSession() {
        let result = null;
        if (this._sessionStorage) {
            result = this._sessionStorage.getSession();
        }
        return result;
    }
    _setStorageSession() {
        if (this._sessionStorage) {
            this._sessionStorage.setSession(this.session);
        }
    }
    _removeStorageSession() {
        if (this._sessionStorage) {
            this._sessionStorage.removeSession();
        }
    }
    _manageStorageSession() {
        if (this._connected) {
            this._setStorageSession();
        }
        else {
            this._removeStorageSession();
        }
    }
    _registerPushServer(pushServerOpts) {
        if (!pushServerOpts.url || typeof pushServerOpts.url !== "string") {
            throw Error("Invalid or missing pushServerOpts.url parameter value");
        }
        if (!pushServerOpts.type || typeof pushServerOpts.type !== "string") {
            throw Error("Invalid or missing pushServerOpts.type parameter value");
        }
        if (!pushServerOpts.token || typeof pushServerOpts.token !== "string") {
            throw Error("Invalid or missing pushServerOpts.token parameter value");
        }
        const pushSubscription = {
            bridge: this.bridge,
            topic: this.clientId,
            type: pushServerOpts.type,
            token: pushServerOpts.token,
            peerName: "",
            language: pushServerOpts.language || "",
        };
        this.on("connect", async (error, payload) => {
            if (error) {
                throw error;
            }
            if (pushServerOpts.peerMeta) {
                const peerName = payload.params[0].peerMeta.name;
                pushSubscription.peerName = peerName;
            }
            try {
                const response = await fetch(`${pushServerOpts.url}/new`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(pushSubscription),
                });
                const json = await response.json();
                if (!json.success) {
                    throw Error("Failed to register in Push Server");
                }
            }
            catch (error) {
                throw Error("Failed to register in Push Server");
            }
        });
    }
}
export default Connector;
//# sourceMappingURL=index.js.map