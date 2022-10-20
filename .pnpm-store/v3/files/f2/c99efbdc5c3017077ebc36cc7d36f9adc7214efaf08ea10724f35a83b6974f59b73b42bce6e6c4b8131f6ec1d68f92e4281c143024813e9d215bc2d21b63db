"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustSstoreGasEIP2929 = exports.accessStorageEIP2929 = exports.accessAddressEIP2929 = void 0;
const ethereumjs_util_1 = require("ethereumjs-util");
/**
 * Adds address to accessedAddresses set if not already included.
 * Adjusts cost incurred for executing opcode based on whether address read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {BN}       address
 * @param {Common}   common
 * @param {Boolean}  chargeGas (default: true)
 * @param {Boolean}  isSelfdestruct (default: false)
 */
function accessAddressEIP2929(runState, address, common, chargeGas = true, isSelfdestruct = false) {
    if (!common.isActivatedEIP(2929))
        return new ethereumjs_util_1.BN(0);
    const stateManager = runState.stateManager;
    const addressStr = address.buf;
    // Cold
    if (!stateManager.isWarmedAddress(addressStr)) {
        stateManager.addWarmedAddress(addressStr);
        // CREATE, CREATE2 opcodes have the address warmed for free.
        // selfdestruct beneficiary address reads are charged an *additional* cold access
        if (chargeGas) {
            return new ethereumjs_util_1.BN(common.param('gasPrices', 'coldaccountaccess'));
        }
        // Warm: (selfdestruct beneficiary address reads are not charged when warm)
    }
    else if (chargeGas && !isSelfdestruct) {
        return new ethereumjs_util_1.BN(common.param('gasPrices', 'warmstorageread'));
    }
    return new ethereumjs_util_1.BN(0);
}
exports.accessAddressEIP2929 = accessAddressEIP2929;
/**
 * Adds (address, key) to accessedStorage tuple set if not already included.
 * Adjusts cost incurred for executing opcode based on whether storage read
 * is warm/cold. (EIP 2929)
 * @param {RunState} runState
 * @param {Buffer} key (to storage slot)
 * @param {Common} common
 */
function accessStorageEIP2929(runState, key, isSstore, common) {
    if (!common.isActivatedEIP(2929))
        return new ethereumjs_util_1.BN(0);
    const stateManager = runState.stateManager;
    const address = runState.eei.getAddress().buf;
    const slotIsCold = !stateManager.isWarmedStorage(address, key);
    // Cold (SLOAD and SSTORE)
    if (slotIsCold) {
        stateManager.addWarmedStorage(address, key);
        return new ethereumjs_util_1.BN(common.param('gasPrices', 'coldsload'));
    }
    else if (!isSstore) {
        return new ethereumjs_util_1.BN(common.param('gasPrices', 'warmstorageread'));
    }
    return new ethereumjs_util_1.BN(0);
}
exports.accessStorageEIP2929 = accessStorageEIP2929;
/**
 * Adjusts cost of SSTORE_RESET_GAS or SLOAD (aka sstorenoop) (EIP-2200) downward when storage
 * location is already warm
 * @param  {RunState} runState
 * @param  {Buffer}   key          storage slot
 * @param  {BN}       defaultCost  SSTORE_RESET_GAS / SLOAD
 * @param  {string}   costName     parameter name ('noop')
 * @param  {Common}   common
 * @return {BN}                    adjusted cost
 */
function adjustSstoreGasEIP2929(runState, key, defaultCost, costName, common) {
    if (!common.isActivatedEIP(2929))
        return defaultCost;
    const stateManager = runState.stateManager;
    const address = runState.eei.getAddress().buf;
    const warmRead = new ethereumjs_util_1.BN(common.param('gasPrices', 'warmstorageread'));
    const coldSload = new ethereumjs_util_1.BN(common.param('gasPrices', 'coldsload'));
    if (stateManager.isWarmedStorage(address, key)) {
        switch (costName) {
            case 'noop':
                return warmRead;
            case 'initRefund':
                return new ethereumjs_util_1.BN(common.param('gasPrices', 'sstoreInitGasEIP2200')).sub(warmRead);
            case 'cleanRefund':
                return new ethereumjs_util_1.BN(common.param('gasPrices', 'sstoreReset')).sub(coldSload).sub(warmRead);
        }
    }
    return defaultCost;
}
exports.adjustSstoreGasEIP2929 = adjustSstoreGasEIP2929;
//# sourceMappingURL=EIP2929.js.map