"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethereumjs_util_1 = require("ethereumjs-util");
var block_1 = require("@ethereumjs/block");
var txContext_1 = __importDefault(require("./evm/txContext"));
var message_1 = __importDefault(require("./evm/message"));
var evm_1 = __importDefault(require("./evm/evm"));
/**
 * @ignore
 */
function runCall(opts) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var block = (_a = opts.block) !== null && _a !== void 0 ? _a : block_1.Block.fromBlockData({}, { common: this._common });
    var txContext = new txContext_1.default((_b = opts.gasPrice) !== null && _b !== void 0 ? _b : new ethereumjs_util_1.BN(0), (_d = (_c = opts.origin) !== null && _c !== void 0 ? _c : opts.caller) !== null && _d !== void 0 ? _d : ethereumjs_util_1.Address.zero());
    var message = new message_1.default({
        caller: (_e = opts.caller) !== null && _e !== void 0 ? _e : ethereumjs_util_1.Address.zero(),
        gasLimit: (_f = opts.gasLimit) !== null && _f !== void 0 ? _f : new ethereumjs_util_1.BN(0xffffff),
        to: (_g = opts.to) !== null && _g !== void 0 ? _g : undefined,
        value: opts.value,
        data: opts.data,
        code: opts.code,
        depth: (_h = opts.depth) !== null && _h !== void 0 ? _h : 0,
        isCompiled: (_j = opts.compiled) !== null && _j !== void 0 ? _j : false,
        isStatic: (_k = opts.static) !== null && _k !== void 0 ? _k : false,
        salt: (_l = opts.salt) !== null && _l !== void 0 ? _l : null,
        selfdestruct: (_m = opts.selfdestruct) !== null && _m !== void 0 ? _m : {},
        delegatecall: (_o = opts.delegatecall) !== null && _o !== void 0 ? _o : false,
    });
    var evm = new evm_1.default(this, txContext, block);
    return evm.executeMessage(message);
}
exports.default = runCall;
//# sourceMappingURL=runCall.js.map