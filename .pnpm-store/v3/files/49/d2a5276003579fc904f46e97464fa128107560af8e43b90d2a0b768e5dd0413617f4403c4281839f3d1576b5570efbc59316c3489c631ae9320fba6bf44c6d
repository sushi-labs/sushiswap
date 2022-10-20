"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSDKRelay = void 0;
const bind_decorator_1 = __importDefault(require("bind-decorator"));
const eth_rpc_errors_1 = require("eth-rpc-errors");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const DiagnosticLogger_1 = require("../connection/DiagnosticLogger");
const WalletSDKConnection_1 = require("../connection/WalletSDKConnection");
const WalletUIError_1 = require("../provider/WalletUIError");
const types_1 = require("../types");
const util_1 = require("../util");
const aes256gcm = __importStar(require("./aes256gcm"));
const Session_1 = require("./Session");
const WalletSDKRelayAbstract_1 = require("./WalletSDKRelayAbstract");
const Web3Method_1 = require("./Web3Method");
const Web3RequestCanceledMessage_1 = require("./Web3RequestCanceledMessage");
const Web3RequestMessage_1 = require("./Web3RequestMessage");
const Web3Response_1 = require("./Web3Response");
const Web3ResponseMessage_1 = require("./Web3ResponseMessage");
class WalletSDKRelay extends WalletSDKRelayAbstract_1.WalletSDKRelayAbstract {
    constructor(options) {
        var _a;
        super();
        this.accountsCallback = null;
        this.chainCallback = null;
        this.appName = "";
        this.appLogoUrl = null;
        this.subscriptions = new rxjs_1.Subscription();
        this.linkAPIUrl = options.linkAPIUrl;
        this.storage = options.storage;
        this.options = options;
        const { session, ui, connection } = this.subscribe();
        this._session = session;
        this.connection = connection;
        this.relayEventManager = options.relayEventManager;
        if (options.diagnosticLogger && options.eventListener) {
            throw new Error("Can't have both eventListener and diagnosticLogger options, use only diagnosticLogger");
        }
        if (options.eventListener) {
            this.diagnostic = {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                log: options.eventListener.onEvent,
            };
        }
        else {
            this.diagnostic = options.diagnosticLogger;
        }
        this._reloadOnDisconnect = (_a = options.reloadOnDisconnect) !== null && _a !== void 0 ? _a : true;
        this.ui = ui;
    }
    subscribe() {
        const session = Session_1.Session.load(this.storage) || new Session_1.Session(this.storage).save();
        const connection = new WalletSDKConnection_1.WalletSDKConnection(session.id, session.key, this.linkAPIUrl, this.diagnostic);
        this.subscriptions.add(connection.sessionConfig$.subscribe({
            next: sessionConfig => {
                this.onSessionConfigChanged(sessionConfig);
            },
            error: () => {
                var _a;
                (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
                    message: "error while invoking session config callback",
                });
            },
        }));
        this.subscriptions.add(connection.incomingEvent$
            .pipe((0, operators_1.filter)(m => m.event === "Web3Response"))
            .subscribe({ next: this.handleIncomingEvent }));
        this.subscriptions.add(connection.linked$
            .pipe((0, operators_1.skip)(1), (0, operators_1.tap)((linked) => {
            var _a;
            this.isLinked = linked;
            const cachedAddresses = this.storage.getItem(WalletSDKRelayAbstract_1.LOCAL_STORAGE_ADDRESSES_KEY);
            if (linked) {
                // Only set linked session variable one way
                this.session.linked = linked;
            }
            this.isUnlinkedErrorState = false;
            if (cachedAddresses) {
                const addresses = cachedAddresses.split(" ");
                const wasConnectedViaStandalone = this.storage.getItem("IsStandaloneSigning") === "true";
                if (addresses[0] !== "" &&
                    !linked &&
                    this.session.linked &&
                    !wasConnectedViaStandalone) {
                    this.isUnlinkedErrorState = true;
                    const sessionIdHash = this.getSessionIdHash();
                    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.UNLINKED_ERROR_STATE, {
                        sessionIdHash,
                    });
                }
            }
        }))
            .subscribe());
        // if session is marked destroyed, reset and reload
        this.subscriptions.add(connection.sessionConfig$
            .pipe((0, operators_1.filter)(c => !!c.metadata && c.metadata.__destroyed === "1"))
            .subscribe(() => {
            var _a;
            const alreadyDestroyed = connection.isDestroyed;
            (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.METADATA_DESTROYED, {
                alreadyDestroyed,
                sessionIdHash: this.getSessionIdHash(),
            });
            return this.resetAndReload();
        }));
        this.subscriptions.add(connection.sessionConfig$
            .pipe((0, operators_1.filter)(c => c.metadata && c.metadata.WalletUsername !== undefined))
            .pipe((0, operators_1.mergeMap)(c => aes256gcm.decrypt(c.metadata.WalletUsername, session.secret)))
            .subscribe({
            next: walletUsername => {
                this.storage.setItem(WalletSDKRelayAbstract_1.WALLET_USER_NAME_KEY, walletUsername);
            },
            error: () => {
                var _a;
                (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
                    message: "Had error decrypting",
                    value: "username",
                });
            },
        }));
        this.subscriptions.add(connection.sessionConfig$
            .pipe((0, operators_1.filter)(c => c.metadata && c.metadata.AppVersion !== undefined))
            .pipe((0, operators_1.mergeMap)(c => aes256gcm.decrypt(c.metadata.AppVersion, session.secret)))
            .subscribe({
            next: appVersion => {
                this.storage.setItem(WalletSDKRelayAbstract_1.APP_VERSION_KEY, appVersion);
            },
            error: () => {
                var _a;
                (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
                    message: "Had error decrypting",
                    value: "appversion",
                });
            },
        }));
        this.subscriptions.add(connection.sessionConfig$
            .pipe((0, operators_1.filter)(c => c.metadata &&
            c.metadata.ChainId !== undefined &&
            c.metadata.JsonRpcUrl !== undefined))
            .pipe((0, operators_1.mergeMap)(c => (0, rxjs_1.zip)(aes256gcm.decrypt(c.metadata.ChainId, session.secret), aes256gcm.decrypt(c.metadata.JsonRpcUrl, session.secret))))
            .pipe((0, operators_1.distinctUntilChanged)())
            .subscribe({
            next: ([chainId, jsonRpcUrl]) => {
                if (this.chainCallback) {
                    this.chainCallback(chainId, jsonRpcUrl);
                }
            },
            error: () => {
                var _a;
                (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
                    message: "Had error decrypting",
                    value: "chainId|jsonRpcUrl",
                });
            },
        }));
        this.subscriptions.add(connection.sessionConfig$
            .pipe((0, operators_1.filter)(c => c.metadata && c.metadata.EthereumAddress !== undefined))
            .pipe((0, operators_1.mergeMap)(c => aes256gcm.decrypt(c.metadata.EthereumAddress, session.secret)))
            .subscribe({
            next: selectedAddress => {
                if (this.accountsCallback) {
                    this.accountsCallback([selectedAddress]);
                }
                if (WalletSDKRelay.accountRequestCallbackIds.size > 0) {
                    // We get the ethereum address from the metadata.  If for whatever
                    // reason we don't get a response via an explicit web3 message
                    // we can still fulfill the eip1102 request.
                    Array.from(WalletSDKRelay.accountRequestCallbackIds.values()).forEach(id => {
                        const message = (0, Web3ResponseMessage_1.Web3ResponseMessage)({
                            id,
                            response: (0, Web3Response_1.RequestEthereumAccountsResponse)([
                                selectedAddress,
                            ]),
                        });
                        this.invokeCallback(Object.assign(Object.assign({}, message), { id }));
                    });
                    WalletSDKRelay.accountRequestCallbackIds.clear();
                }
            },
            error: () => {
                var _a;
                (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
                    message: "Had error decrypting",
                    value: "selectedAddress",
                });
            },
        }));
        const ui = this.options.uiConstructor({
            linkAPIUrl: this.options.linkAPIUrl,
            version: this.options.version,
            darkMode: this.options.darkMode,
            session,
            connected$: connection.connected$,
        });
        connection.connect();
        return { session, ui, connection };
    }
    attachUI() {
        this.ui.attach();
    }
    resetAndReload() {
        this.connection
            .setSessionMetadata("__destroyed", "1")
            .pipe((0, operators_1.timeout)(1000), (0, operators_1.catchError)(_ => (0, rxjs_1.of)(null)))
            .subscribe(_ => {
            var _a, _b, _c;
            const isStandalone = this.ui.isStandalone();
            try {
                this.subscriptions.unsubscribe();
            }
            catch (err) {
                (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
                    message: "Had error unsubscribing",
                });
            }
            (_b = this.diagnostic) === null || _b === void 0 ? void 0 : _b.log(DiagnosticLogger_1.EVENTS.SESSION_STATE_CHANGE, {
                method: "relay::resetAndReload",
                sessionMetadataChange: "__destroyed, 1",
                sessionIdHash: this.getSessionIdHash(),
            });
            this.connection.destroy();
            /**
             * Only clear storage if the session id we have in memory matches the one on disk
             * Otherwise, in the case where we have 2 tabs, another tab might have cleared
             * storage already.  In that case if we clear storage again, the user will be in
             * a state where the first tab allows the user to connect but the session that
             * was used isn't persisted.  This leaves the user in a state where they aren't
             * connected to the mobile app.
             */
            const storedSession = Session_1.Session.load(this.storage);
            if ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) === this._session.id) {
                this.storage.clear();
            }
            else if (storedSession) {
                (_c = this.diagnostic) === null || _c === void 0 ? void 0 : _c.log(DiagnosticLogger_1.EVENTS.SKIPPED_CLEARING_SESSION, {
                    sessionIdHash: this.getSessionIdHash(),
                    storedSessionIdHash: Session_1.Session.hash(storedSession.id),
                });
            }
            if (this._reloadOnDisconnect) {
                this.ui.reloadUI();
                return;
            }
            if (this.accountsCallback) {
                this.accountsCallback([], true);
            }
            const { session, ui, connection } = this.subscribe();
            this._session = session;
            this.connection = connection;
            this.ui = ui;
            if (isStandalone && this.ui.setStandalone)
                this.ui.setStandalone(true);
            this.attachUI();
        }, (err) => {
            var _a;
            (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.FAILURE, {
                method: "relay::resetAndReload",
                message: `failed to reset and reload with ${err}`,
                sessionIdHash: this.getSessionIdHash(),
            });
        });
    }
    setAppInfo(appName, appLogoUrl) {
        this.appName = appName;
        this.appLogoUrl = appLogoUrl;
    }
    getStorageItem(key) {
        return this.storage.getItem(key);
    }
    get session() {
        return this._session;
    }
    setStorageItem(key, value) {
        this.storage.setItem(key, value);
    }
    signEthereumMessage(message, address, addPrefix, typedDataJson) {
        return this.sendRequest({
            method: Web3Method_1.Web3Method.signEthereumMessage,
            params: {
                message: (0, util_1.hexStringFromBuffer)(message, true),
                address,
                addPrefix,
                typedDataJson: typedDataJson || null,
            },
        });
    }
    ethereumAddressFromSignedMessage(message, signature, addPrefix) {
        return this.sendRequest({
            method: Web3Method_1.Web3Method.ethereumAddressFromSignedMessage,
            params: {
                message: (0, util_1.hexStringFromBuffer)(message, true),
                signature: (0, util_1.hexStringFromBuffer)(signature, true),
                addPrefix,
            },
        });
    }
    signEthereumTransaction(params) {
        return this.sendRequest({
            method: Web3Method_1.Web3Method.signEthereumTransaction,
            params: {
                fromAddress: params.fromAddress,
                toAddress: params.toAddress,
                weiValue: (0, util_1.bigIntStringFromBN)(params.weiValue),
                data: (0, util_1.hexStringFromBuffer)(params.data, true),
                nonce: params.nonce,
                gasPriceInWei: params.gasPriceInWei
                    ? (0, util_1.bigIntStringFromBN)(params.gasPriceInWei)
                    : null,
                maxFeePerGas: params.gasPriceInWei
                    ? (0, util_1.bigIntStringFromBN)(params.gasPriceInWei)
                    : null,
                maxPriorityFeePerGas: params.gasPriceInWei
                    ? (0, util_1.bigIntStringFromBN)(params.gasPriceInWei)
                    : null,
                gasLimit: params.gasLimit ? (0, util_1.bigIntStringFromBN)(params.gasLimit) : null,
                chainId: params.chainId,
                shouldSubmit: false,
            },
        });
    }
    signAndSubmitEthereumTransaction(params) {
        return this.sendRequest({
            method: Web3Method_1.Web3Method.signEthereumTransaction,
            params: {
                fromAddress: params.fromAddress,
                toAddress: params.toAddress,
                weiValue: (0, util_1.bigIntStringFromBN)(params.weiValue),
                data: (0, util_1.hexStringFromBuffer)(params.data, true),
                nonce: params.nonce,
                gasPriceInWei: params.gasPriceInWei
                    ? (0, util_1.bigIntStringFromBN)(params.gasPriceInWei)
                    : null,
                maxFeePerGas: params.maxFeePerGas
                    ? (0, util_1.bigIntStringFromBN)(params.maxFeePerGas)
                    : null,
                maxPriorityFeePerGas: params.maxPriorityFeePerGas
                    ? (0, util_1.bigIntStringFromBN)(params.maxPriorityFeePerGas)
                    : null,
                gasLimit: params.gasLimit ? (0, util_1.bigIntStringFromBN)(params.gasLimit) : null,
                chainId: params.chainId,
                shouldSubmit: true,
            },
        });
    }
    submitEthereumTransaction(signedTransaction, chainId) {
        return this.sendRequest({
            method: Web3Method_1.Web3Method.submitEthereumTransaction,
            params: {
                signedTransaction: (0, util_1.hexStringFromBuffer)(signedTransaction, true),
                chainId,
            },
        });
    }
    scanQRCode(regExp) {
        return this.sendRequest({
            method: Web3Method_1.Web3Method.scanQRCode,
            params: { regExp },
        });
    }
    getQRCodeUrl() {
        return (0, util_1.createQrUrl)(this._session.id, this._session.secret, this.linkAPIUrl, false);
    }
    genericRequest(data, action) {
        return this.sendRequest({
            method: Web3Method_1.Web3Method.generic,
            params: {
                action,
                data,
            },
        });
    }
    sendGenericMessage(request) {
        return this.sendRequest(request);
    }
    sendRequest(request) {
        let hideSnackbarItem = null;
        const id = (0, util_1.randomBytesHex)(8);
        const cancel = (error) => {
            this.publishWeb3RequestCanceledEvent(id);
            this.handleErrorResponse(id, request.method, error);
            hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        };
        const promise = new Promise((resolve, reject) => {
            if (!this.ui.isStandalone()) {
                hideSnackbarItem = this.ui.showConnecting({
                    isUnlinkedErrorState: this.isUnlinkedErrorState,
                    onCancel: cancel,
                    onResetConnection: this.resetAndReload, // eslint-disable-line @typescript-eslint/unbound-method
                });
            }
            this.relayEventManager.callbacks.set(id, response => {
                hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
                if (response.errorMessage) {
                    return reject(new Error(response.errorMessage));
                }
                resolve(response);
            });
            if (this.ui.isStandalone()) {
                this.sendRequestStandalone(id, request);
            }
            else {
                this.publishWeb3RequestEvent(id, request);
            }
        });
        return { promise, cancel };
    }
    setConnectDisabled(disabled) {
        this.ui.setConnectDisabled(disabled);
    }
    setAccountsCallback(accountsCallback) {
        this.accountsCallback = accountsCallback;
    }
    setChainCallback(chainCallback) {
        this.chainCallback = chainCallback;
    }
    publishWeb3RequestEvent(id, request) {
        var _a;
        const message = (0, Web3RequestMessage_1.Web3RequestMessage)({ id, request });
        const storedSession = Session_1.Session.load(this.storage);
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.WEB3_REQUEST, {
            eventId: message.id,
            method: `relay::${message.request.method}`,
            sessionIdHash: this.getSessionIdHash(),
            storedSessionIdHash: storedSession ? Session_1.Session.hash(storedSession.id) : "",
            isSessionMismatched: ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) !== this._session.id).toString(),
        });
        this.subscriptions.add(this.publishEvent("Web3Request", message, true).subscribe({
            next: _ => {
                var _a;
                (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.WEB3_REQUEST_PUBLISHED, {
                    eventId: message.id,
                    method: `relay::${message.request.method}`,
                    sessionIdHash: this.getSessionIdHash(),
                    storedSessionIdHash: storedSession
                        ? Session_1.Session.hash(storedSession.id)
                        : "",
                    isSessionMismatched: ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) !== this._session.id).toString(),
                });
            },
            error: err => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id: message.id,
                    response: {
                        method: message.request.method,
                        errorMessage: err.message,
                    },
                }));
            },
        }));
    }
    publishWeb3RequestCanceledEvent(id) {
        const message = (0, Web3RequestCanceledMessage_1.Web3RequestCanceledMessage)(id);
        this.subscriptions.add(this.publishEvent("Web3RequestCanceled", message, false).subscribe());
    }
    publishEvent(event, message, callWebhook) {
        const secret = this.session.secret;
        return new rxjs_1.Observable(subscriber => {
            void aes256gcm
                .encrypt(JSON.stringify(Object.assign(Object.assign({}, message), { origin: location.origin })), secret)
                .then((encrypted) => {
                subscriber.next(encrypted);
                subscriber.complete();
            });
        }).pipe((0, operators_1.mergeMap)((encrypted) => {
            return this.connection.publishEvent(event, encrypted, callWebhook);
        }));
    }
    handleIncomingEvent(event) {
        try {
            this.subscriptions.add(aes256gcm
                .decrypt(event.data, this.session.secret)
                .pipe((0, operators_1.map)(c => JSON.parse(c)))
                .subscribe({
                next: json => {
                    const message = (0, Web3ResponseMessage_1.isWeb3ResponseMessage)(json) ? json : null;
                    if (!message) {
                        return;
                    }
                    this.handleWeb3ResponseMessage(message);
                },
                error: () => {
                    var _a;
                    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
                        message: "Had error decrypting",
                        value: "incomingEvent",
                    });
                },
            }));
        }
        catch (_a) {
            return;
        }
    }
    handleWeb3ResponseMessage(message) {
        var _a;
        const { response } = message;
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.WEB3_RESPONSE, {
            eventId: message.id,
            method: `relay::${response.method}`,
            sessionIdHash: this.getSessionIdHash(),
        });
        if ((0, Web3Response_1.isRequestEthereumAccountsResponse)(response)) {
            WalletSDKRelay.accountRequestCallbackIds.forEach(id => this.invokeCallback(Object.assign(Object.assign({}, message), { id })));
            WalletSDKRelay.accountRequestCallbackIds.clear();
            return;
        }
        this.invokeCallback(message);
    }
    handleErrorResponse(id, method, error, errorCode) {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
            id,
            response: (0, Web3Response_1.ErrorResponse)(method, (error !== null && error !== void 0 ? error : WalletUIError_1.WalletUIError.UserRejectedRequest).message, errorCode),
        }));
    }
    invokeCallback(message) {
        const callback = this.relayEventManager.callbacks.get(message.id);
        if (callback) {
            callback(message.response);
            this.relayEventManager.callbacks.delete(message.id);
        }
    }
    requestEthereumAccounts() {
        const request = {
            method: Web3Method_1.Web3Method.requestEthereumAccounts,
            params: {
                appName: this.appName,
                appLogoUrl: this.appLogoUrl || null,
            },
        };
        const hideSnackbarItem = null;
        const id = (0, util_1.randomBytesHex)(8);
        const cancel = (error) => {
            this.publishWeb3RequestCanceledEvent(id);
            this.handleErrorResponse(id, request.method, error);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        };
        const promise = new Promise((resolve, reject) => {
            var _a;
            this.relayEventManager.callbacks.set(id, response => {
                this.ui.hideRequestEthereumAccounts();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
                if (response.errorMessage) {
                    return reject(new Error(response.errorMessage));
                }
                resolve(response);
            });
            const userAgent = ((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) || null;
            if (userAgent &&
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
                window.location.href = `https://go.cb-w.com/xoXnYwQimhb?cb_url=${encodeURIComponent(window.location.href)}`;
                return;
            }
            if (this.ui.inlineAccountsResponse()) {
                const onAccounts = (accounts) => {
                    this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                        id,
                        response: (0, Web3Response_1.RequestEthereumAccountsResponse)(accounts),
                    }));
                };
                this.ui.requestEthereumAccounts({
                    onCancel: cancel,
                    onAccounts,
                });
            }
            else {
                // Error if user closes TryExtensionLinkDialog without connecting
                const err = eth_rpc_errors_1.ethErrors.provider.userRejectedRequest("User denied account authorization");
                this.ui.requestEthereumAccounts({
                    onCancel: () => cancel(err),
                });
            }
            WalletSDKRelay.accountRequestCallbackIds.add(id);
            if (!this.ui.inlineAccountsResponse() && !this.ui.isStandalone()) {
                this.publishWeb3RequestEvent(id, request);
            }
        });
        return { promise, cancel };
    }
    selectProvider(providerOptions) {
        const request = {
            method: Web3Method_1.Web3Method.selectProvider,
            params: {
                providerOptions,
            },
        };
        const id = (0, util_1.randomBytesHex)(8);
        const cancel = (error) => {
            this.publishWeb3RequestCanceledEvent(id);
            this.handleErrorResponse(id, request.method, error);
        };
        const promise = new Promise((resolve, reject) => {
            this.relayEventManager.callbacks.set(id, response => {
                if (response.errorMessage) {
                    return reject(new Error(response.errorMessage));
                }
                resolve(response);
            });
            const _cancel = (_error) => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id,
                    response: (0, Web3Response_1.SelectProviderResponse)(types_1.ProviderType.Unselected),
                }));
            };
            const approve = (selectedProviderKey) => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id,
                    response: (0, Web3Response_1.SelectProviderResponse)(selectedProviderKey),
                }));
            };
            if (this.ui.selectProvider)
                this.ui.selectProvider({
                    onApprove: approve,
                    onCancel: _cancel,
                    providerOptions,
                });
        });
        return { cancel, promise };
    }
    watchAsset(type, address, symbol, decimals, image, chainId) {
        const request = {
            method: Web3Method_1.Web3Method.watchAsset,
            params: {
                type,
                options: {
                    address,
                    symbol,
                    decimals,
                    image,
                },
                chainId,
            },
        };
        let hideSnackbarItem = null;
        const id = (0, util_1.randomBytesHex)(8);
        const cancel = (error) => {
            this.publishWeb3RequestCanceledEvent(id);
            this.handleErrorResponse(id, request.method, error);
            hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        };
        if (!this.ui.inlineWatchAsset()) {
            hideSnackbarItem = this.ui.showConnecting({
                isUnlinkedErrorState: this.isUnlinkedErrorState,
                onCancel: cancel,
                onResetConnection: this.resetAndReload, // eslint-disable-line @typescript-eslint/unbound-method
            });
        }
        const promise = new Promise((resolve, reject) => {
            this.relayEventManager.callbacks.set(id, response => {
                hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
                if (response.errorMessage) {
                    return reject(new Error(response.errorMessage));
                }
                resolve(response);
            });
            const _cancel = (_error) => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id,
                    response: (0, Web3Response_1.WatchAssetReponse)(false),
                }));
            };
            const approve = () => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id,
                    response: (0, Web3Response_1.WatchAssetReponse)(true),
                }));
            };
            if (this.ui.inlineWatchAsset()) {
                this.ui.watchAsset({
                    onApprove: approve,
                    onCancel: _cancel,
                    type,
                    address,
                    symbol,
                    decimals,
                    image,
                    chainId,
                });
            }
            if (!this.ui.inlineWatchAsset() && !this.ui.isStandalone()) {
                this.publishWeb3RequestEvent(id, request);
            }
        });
        return { cancel, promise };
    }
    addEthereumChain(chainId, rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency) {
        const request = {
            method: Web3Method_1.Web3Method.addEthereumChain,
            params: {
                chainId,
                rpcUrls,
                blockExplorerUrls,
                chainName,
                iconUrls,
                nativeCurrency,
            },
        };
        let hideSnackbarItem = null;
        const id = (0, util_1.randomBytesHex)(8);
        const cancel = (error) => {
            this.publishWeb3RequestCanceledEvent(id);
            this.handleErrorResponse(id, request.method, error);
            hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        };
        if (!this.ui.inlineAddEthereumChain(chainId)) {
            hideSnackbarItem = this.ui.showConnecting({
                isUnlinkedErrorState: this.isUnlinkedErrorState,
                onCancel: cancel,
                onResetConnection: this.resetAndReload, // eslint-disable-line @typescript-eslint/unbound-method
            });
        }
        const promise = new Promise((resolve, reject) => {
            this.relayEventManager.callbacks.set(id, response => {
                hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
                if (response.errorMessage) {
                    return reject(new Error(response.errorMessage));
                }
                resolve(response);
            });
            const _cancel = (_error) => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id,
                    response: (0, Web3Response_1.AddEthereumChainResponse)({
                        isApproved: false,
                        rpcUrl: "",
                    }),
                }));
            };
            const approve = (rpcUrl) => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id,
                    response: (0, Web3Response_1.AddEthereumChainResponse)({ isApproved: true, rpcUrl }),
                }));
            };
            if (this.ui.inlineAddEthereumChain(chainId)) {
                this.ui.addEthereumChain({
                    onCancel: _cancel,
                    onApprove: approve,
                    chainId: request.params.chainId,
                    rpcUrls: request.params.rpcUrls,
                    blockExplorerUrls: request.params.blockExplorerUrls,
                    chainName: request.params.chainName,
                    iconUrls: request.params.iconUrls,
                    nativeCurrency: request.params.nativeCurrency,
                });
            }
            if (!this.ui.inlineAddEthereumChain(chainId) && !this.ui.isStandalone()) {
                this.publishWeb3RequestEvent(id, request);
            }
        });
        return { promise, cancel };
    }
    switchEthereumChain(chainId) {
        const request = {
            method: Web3Method_1.Web3Method.switchEthereumChain,
            params: {
                chainId,
            },
        };
        let hideSnackbarItem = null;
        const id = (0, util_1.randomBytesHex)(8);
        const cancel = (error) => {
            this.publishWeb3RequestCanceledEvent(id);
            this.handleErrorResponse(id, request.method, error);
            hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        };
        if (!this.ui.inlineSwitchEthereumChain()) {
            hideSnackbarItem = this.ui.showConnecting({
                isUnlinkedErrorState: this.isUnlinkedErrorState,
                onCancel: cancel,
                onResetConnection: this.resetAndReload, // eslint-disable-line @typescript-eslint/unbound-method
            });
        }
        const promise = new Promise((resolve, reject) => {
            this.relayEventManager.callbacks.set(id, response => {
                hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
                if (response.errorMessage && response.errorCode) {
                    return reject(eth_rpc_errors_1.ethErrors.provider.custom({
                        code: response.errorCode,
                        message: `Unrecognized chain ID. Try adding the chain using addEthereumChain first.`,
                    }));
                }
                else if (response.errorMessage) {
                    return reject(new Error(response.errorMessage));
                }
                resolve(response);
            });
            const _cancel = (error) => {
                if (typeof error === "number") {
                    // backward compatibility
                    const errorCode = error;
                    this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                        id,
                        response: (0, Web3Response_1.ErrorResponse)(Web3Method_1.Web3Method.switchEthereumChain, WalletUIError_1.WalletUIError.SwitchEthereumChainUnsupportedChainId.message, errorCode),
                    }));
                }
                else if (error instanceof WalletUIError_1.WalletUIError) {
                    this.handleErrorResponse(id, Web3Method_1.Web3Method.switchEthereumChain, error, error.errorCode);
                }
                else {
                    this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                        id,
                        response: (0, Web3Response_1.SwitchEthereumChainResponse)({
                            isApproved: false,
                            rpcUrl: "",
                        }),
                    }));
                }
            };
            const approve = (rpcUrl) => {
                this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                    id,
                    response: (0, Web3Response_1.SwitchEthereumChainResponse)({
                        isApproved: true,
                        rpcUrl,
                    }),
                }));
            };
            this.ui.switchEthereumChain({
                onCancel: _cancel,
                onApprove: approve,
                chainId: request.params.chainId,
            });
            if (!this.ui.inlineSwitchEthereumChain() && !this.ui.isStandalone()) {
                this.publishWeb3RequestEvent(id, request);
            }
        });
        return { promise, cancel };
    }
    inlineAddEthereumChain(chainId) {
        return this.ui.inlineAddEthereumChain(chainId);
    }
    getSessionIdHash() {
        return Session_1.Session.hash(this._session.id);
    }
    sendRequestStandalone(id, request) {
        const _cancel = (error) => {
            this.handleErrorResponse(id, request.method, error);
        };
        const onSuccess = (response) => {
            this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
                id,
                response,
            }));
        };
        switch (request.method) {
            case Web3Method_1.Web3Method.signEthereumMessage:
                this.ui.signEthereumMessage({
                    request,
                    onSuccess,
                    onCancel: _cancel,
                });
                break;
            case Web3Method_1.Web3Method.signEthereumTransaction:
                this.ui.signEthereumTransaction({
                    request,
                    onSuccess,
                    onCancel: _cancel,
                });
                break;
            case Web3Method_1.Web3Method.submitEthereumTransaction:
                this.ui.submitEthereumTransaction({
                    request,
                    onSuccess,
                    onCancel: _cancel,
                });
                break;
            case Web3Method_1.Web3Method.ethereumAddressFromSignedMessage:
                this.ui.ethereumAddressFromSignedMessage({
                    request,
                    onSuccess,
                });
                break;
            default:
                _cancel();
                break;
        }
    }
    onSessionConfigChanged(_nextSessionConfig) { }
}
WalletSDKRelay.accountRequestCallbackIds = new Set();
__decorate([
    bind_decorator_1.default
], WalletSDKRelay.prototype, "resetAndReload", null);
__decorate([
    bind_decorator_1.default
], WalletSDKRelay.prototype, "handleIncomingEvent", null);
exports.WalletSDKRelay = WalletSDKRelay;
