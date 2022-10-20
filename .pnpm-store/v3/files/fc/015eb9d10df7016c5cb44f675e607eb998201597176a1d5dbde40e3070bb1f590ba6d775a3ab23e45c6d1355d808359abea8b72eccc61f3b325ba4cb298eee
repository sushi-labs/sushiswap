"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinbaseWalletProvider = exports.CoinbaseWalletSDK = void 0;
const CoinbaseWalletSDK_1 = require("./CoinbaseWalletSDK");
const CoinbaseWalletProvider_1 = require("./provider/CoinbaseWalletProvider");
var CoinbaseWalletSDK_2 = require("./CoinbaseWalletSDK");
Object.defineProperty(exports, "CoinbaseWalletSDK", { enumerable: true, get: function () { return CoinbaseWalletSDK_2.CoinbaseWalletSDK; } });
var CoinbaseWalletProvider_2 = require("./provider/CoinbaseWalletProvider");
Object.defineProperty(exports, "CoinbaseWalletProvider", { enumerable: true, get: function () { return CoinbaseWalletProvider_2.CoinbaseWalletProvider; } });
exports.default = CoinbaseWalletSDK_1.CoinbaseWalletSDK;
if (typeof window !== "undefined") {
    window.CoinbaseWalletSDK = CoinbaseWalletSDK_1.CoinbaseWalletSDK;
    window.CoinbaseWalletProvider = CoinbaseWalletProvider_1.CoinbaseWalletProvider;
    /**
     * @deprecated Use `window.CoinbaseWalletSDK`
     */
    window.WalletLink = CoinbaseWalletSDK_1.CoinbaseWalletSDK;
    /**
     * @deprecated Use `window.CoinbaseWalletProvider`
     */
    window.WalletLinkProvider = CoinbaseWalletProvider_1.CoinbaseWalletProvider;
}
