"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumAddressFromSignedMessageResponse = exports.SubmitEthereumTransactionResponse = exports.SignEthereumTransactionResponse = exports.SignEthereumMessageResponse = exports.isRequestEthereumAccountsResponse = exports.SelectProviderResponse = exports.WatchAssetReponse = exports.RequestEthereumAccountsResponse = exports.SwitchEthereumChainResponse = exports.AddEthereumChainResponse = exports.ErrorResponse = void 0;
const Web3Method_1 = require("./Web3Method");
function ErrorResponse(method, errorMessage, errorCode) {
    return { method, errorMessage, errorCode };
}
exports.ErrorResponse = ErrorResponse;
function AddEthereumChainResponse(addResponse) {
    return {
        method: Web3Method_1.Web3Method.addEthereumChain,
        result: addResponse,
    };
}
exports.AddEthereumChainResponse = AddEthereumChainResponse;
function SwitchEthereumChainResponse(switchResponse) {
    return {
        method: Web3Method_1.Web3Method.switchEthereumChain,
        result: switchResponse,
    };
}
exports.SwitchEthereumChainResponse = SwitchEthereumChainResponse;
function RequestEthereumAccountsResponse(addresses) {
    return { method: Web3Method_1.Web3Method.requestEthereumAccounts, result: addresses };
}
exports.RequestEthereumAccountsResponse = RequestEthereumAccountsResponse;
function WatchAssetReponse(success) {
    return { method: Web3Method_1.Web3Method.watchAsset, result: success };
}
exports.WatchAssetReponse = WatchAssetReponse;
function SelectProviderResponse(selectedProviderKey) {
    return { method: Web3Method_1.Web3Method.selectProvider, result: selectedProviderKey };
}
exports.SelectProviderResponse = SelectProviderResponse;
function isRequestEthereumAccountsResponse(res) {
    return res && res.method === Web3Method_1.Web3Method.requestEthereumAccounts;
}
exports.isRequestEthereumAccountsResponse = isRequestEthereumAccountsResponse;
function SignEthereumMessageResponse(signature) {
    return { method: Web3Method_1.Web3Method.signEthereumMessage, result: signature };
}
exports.SignEthereumMessageResponse = SignEthereumMessageResponse;
function SignEthereumTransactionResponse(signedData) {
    return { method: Web3Method_1.Web3Method.signEthereumTransaction, result: signedData };
}
exports.SignEthereumTransactionResponse = SignEthereumTransactionResponse;
function SubmitEthereumTransactionResponse(txHash) {
    return { method: Web3Method_1.Web3Method.submitEthereumTransaction, result: txHash };
}
exports.SubmitEthereumTransactionResponse = SubmitEthereumTransactionResponse;
function EthereumAddressFromSignedMessageResponse(address) {
    return {
        method: Web3Method_1.Web3Method.ethereumAddressFromSignedMessage,
        result: address,
    };
}
exports.EthereumAddressFromSignedMessageResponse = EthereumAddressFromSignedMessageResponse;
