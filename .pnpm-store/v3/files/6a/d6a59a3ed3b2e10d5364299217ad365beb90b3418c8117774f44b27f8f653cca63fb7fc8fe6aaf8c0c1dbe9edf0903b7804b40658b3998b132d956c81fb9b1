"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const end_of_stream_1 = __importDefault(require("end-of-stream"));
function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        stream.on('data', buffers.push.bind(buffers));
        end_of_stream_1.default(stream, err => {
            if (err) {
                reject(err);
                return;
            }
            switch (buffers.length) {
                case 0:
                    resolve(Buffer.allocUnsafe(0));
                    break;
                case 1:
                    resolve(buffers[0]);
                    break;
                default:
                    resolve(Buffer.concat(buffers));
            }
        });
    });
}
exports.default = streamToBuffer;
