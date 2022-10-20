"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const into_stream_1 = __importDefault(require("into-stream"));
class FileBlob {
    constructor({ mode = 0o100644, contentType, data }) {
        assert_1.default(typeof mode === 'number');
        assert_1.default(typeof data === 'string' || Buffer.isBuffer(data));
        this.type = 'FileBlob';
        this.mode = mode;
        this.contentType = contentType;
        this.data = data;
    }
    static async fromStream({ mode = 0o100644, contentType, stream, }) {
        assert_1.default(typeof mode === 'number');
        assert_1.default(typeof stream.pipe === 'function'); // is-stream
        const chunks = [];
        await new Promise((resolve, reject) => {
            stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
            stream.on('error', error => reject(error));
            stream.on('end', () => resolve());
        });
        const data = Buffer.concat(chunks);
        return new FileBlob({ mode, contentType, data });
    }
    async toStreamAsync() {
        return this.toStream();
    }
    toStream() {
        return into_stream_1.default(this.data);
    }
}
exports.default = FileBlob;
