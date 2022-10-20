"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase_1 = __importDefault(require("lodash/camelCase"));
const kebabCase_1 = __importDefault(require("lodash/kebabCase"));
const snakeCase_1 = __importDefault(require("lodash/snakeCase"));
const upperFirst_1 = __importDefault(require("lodash/upperFirst"));
const startCase_1 = __importDefault(require("lodash/startCase"));
function toCase(input, target) {
    switch (target) {
        case 'camel-case':
            return (0, camelCase_1.default)(input);
        case 'kebab-case':
            return (0, kebabCase_1.default)(input);
        case 'snake-case':
            return (0, snakeCase_1.default)(input);
        case 'pascal-case':
            return (0, upperFirst_1.default)((0, camelCase_1.default)(input));
        case 'start-case':
            return (0, startCase_1.default)(input);
        case 'upper-case':
        case 'uppercase':
            return input.toUpperCase();
        case 'sentence-case':
        case 'sentencecase':
            return (0, upperFirst_1.default)(input);
        case 'lower-case':
        case 'lowercase':
        case 'lowerCase': // Backwards compat config-angular v4
            return input.toLowerCase();
        default:
            throw new TypeError(`to-case: Unknown target case "${target}"`);
    }
}
exports.default = toCase;
//# sourceMappingURL=to-case.js.map