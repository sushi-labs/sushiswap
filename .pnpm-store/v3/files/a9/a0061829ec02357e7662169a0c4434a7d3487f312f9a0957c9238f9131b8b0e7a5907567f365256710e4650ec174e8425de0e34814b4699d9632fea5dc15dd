"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSDKConnection = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Session_1 = require("../relay/Session");
const types_1 = require("../types");
const ClientMessage_1 = require("./ClientMessage");
const DiagnosticLogger_1 = require("./DiagnosticLogger");
const RxWebSocket_1 = require("./RxWebSocket");
const ServerMessage_1 = require("./ServerMessage");
const HEARTBEAT_INTERVAL = 10000;
const REQUEST_TIMEOUT = 60000;
/**
 * Coinbase Wallet Connection
 */
class WalletSDKConnection {
    /**
     * Constructor
     * @param sessionId Session ID
     * @param sessionKey Session Key
     * @param linkAPIUrl Coinbase Wallet link server URL
     * @param [WebSocketClass] Custom WebSocket implementation
     */
    constructor(sessionId, sessionKey, linkAPIUrl, diagnostic, WebSocketClass = WebSocket) {
        this.sessionId = sessionId;
        this.sessionKey = sessionKey;
        this.diagnostic = diagnostic;
        this.subscriptions = new rxjs_1.Subscription();
        this.destroyed = false;
        this.lastHeartbeatResponse = 0;
        this.nextReqId = (0, types_1.IntNumber)(1);
        this.connectedSubject = new rxjs_1.BehaviorSubject(false);
        this.linkedSubject = new rxjs_1.BehaviorSubject(false);
        this.sessionConfigSubject = new rxjs_1.ReplaySubject(1);
        const ws = new RxWebSocket_1.RxWebSocket(linkAPIUrl + "/rpc", WebSocketClass);
        this.ws = ws;
        // attempt to reconnect every 5 seconds when disconnected
        this.subscriptions.add(ws.connectionState$
            .pipe((0, operators_1.tap)(state => {
            var _a;
            return (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.CONNECTED_STATE_CHANGE, {
                state,
                sessionIdHash: Session_1.Session.hash(sessionId),
            });
        }), 
        // ignore initial DISCONNECTED state
        (0, operators_1.skip)(1), 
        // if DISCONNECTED and not destroyed
        (0, operators_1.filter)(cs => cs === RxWebSocket_1.ConnectionState.DISCONNECTED && !this.destroyed), 
        // wait 5 seconds
        (0, operators_1.delay)(5000), 
        // check whether it's destroyed again
        (0, operators_1.filter)(_ => !this.destroyed), 
        // reconnect
        (0, operators_1.flatMap)(_ => ws.connect()), (0, operators_1.retry)())
            .subscribe());
        // perform authentication upon connection
        this.subscriptions.add(ws.connectionState$
            .pipe(
        // ignore initial DISCONNECTED and CONNECTING states
        (0, operators_1.skip)(2), (0, operators_1.switchMap)(cs => (0, rxjs_1.iif)(() => cs === RxWebSocket_1.ConnectionState.CONNECTED, 
        // if CONNECTED, authenticate, and then check link status
        this.authenticate().pipe((0, operators_1.tap)(_ => this.sendIsLinked()), (0, operators_1.tap)(_ => this.sendGetSessionConfig()), (0, operators_1.map)(_ => true)), 
        // if not CONNECTED, emit false immediately
        (0, rxjs_1.of)(false))), (0, operators_1.distinctUntilChanged)(), (0, operators_1.catchError)(_ => (0, rxjs_1.of)(false)))
            .subscribe(connected => this.connectedSubject.next(connected)));
        // send heartbeat every n seconds while connected
        this.subscriptions.add(ws.connectionState$
            .pipe(
        // ignore initial DISCONNECTED state
        (0, operators_1.skip)(1), (0, operators_1.switchMap)(cs => (0, rxjs_1.iif)(() => cs === RxWebSocket_1.ConnectionState.CONNECTED, 
        // if CONNECTED, start the heartbeat timer
        (0, rxjs_1.timer)(0, HEARTBEAT_INTERVAL))))
            .subscribe(i => 
        // first timer event updates lastHeartbeat timestamp
        // subsequent calls send heartbeat message
        i === 0 ? this.updateLastHeartbeat() : this.heartbeat()));
        // handle server's heartbeat responses
        this.subscriptions.add(ws.incomingData$
            .pipe((0, operators_1.filter)(m => m === "h"))
            .subscribe(_ => this.updateLastHeartbeat()));
        // handle link status updates
        this.subscriptions.add(ws.incomingJSONData$
            .pipe((0, operators_1.filter)(m => ["IsLinkedOK", "Linked"].includes(m.type)))
            .subscribe(m => {
            var _a;
            const msg = m;
            (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.LINKED, {
                sessionIdHash: Session_1.Session.hash(sessionId),
                linked: msg.linked,
                type: m.type,
                onlineGuests: msg.onlineGuests,
            });
            this.linkedSubject.next(msg.linked || msg.onlineGuests > 0);
        }));
        // handle session config updates
        this.subscriptions.add(ws.incomingJSONData$
            .pipe((0, operators_1.filter)(m => ["GetSessionConfigOK", "SessionConfigUpdated"].includes(m.type)))
            .subscribe(m => {
            var _a;
            const msg = m;
            (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.SESSION_CONFIG_RECEIVED, {
                sessionIdHash: Session_1.Session.hash(sessionId),
                metadata_keys: msg && msg.metadata ? Object.keys(msg.metadata) : undefined,
            });
            this.sessionConfigSubject.next({
                webhookId: msg.webhookId,
                webhookUrl: msg.webhookUrl,
                metadata: msg.metadata,
            });
        }));
    }
    /**
     * Make a connection to the server
     */
    connect() {
        var _a;
        if (this.destroyed) {
            throw new Error("instance is destroyed");
        }
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.STARTED_CONNECTING, {
            sessionIdHash: Session_1.Session.hash(this.sessionId),
        });
        this.ws.connect().subscribe();
    }
    /**
     * Terminate connection, and mark as destroyed. To reconnect, create a new
     * instance of WalletSDKConnection
     */
    destroy() {
        var _a;
        this.subscriptions.unsubscribe();
        this.ws.disconnect();
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.DISCONNECTED, {
            sessionIdHash: Session_1.Session.hash(this.sessionId),
        });
        this.destroyed = true;
    }
    get isDestroyed() {
        return this.destroyed;
    }
    /**
     * Emit true if connected and authenticated, else false
     * @returns an Observable
     */
    get connected$() {
        return this.connectedSubject.asObservable();
    }
    /**
     * Emit once connected
     * @returns an Observable
     */
    get onceConnected$() {
        return this.connected$.pipe((0, operators_1.filter)(v => v), (0, operators_1.take)(1), (0, operators_1.map)(() => void 0));
    }
    /**
     * Emit true if linked (a guest has joined before)
     * @returns an Observable
     */
    get linked$() {
        return this.linkedSubject.asObservable();
    }
    /**
     * Emit once when linked
     * @returns an Observable
     */
    get onceLinked$() {
        return this.linked$.pipe((0, operators_1.filter)(v => v), (0, operators_1.take)(1), (0, operators_1.map)(() => void 0));
    }
    /**
     * Emit current session config if available, and subsequent updates
     * @returns an Observable for the session config
     */
    get sessionConfig$() {
        return this.sessionConfigSubject.asObservable();
    }
    /**
     * Emit incoming Event messages
     * @returns an Observable for the messages
     */
    get incomingEvent$() {
        return this.ws.incomingJSONData$.pipe((0, operators_1.filter)(m => {
            if (m.type !== "Event") {
                return false;
            }
            const sme = m;
            return (typeof sme.sessionId === "string" &&
                typeof sme.eventId === "string" &&
                typeof sme.event === "string" &&
                typeof sme.data === "string");
        }), (0, operators_1.map)(m => m));
    }
    /**
     * Set session metadata in SessionConfig object
     * @param key
     * @param value
     * @returns an Observable that completes when successful
     */
    setSessionMetadata(key, value) {
        const message = (0, ClientMessage_1.ClientMessageSetSessionConfig)({
            id: (0, types_1.IntNumber)(this.nextReqId++),
            sessionId: this.sessionId,
            metadata: { [key]: value },
        });
        return this.onceConnected$.pipe((0, operators_1.flatMap)(_ => this.makeRequest(message)), (0, operators_1.map)(res => {
            if ((0, ServerMessage_1.isServerMessageFail)(res)) {
                throw new Error(res.error || "failed to set session metadata");
            }
        }));
    }
    /**
     * Publish an event and emit event ID when successful
     * @param event event name
     * @param data event data
     * @param callWebhook whether the webhook should be invoked
     * @returns an Observable that emits event ID when successful
     */
    publishEvent(event, data, callWebhook = false) {
        const message = (0, ClientMessage_1.ClientMessagePublishEvent)({
            id: (0, types_1.IntNumber)(this.nextReqId++),
            sessionId: this.sessionId,
            event,
            data,
            callWebhook,
        });
        return this.onceLinked$.pipe((0, operators_1.flatMap)(_ => this.makeRequest(message)), (0, operators_1.map)(res => {
            if ((0, ServerMessage_1.isServerMessageFail)(res)) {
                throw new Error(res.error || "failed to publish event");
            }
            return res.eventId;
        }));
    }
    sendData(message) {
        this.ws.sendData(JSON.stringify(message));
    }
    updateLastHeartbeat() {
        this.lastHeartbeatResponse = Date.now();
    }
    heartbeat() {
        if (Date.now() - this.lastHeartbeatResponse > HEARTBEAT_INTERVAL * 2) {
            this.ws.disconnect();
            return;
        }
        try {
            this.ws.sendData("h");
        }
        catch (_a) { }
    }
    makeRequest(message, timeout = REQUEST_TIMEOUT) {
        const reqId = message.id;
        try {
            this.sendData(message);
        }
        catch (err) {
            return (0, rxjs_1.throwError)(err);
        }
        // await server message with corresponding id
        return this.ws.incomingJSONData$.pipe((0, operators_1.timeoutWith)(timeout, (0, rxjs_1.throwError)(new Error(`request ${reqId} timed out`))), (0, operators_1.filter)(m => m.id === reqId), (0, operators_1.take)(1));
    }
    authenticate() {
        const msg = (0, ClientMessage_1.ClientMessageHostSession)({
            id: (0, types_1.IntNumber)(this.nextReqId++),
            sessionId: this.sessionId,
            sessionKey: this.sessionKey,
        });
        return this.makeRequest(msg).pipe((0, operators_1.map)(res => {
            if ((0, ServerMessage_1.isServerMessageFail)(res)) {
                throw new Error(res.error || "failed to authentcate");
            }
        }));
    }
    sendIsLinked() {
        const msg = (0, ClientMessage_1.ClientMessageIsLinked)({
            id: (0, types_1.IntNumber)(this.nextReqId++),
            sessionId: this.sessionId,
        });
        this.sendData(msg);
    }
    sendGetSessionConfig() {
        const msg = (0, ClientMessage_1.ClientMessageGetSessionConfig)({
            id: (0, types_1.IntNumber)(this.nextReqId++),
            sessionId: this.sessionId,
        });
        this.sendData(msg);
    }
}
exports.WalletSDKConnection = WalletSDKConnection;
