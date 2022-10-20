"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardforkGte = exports.getHardforkName = exports.HardforkName = exports.LONDON_EIPS = exports.BERLIN_EIPS = void 0;
const errors_1 = require("../core/errors");
exports.BERLIN_EIPS = new Set([
    // Homestead
    2, 7, 8,
    // Tangerine Whistle
    150, 158,
    // Spurious Dragon
    155, 160, 161, 170,
    // Byzantium
    100, 140, 196, 197, 198, 211, 214, 649, 658,
    // Constantinople
    1014, 1052, 1234, 145,
    // Istanbul
    1108, 1344, 152, 1884, 2028, 2200,
    // Muir Glacier
    2384,
    // Berlin
    2565, 2718, 2929, 2930,
]);
exports.LONDON_EIPS = new Set([
    ...exports.BERLIN_EIPS,
    // London
    1559,
    3198,
    3529,
    3541,
    3554,
]);
var HardforkName;
(function (HardforkName) {
    HardforkName["FRONTIER"] = "chainstart";
    HardforkName["HOMESTEAD"] = "homestead";
    HardforkName["DAO"] = "dao";
    HardforkName["TANGERINE_WHISTLE"] = "tangerineWhistle";
    HardforkName["SPURIOUS_DRAGON"] = "spuriousDragon";
    HardforkName["BYZANTIUM"] = "byzantium";
    HardforkName["CONSTANTINOPLE"] = "constantinople";
    HardforkName["PETERSBURG"] = "petersburg";
    HardforkName["ISTANBUL"] = "istanbul";
    HardforkName["MUIR_GLACIER"] = "muirGlacier";
    HardforkName["BERLIN"] = "berlin";
    HardforkName["LONDON"] = "london";
    HardforkName["ARROW_GLACIER"] = "arrowGlacier";
})(HardforkName = exports.HardforkName || (exports.HardforkName = {}));
const HARDFORKS_ORDER = [
    HardforkName.FRONTIER,
    HardforkName.HOMESTEAD,
    HardforkName.DAO,
    HardforkName.TANGERINE_WHISTLE,
    HardforkName.SPURIOUS_DRAGON,
    HardforkName.BYZANTIUM,
    HardforkName.CONSTANTINOPLE,
    HardforkName.PETERSBURG,
    HardforkName.ISTANBUL,
    HardforkName.MUIR_GLACIER,
    HardforkName.BERLIN,
    HardforkName.LONDON,
    HardforkName.ARROW_GLACIER,
];
function getHardforkName(name) {
    const hardforkName = Object.values(HardforkName)[Object.values(HardforkName).indexOf(name)];
    (0, errors_1.assertHardhatInvariant)(hardforkName !== undefined, `Invalid harfork name ${name}`);
    return hardforkName;
}
exports.getHardforkName = getHardforkName;
/**
 * Check if `hardforkA` is greater than or equal to `hardforkB`,
 * that is, if it includes all its changes.
 */
function hardforkGte(hardforkA, hardforkB) {
    // This function should not load any ethereumjs library, as it's used during
    // the Hardhat initialization, and that would make it too slow.
    const indexA = HARDFORKS_ORDER.lastIndexOf(hardforkA);
    const indexB = HARDFORKS_ORDER.lastIndexOf(hardforkB);
    return indexA >= indexB;
}
exports.hardforkGte = hardforkGte;
//# sourceMappingURL=hardforks.js.map