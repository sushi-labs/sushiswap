"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSDKUI = void 0;
const LinkFlow_1 = require("../components/LinkFlow");
const Snackbar_1 = require("../components/Snackbar");
const cssReset_1 = require("../lib/cssReset");
class WalletSDKUI {
    constructor(options) {
        this.standalone = null;
        this.attached = false;
        this.snackbar = new Snackbar_1.Snackbar({
            darkMode: options.darkMode,
        });
        this.linkFlow = new LinkFlow_1.LinkFlow({
            darkMode: options.darkMode,
            version: options.version,
            sessionId: options.session.id,
            sessionSecret: options.session.secret,
            linkAPIUrl: options.linkAPIUrl,
            connected$: options.connected$,
            isParentConnection: false,
        });
    }
    attach() {
        if (this.attached) {
            throw new Error("Coinbase Wallet SDK UI is already attached");
        }
        const el = document.documentElement;
        const container = document.createElement("div");
        container.className = "-cbwsdk-css-reset";
        el.appendChild(container);
        this.linkFlow.attach(container);
        this.snackbar.attach(container);
        this.attached = true;
        (0, cssReset_1.injectCssReset)();
    }
    setConnectDisabled(connectDisabled) {
        this.linkFlow.setConnectDisabled(connectDisabled);
    }
    /* istanbul ignore next */
    addEthereumChain(_options) {
        // no-op
    }
    /* istanbul ignore next */
    watchAsset(_options) {
        // no-op
    }
    /* istanbul ignore next */
    switchEthereumChain(_options) {
        // no-op
    }
    requestEthereumAccounts(options) {
        this.linkFlow.open({ onCancel: options.onCancel });
    }
    hideRequestEthereumAccounts() {
        this.linkFlow.close();
    }
    /* istanbul ignore next */
    signEthereumMessage(_) {
        // No-op
    }
    /* istanbul ignore next */
    signEthereumTransaction(_) {
        // No-op
    }
    /* istanbul ignore next */
    submitEthereumTransaction(_) {
        // No-op
    }
    /* istanbul ignore next */
    ethereumAddressFromSignedMessage(_) {
        // No-op
    }
    showConnecting(options) {
        let snackbarProps;
        if (options.isUnlinkedErrorState) {
            snackbarProps = {
                autoExpand: true,
                message: "Connection lost",
                menuItems: [
                    {
                        isRed: false,
                        info: "Reset connection",
                        svgWidth: "10",
                        svgHeight: "11",
                        path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
                        defaultFillRule: "evenodd",
                        defaultClipRule: "evenodd",
                        onClick: options.onResetConnection,
                    },
                ],
            };
        }
        else {
            snackbarProps = {
                message: "Confirm on phone",
                menuItems: [
                    {
                        isRed: true,
                        info: "Cancel transaction",
                        svgWidth: "11",
                        svgHeight: "11",
                        path: "M10.3711 1.52346L9.21775 0.370117L5.37109 4.21022L1.52444 0.370117L0.371094 1.52346L4.2112 5.37012L0.371094 9.21677L1.52444 10.3701L5.37109 6.53001L9.21775 10.3701L10.3711 9.21677L6.53099 5.37012L10.3711 1.52346Z",
                        defaultFillRule: "inherit",
                        defaultClipRule: "inherit",
                        onClick: options.onCancel,
                    },
                    {
                        isRed: false,
                        info: "Reset connection",
                        svgWidth: "10",
                        svgHeight: "11",
                        path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
                        defaultFillRule: "evenodd",
                        defaultClipRule: "evenodd",
                        onClick: options.onResetConnection,
                    },
                ],
            };
        }
        return this.snackbar.presentItem(snackbarProps);
    }
    /* istanbul ignore next */
    reloadUI() {
        document.location.reload();
    }
    /* istanbul ignore next */
    inlineAccountsResponse() {
        return false;
    }
    /* istanbul ignore next */
    inlineAddEthereumChain(_chainId) {
        return false;
    }
    /* istanbul ignore next */
    inlineWatchAsset() {
        return false;
    }
    /* istanbul ignore next */
    inlineSwitchEthereumChain() {
        return false;
    }
    /* istanbul ignore next */
    setStandalone(status) {
        this.standalone = status;
    }
    /* istanbul ignore next */
    isStandalone() {
        var _a;
        return (_a = this.standalone) !== null && _a !== void 0 ? _a : false;
    }
}
exports.WalletSDKUI = WalletSDKUI;
