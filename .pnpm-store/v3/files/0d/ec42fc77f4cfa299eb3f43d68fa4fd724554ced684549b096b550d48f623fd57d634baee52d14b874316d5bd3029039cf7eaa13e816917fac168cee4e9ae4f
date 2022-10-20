"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const multistream_1 = __importDefault(require("multistream"));
const path_1 = __importDefault(require("path"));
const async_sema_1 = __importDefault(require("async-sema"));
const semaToPreventEMFILE = new async_sema_1.default(20);
class FileFsRef {
    constructor({ mode = 0o100644, contentType, fsPath }) {
        assert_1.default(typeof mode === 'number');
        assert_1.default(typeof fsPath === 'string');
        this.type = 'FileFsRef';
        this.mode = mode;
        this.contentType = contentType;
        this.fsPath = fsPath;
    }
    static async fromFsPath({ mode, contentType, fsPath, }) {
        let m = mode;
        if (!m) {
            const stat = await fs_extra_1.default.lstat(fsPath);
            m = stat.mode;
        }
        return new FileFsRef({ mode: m, contentType, fsPath });
    }
    static async fromStream({ mode = 0o100644, contentType, stream, fsPath, }) {
        assert_1.default(typeof mode === 'number');
        assert_1.default(typeof stream.pipe === 'function'); // is-stream
        assert_1.default(typeof fsPath === 'string');
        await fs_extra_1.default.mkdirp(path_1.default.dirname(fsPath));
        await new Promise((resolve, reject) => {
            const dest = fs_extra_1.default.createWriteStream(fsPath, {
                mode: mode & 0o777,
            });
            stream.pipe(dest);
            stream.on('error', reject);
            dest.on('finish', resolve);
            dest.on('error', reject);
        });
        return new FileFsRef({ mode, contentType, fsPath });
    }
    async toStreamAsync() {
        await semaToPreventEMFILE.acquire();
        const release = () => semaToPreventEMFILE.release();
        const stream = fs_extra_1.default.createReadStream(this.fsPath);
        stream.on('close', release);
        stream.on('error', release);
        return stream;
    }
    toStream() {
        let flag = false;
        // eslint-disable-next-line consistent-return
        return multistream_1.default(cb => {
            if (flag)
                return cb(null, null);
            flag = true;
            this.toStreamAsync()
                .then(stream => {
                cb(null, stream);
            })
                .catch(error => {
                cb(error, null);
            });
        });
    }
}
exports.default = FileFsRef;
