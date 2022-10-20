"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeb3ResponseMessage = exports.Web3ResponseMessage = void 0;
const RelayMessage_1 = require("./RelayMessage");
function Web3ResponseMessage(params) {
    return Object.assign({ type: RelayMessage_1.RelayMessageType.WEB3_RESPONSE }, params);
}
exports.Web3ResponseMessage = Web3ResponseMessage;
function isWeb3ResponseMessage(msg) {
    return msg && msg.type === RelayMessage_1.RelayMessageType.WEB3_RESPONSE;
}
exports.isWeb3ResponseMessage = isWeb3ResponseMessage;
