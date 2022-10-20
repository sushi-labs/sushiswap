"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethereumjs_util_1 = require("ethereumjs-util");
var evm_1 = require("../evm");
var assert = require('assert');
function default_1(opts) {
    assert(opts.data);
    var gasUsed = new ethereumjs_util_1.BN(opts._common.param('gasPrices', 'ecRecover'));
    if (opts.gasLimit.lt(gasUsed)) {
        return (0, evm_1.OOGResult)(opts.gasLimit);
    }
    var data = (0, ethereumjs_util_1.setLengthRight)(opts.data, 128);
    var msgHash = data.slice(0, 32);
    var v = data.slice(32, 64);
    var vBN = new ethereumjs_util_1.BN(v);
    // Guard against util's `ecrecover`: without providing chainId this will return
    // a signature in most of the cases in the cases that `v=0` or `v=1`
    // However, this should throw, only 27 and 28 is allowed as input
    if (!vBN.eqn(27) && !vBN.eqn(28)) {
        return {
            gasUsed: gasUsed,
            returnValue: Buffer.alloc(0),
        };
    }
    var r = data.slice(64, 96);
    var s = data.slice(96, 128);
    var publicKey;
    try {
        publicKey = (0, ethereumjs_util_1.ecrecover)(msgHash, new ethereumjs_util_1.BN(v), r, s);
    }
    catch (e) {
        return {
            gasUsed: gasUsed,
            returnValue: Buffer.alloc(0),
        };
    }
    return {
        gasUsed: gasUsed,
        returnValue: (0, ethereumjs_util_1.setLengthLeft)((0, ethereumjs_util_1.publicToAddress)(publicKey), 32),
    };
}
exports.default = default_1;
//# sourceMappingURL=01-ecrecover.js.map