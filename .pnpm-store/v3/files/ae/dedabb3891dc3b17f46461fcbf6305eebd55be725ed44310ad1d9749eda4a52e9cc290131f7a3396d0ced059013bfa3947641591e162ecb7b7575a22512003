"use strict";
// Copyright (c) 2018-2022 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCode = void 0;
const preact_1 = require("preact");
const hooks_1 = require("preact/hooks");
const qrcode_svg_1 = __importDefault(require("../vendor-js/qrcode-svg"));
const QRCode = props => {
    const [svg, setSvg] = (0, hooks_1.useState)("");
    (0, hooks_1.useEffect)(() => {
        var _a, _b;
        const qrcode = new qrcode_svg_1.default({
            content: props.content,
            background: props.bgColor || "#ffffff",
            color: props.fgColor || "#000000",
            container: "svg",
            ecl: "M",
            width: (_a = props.width) !== null && _a !== void 0 ? _a : 256,
            height: (_b = props.height) !== null && _b !== void 0 ? _b : 256,
            padding: 0,
            image: props.image,
        });
        const base64 = Buffer.from(qrcode.svg(), "utf8").toString("base64");
        setSvg(`data:image/svg+xml;base64,${base64}`);
    });
    return svg ? (0, preact_1.h)("img", { src: svg, alt: "QR Code" }) : null;
};
exports.QRCode = QRCode;
