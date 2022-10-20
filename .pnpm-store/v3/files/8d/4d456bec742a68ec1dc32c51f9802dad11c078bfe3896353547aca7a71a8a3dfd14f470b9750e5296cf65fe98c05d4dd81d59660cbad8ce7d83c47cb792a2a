"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderType = exports.RegExpString = exports.IntNumber = exports.BigIntString = exports.AddressString = exports.HexString = exports.OpaqueType = void 0;
function OpaqueType() {
    return (value) => value;
}
exports.OpaqueType = OpaqueType;
exports.HexString = OpaqueType();
exports.AddressString = OpaqueType();
exports.BigIntString = OpaqueType();
function IntNumber(num) {
    return Math.floor(num);
}
exports.IntNumber = IntNumber;
exports.RegExpString = OpaqueType();
var ProviderType;
(function (ProviderType) {
    ProviderType["CoinbaseWallet"] = "CoinbaseWallet";
    ProviderType["MetaMask"] = "MetaMask";
    ProviderType["Unselected"] = "";
})(ProviderType = exports.ProviderType || (exports.ProviderType = {}));
