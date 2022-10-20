"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_TYPED_DATA = exports.MOCK_SIGNED_TX = exports.MOCK_TX = exports.MOCK_ADDERESS = void 0;
exports.MOCK_ADDERESS = "0xFadAFCE89EA2221fa33005640Acf2C923312F2b9";
exports.MOCK_TX = "0xc21a1aaace40a8ee9dd3827ae5a85412a05755cc004469efaf3cfdd82c59a670";
exports.MOCK_SIGNED_TX = ":f87a1b8504a817c80082520894c589ac793af309db9690d819abc9aab37d169f6a8814d1120d7b1600008e0deadbeef0cafebabe01234567891ba03cd26b08b246f23f74fceb2c063021955e691cf7d45fba443a2e504a4700dba5a0337b1f8dbf21ef35adf6e2a867d9c7bc836d1b79c8ab40c670385a2d0abca88c";
exports.MOCK_TYPED_DATA = JSON.stringify({
    types: {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
            { name: "salt", type: "bytes32" },
        ],
        Bid: [
            { name: "amount", type: "uint256" },
            { name: "bidder", type: "Identity" },
        ],
        Identity: [
            { name: "userId", type: "uint256" },
            { name: "wallet", type: "address" },
        ],
    },
    domain: {
        name: "Provider Test",
        version: "1",
        chainId: parseInt("1", 10),
        verifyingContract: exports.MOCK_ADDERESS,
        salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558",
    },
    primaryType: "Bid",
    message: {
        amount: 100,
        bidder: {
            userId: 323,
            wallet: exports.MOCK_ADDERESS,
        },
    },
});
