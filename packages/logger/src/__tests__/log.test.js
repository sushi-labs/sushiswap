"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var __1 = __importDefault(require(".."));
jest.spyOn(global.console, 'log');
describe('logger', function () {
    it('prints a message', function () {
        (0, __1["default"])('hello');
        expect(console.log).toBeCalled();
    });
});
