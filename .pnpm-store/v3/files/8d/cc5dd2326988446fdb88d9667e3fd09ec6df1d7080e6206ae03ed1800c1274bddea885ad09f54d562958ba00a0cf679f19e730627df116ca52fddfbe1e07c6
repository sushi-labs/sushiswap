"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedNodeVersion = exports.getDiscontinuedNodeVersions = exports.getLatestNodeVersion = void 0;
const semver_1 = require("semver");
const errors_1 = require("../errors");
const debug_1 = __importDefault(require("../debug"));
const allOptions = [
    { major: 16, range: '16.x', runtime: 'nodejs16.x' },
    { major: 14, range: '14.x', runtime: 'nodejs14.x' },
    {
        major: 12,
        range: '12.x',
        runtime: 'nodejs12.x',
        discontinueDate: new Date('2022-08-09'),
    },
    {
        major: 10,
        range: '10.x',
        runtime: 'nodejs10.x',
        discontinueDate: new Date('2021-04-20'),
    },
    {
        major: 8,
        range: '8.10.x',
        runtime: 'nodejs8.10',
        discontinueDate: new Date('2020-01-06'),
    },
];
function getHint(isAuto = false) {
    const { major, range } = getLatestNodeVersion();
    return isAuto
        ? `Please set Node.js Version to ${range} in your Project Settings to use Node.js ${major}.`
        : `Please set "engines": { "node": "${range}" } in your \`package.json\` file to use Node.js ${major}.`;
}
function getLatestNodeVersion() {
    return allOptions[0];
}
exports.getLatestNodeVersion = getLatestNodeVersion;
function getDiscontinuedNodeVersions() {
    return allOptions.filter(isDiscontinued);
}
exports.getDiscontinuedNodeVersions = getDiscontinuedNodeVersions;
async function getSupportedNodeVersion(engineRange, isAuto = false) {
    let selection = getLatestNodeVersion();
    if (engineRange) {
        const found = semver_1.validRange(engineRange) &&
            allOptions.some(o => {
                // the array is already in order so return the first
                // match which will be the newest version of node
                selection = o;
                return semver_1.intersects(o.range, engineRange);
            });
        if (!found) {
            throw new errors_1.NowBuildError({
                code: 'BUILD_UTILS_NODE_VERSION_INVALID',
                link: 'http://vercel.link/node-version',
                message: `Found invalid Node.js Version: "${engineRange}". ${getHint(isAuto)}`,
            });
        }
    }
    if (isDiscontinued(selection)) {
        const intro = `Node.js Version "${selection.range}" is discontinued and must be upgraded.`;
        throw new errors_1.NowBuildError({
            code: 'BUILD_UTILS_NODE_VERSION_DISCONTINUED',
            link: 'http://vercel.link/node-version',
            message: `${intro} ${getHint(isAuto)}`,
        });
    }
    debug_1.default(`Selected Node.js ${selection.range}`);
    if (selection.discontinueDate) {
        const d = selection.discontinueDate.toISOString().split('T')[0];
        console.warn(`Error: Node.js version ${selection.range} has reached End-of-Life. Deployments created on or after ${d} will fail to build. ${getHint(isAuto)}`);
    }
    return selection;
}
exports.getSupportedNodeVersion = getSupportedNodeVersion;
function isDiscontinued({ discontinueDate }) {
    const today = Date.now();
    return discontinueDate !== undefined && discontinueDate.getTime() <= today;
}
