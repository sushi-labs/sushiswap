"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePath = void 0;
const isWin = process.platform === 'win32';
/**
 * Convert Windows separators to Unix separators.
 */
function normalizePath(p) {
    return isWin ? p.replace(/\\/g, '/') : p;
}
exports.normalizePath = normalizePath;
