"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = void 0;
const preact_1 = require("preact");
const Spinner_css_1 = __importDefault(require("./Spinner-css"));
const Spinner = props => {
    var _a;
    const size = (_a = props.size) !== null && _a !== void 0 ? _a : 64;
    const color = props.color || "#000";
    return ((0, preact_1.h)("div", { class: "-cbwsdk-spinner" },
        (0, preact_1.h)("style", null, Spinner_css_1.default),
        (0, preact_1.h)("svg", { viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg", style: { width: size, height: size } },
            (0, preact_1.h)("circle", { style: { cx: 50, cy: 50, r: 45, stroke: color } }))));
};
exports.Spinner = Spinner;
