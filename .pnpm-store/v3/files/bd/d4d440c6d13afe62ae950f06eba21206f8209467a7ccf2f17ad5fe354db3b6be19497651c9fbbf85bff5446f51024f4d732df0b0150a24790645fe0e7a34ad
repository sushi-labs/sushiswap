"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicGasHandlers = void 0;
const _1 = require(".");
const ethereumjs_util_1 = require("ethereumjs-util");
const exceptions_1 = require("../../exceptions");
const EIP1283_1 = require("./EIP1283");
const EIP2200_1 = require("./EIP2200");
const EIP2929_1 = require("./EIP2929");
exports.dynamicGasHandlers = new Map([
    [
        /* SHA3 */
        0x20,
        async function (runState, gas, common) {
            const [offset, length] = runState.stack.peek(2);
            gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
            gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'sha3Word')).imul((0, _1.divCeil)(length, new ethereumjs_util_1.BN(32))));
        },
    ],
    [
        /* BALANCE */
        0x31,
        async function (runState, gas, common) {
            if (common.isActivatedEIP(2929)) {
                const addressBN = runState.stack.peek()[0];
                const address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
            }
        },
    ],
    [
        /* CALLDATACOPY */
        0x37,
        async function (runState, gas, common) {
            const [memOffset, _dataOffset, dataLength] = runState.stack.peek(3);
            gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
            if (!dataLength.eqn(0)) {
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).imul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
            }
        },
    ],
    [
        /* CODECOPY */
        0x39,
        async function (runState, gas, common) {
            const [memOffset, _codeOffset, dataLength] = runState.stack.peek(3);
            gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
            if (!dataLength.eqn(0)) {
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).imul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
            }
        },
    ],
    [
        /* EXTCODESIZE */
        0x3b,
        async function (runState, gas, common) {
            if (common.isActivatedEIP(2929)) {
                const addressBN = runState.stack.peek()[0];
                const address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
            }
        },
    ],
    [
        /* EXTCODECOPY */
        0x3c,
        async function (runState, gas, common) {
            const [addressBN, memOffset, _codeOffset, dataLength] = runState.stack.peek(4);
            gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
            if (common.isActivatedEIP(2929)) {
                const address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
            }
            if (!dataLength.eqn(0)) {
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).imul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
            }
        },
    ],
    [
        /* RETURNDATACOPY */
        0x3e,
        async function (runState, gas, common) {
            const [memOffset, returnDataOffset, dataLength] = runState.stack.peek(3);
            if (returnDataOffset.add(dataLength).gt(runState.eei.getReturnDataSize())) {
                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
            }
            gas.iadd((0, _1.subMemUsage)(runState, memOffset, dataLength, common));
            if (!dataLength.eqn(0)) {
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'copy')).mul((0, _1.divCeil)(dataLength, new ethereumjs_util_1.BN(32))));
            }
        },
    ],
    [
        /* EXTCODEHASH */
        0x3f,
        async function (runState, gas, common) {
            if (common.isActivatedEIP(2929)) {
                const addressBN = runState.stack.peek()[0];
                const address = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(addressBN));
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, address, common));
            }
        },
    ],
    [
        /* MLOAD */
        0x51,
        async function (runState, gas, common) {
            const pos = runState.stack.peek()[0];
            gas.iadd((0, _1.subMemUsage)(runState, pos, new ethereumjs_util_1.BN(32), common));
        },
    ],
    [
        /* MSTORE */
        0x52,
        async function (runState, gas, common) {
            const offset = runState.stack.peek()[0];
            gas.iadd((0, _1.subMemUsage)(runState, offset, new ethereumjs_util_1.BN(32), common));
        },
    ],
    [
        /* MSTORE8 */
        0x53,
        async function (runState, gas, common) {
            const offset = runState.stack.peek()[0];
            gas.iadd((0, _1.subMemUsage)(runState, offset, new ethereumjs_util_1.BN(1), common));
        },
    ],
    [
        /* SLOAD */
        0x54,
        async function (runState, gas, common) {
            const key = runState.stack.peek()[0];
            const keyBuf = key.toArrayLike(Buffer, 'be', 32);
            if (common.isActivatedEIP(2929)) {
                gas.iadd((0, EIP2929_1.accessStorageEIP2929)(runState, keyBuf, false, common));
            }
        },
    ],
    [
        /* SSTORE */
        0x55,
        async function (runState, gas, common) {
            if (runState.eei.isStatic()) {
                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
            }
            const [key, val] = runState.stack.peek(2);
            const keyBuf = key.toArrayLike(Buffer, 'be', 32);
            // NOTE: this should be the shortest representation
            let value;
            if (val.isZero()) {
                value = Buffer.from([]);
            }
            else {
                value = val.toArrayLike(Buffer, 'be');
            }
            // TODO: Replace getContractStorage with EEI method
            const currentStorage = (0, _1.setLengthLeftStorage)(await runState.eei.storageLoad(keyBuf));
            const originalStorage = (0, _1.setLengthLeftStorage)(await runState.eei.storageLoad(keyBuf, true));
            if (common.hardfork() === 'constantinople') {
                gas.iadd((0, EIP1283_1.updateSstoreGasEIP1283)(runState, currentStorage, originalStorage, (0, _1.setLengthLeftStorage)(value), common));
            }
            else if (common.gteHardfork('istanbul')) {
                gas.iadd((0, EIP2200_1.updateSstoreGasEIP2200)(runState, currentStorage, originalStorage, (0, _1.setLengthLeftStorage)(value), keyBuf, common));
            }
            else {
                gas.iadd((0, _1.updateSstoreGas)(runState, currentStorage, (0, _1.setLengthLeftStorage)(value), common));
            }
            if (common.isActivatedEIP(2929)) {
                // We have to do this after the Istanbul (EIP2200) checks.
                // Otherwise, we might run out of gas, due to "sentry check" of 2300 gas,
                // if we deduct extra gas first.
                gas.iadd((0, EIP2929_1.accessStorageEIP2929)(runState, keyBuf, true, common));
            }
        },
    ],
    [
        /* LOG */
        0xa0,
        async function (runState, gas, common) {
            if (runState.eei.isStatic()) {
                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
            }
            const [memOffset, memLength] = runState.stack.peek(2);
            const topicsCount = runState.opCode - 0xa0;
            if (topicsCount < 0 || topicsCount > 4) {
                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_RANGE);
            }
            gas.iadd((0, _1.subMemUsage)(runState, memOffset, memLength, common));
            gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'logTopic'))
                .imuln(topicsCount)
                .iadd(memLength.muln(common.param('gasPrices', 'logData'))));
        },
    ],
    [
        /* CREATE */
        0xf0,
        async function (runState, gas, common) {
            if (runState.eei.isStatic()) {
                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
            }
            const [_value, offset, length] = runState.stack.peek(3);
            if (common.isActivatedEIP(2929)) {
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, runState.eei.getAddress(), common, false));
            }
            gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
            if (common.isActivatedEIP(3860)) {
                // Meter initcode
                const initCodeCost = new ethereumjs_util_1.BN(common.param('gasPrices', 'initCodeWordCost')).imul(length.addn(31).divn(32));
                gas.iadd(initCodeCost);
            }
            let gasLimit = new ethereumjs_util_1.BN(runState.eei.getGasLeft().isub(gas));
            gasLimit = (0, _1.maxCallGas)(gasLimit.clone(), gasLimit.clone(), runState, common);
            runState.messageGasLimit = gasLimit;
        },
    ],
    [
        /* CALL */
        0xf1,
        async function (runState, gas, common) {
            const [currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] = runState.stack.peek(7);
            const toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
            if (runState.eei.isStatic() && !value.isZero()) {
                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
            }
            gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
            gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
            if (common.isActivatedEIP(2929)) {
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
            }
            if (!value.isZero()) {
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callValueTransfer')));
            }
            if (common.gteHardfork('spuriousDragon')) {
                // We are at or after Spurious Dragon
                // Call new account gas: account is DEAD and we transfer nonzero value
                if ((await runState.eei.isAccountEmpty(toAddress)) && !value.isZero()) {
                    gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callNewAccount')));
                }
            }
            else if (!(await runState.eei.accountExists(toAddress))) {
                // We are before Spurious Dragon and the account does not exist.
                // Call new account gas: account does not exist (it is not in the state trie, not even as an "empty" account)
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callNewAccount')));
            }
            const gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common);
            // note that TangerineWhistle or later this cannot happen
            // (it could have ran out of gas prior to getting here though)
            if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
            }
            if (gas.gt(runState.eei.getGasLeft())) {
                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
            }
            if (!value.isZero()) {
                // TODO: Don't use private attr directly
                runState.eei._gasLeft.iaddn(common.param('gasPrices', 'callStipend'));
                gasLimit.iaddn(common.param('gasPrices', 'callStipend'));
            }
            runState.messageGasLimit = gasLimit;
        },
    ],
    [
        /* CALLCODE */
        0xf2,
        async function (runState, gas, common) {
            const [currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] = runState.stack.peek(7);
            gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
            gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
            if (common.isActivatedEIP(2929)) {
                const toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
            }
            if (!value.isZero()) {
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callValueTransfer')));
            }
            const gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common);
            // note that TangerineWhistle or later this cannot happen
            // (it could have ran out of gas prior to getting here though)
            if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
            }
            if (!value.isZero()) {
                // TODO: Don't use private attr directly
                runState.eei._gasLeft.iaddn(common.param('gasPrices', 'callStipend'));
                gasLimit.iaddn(common.param('gasPrices', 'callStipend'));
            }
            runState.messageGasLimit = gasLimit;
        },
    ],
    [
        /* RETURN */
        0xf3,
        async function (runState, gas, common) {
            const [offset, length] = runState.stack.peek(2);
            gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
        },
    ],
    [
        /* DELEGATECALL */
        0xf4,
        async function (runState, gas, common) {
            const [currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] = runState.stack.peek(6);
            gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
            gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
            if (common.isActivatedEIP(2929)) {
                const toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
            }
            const gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common);
            // note that TangerineWhistle or later this cannot happen
            // (it could have ran out of gas prior to getting here though)
            if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
                (0, _1.trap)(exceptions_1.ERROR.OUT_OF_GAS);
            }
            runState.messageGasLimit = gasLimit;
        },
    ],
    [
        /* CREATE2 */
        0xf5,
        async function (runState, gas, common) {
            if (runState.eei.isStatic()) {
                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
            }
            const [_value, offset, length, _salt] = runState.stack.peek(4);
            gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
            if (common.isActivatedEIP(2929)) {
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, runState.eei.getAddress(), common, false));
            }
            gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'sha3Word')).imul((0, _1.divCeil)(length, new ethereumjs_util_1.BN(32))));
            if (common.isActivatedEIP(3860)) {
                // Meter initcode
                const initCodeCost = new ethereumjs_util_1.BN(common.param('gasPrices', 'initCodeWordCost')).imul(length.addn(31).divn(32));
                gas.iadd(initCodeCost);
            }
            let gasLimit = new ethereumjs_util_1.BN(runState.eei.getGasLeft().isub(gas));
            gasLimit = (0, _1.maxCallGas)(gasLimit.clone(), gasLimit.clone(), runState, common); // CREATE2 is only available after TangerineWhistle (Constantinople introduced this opcode)
            runState.messageGasLimit = gasLimit;
        },
    ],
    [
        /* STATICCALL */
        0xfa,
        async function (runState, gas, common) {
            const [currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] = runState.stack.peek(6);
            gas.iadd((0, _1.subMemUsage)(runState, inOffset, inLength, common));
            gas.iadd((0, _1.subMemUsage)(runState, outOffset, outLength, common));
            if (common.isActivatedEIP(2929)) {
                const toAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(toAddr));
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, toAddress, common));
            }
            const gasLimit = (0, _1.maxCallGas)(currentGasLimit.clone(), runState.eei.getGasLeft().isub(gas), runState, common); // we set TangerineWhistle or later to true here, as STATICCALL was available from Byzantium (which is after TangerineWhistle)
            runState.messageGasLimit = gasLimit;
        },
    ],
    [
        /* REVERT */
        0xfd,
        async function (runState, gas, common) {
            const [offset, length] = runState.stack.peek(2);
            gas.iadd((0, _1.subMemUsage)(runState, offset, length, common));
        },
    ],
    [
        /* SELFDESTRUCT */
        0xff,
        async function (runState, gas, common) {
            if (runState.eei.isStatic()) {
                (0, _1.trap)(exceptions_1.ERROR.STATIC_STATE_CHANGE);
            }
            const selfdestructToAddressBN = runState.stack.peek()[0];
            const selfdestructToAddress = new ethereumjs_util_1.Address((0, _1.addressToBuffer)(selfdestructToAddressBN));
            let deductGas = false;
            if (common.gteHardfork('spuriousDragon')) {
                // EIP-161: State Trie Clearing
                const balance = await runState.eei.getExternalBalance(runState.eei.getAddress());
                if (balance.gtn(0)) {
                    // This technically checks if account is empty or non-existent
                    // TODO: improve on the API here (EEI and StateManager)
                    const empty = await runState.eei.isAccountEmpty(selfdestructToAddress);
                    if (empty) {
                        deductGas = true;
                    }
                }
            }
            else if (common.gteHardfork('tangerineWhistle')) {
                // EIP-150 (Tangerine Whistle) gas semantics
                const exists = await runState.stateManager.accountExists(selfdestructToAddress);
                if (!exists) {
                    deductGas = true;
                }
            }
            if (deductGas) {
                gas.iadd(new ethereumjs_util_1.BN(common.param('gasPrices', 'callNewAccount')));
            }
            if (common.isActivatedEIP(2929)) {
                gas.iadd((0, EIP2929_1.accessAddressEIP2929)(runState, selfdestructToAddress, common, true, true));
            }
        },
    ],
]);
// Set the range [0xa0, 0xa4] to the LOG handler
const logDynamicFunc = exports.dynamicGasHandlers.get(0xa0);
for (let i = 0xa1; i <= 0xa4; i++) {
    exports.dynamicGasHandlers.set(i, logDynamicFunc);
}
//# sourceMappingURL=gas.js.map