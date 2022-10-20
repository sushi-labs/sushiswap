"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const multistream_1 = __importDefault(require("multistream"));
const async_retry_1 = __importDefault(require("async-retry"));
const async_sema_1 = __importDefault(require("async-sema"));
const semaToDownloadFromS3 = new async_sema_1.default(5);
class BailableError extends Error {
    constructor(...args) {
        super(...args);
        this.bail = false;
    }
}
class FileRef {
    constructor({ mode = 0o100644, digest, contentType, mutable = false, }) {
        assert_1.default(typeof mode === 'number');
        assert_1.default(typeof digest === 'string');
        this.type = 'FileRef';
        this.mode = mode;
        this.digest = digest;
        this.contentType = contentType;
        this.mutable = mutable;
    }
    async toStreamAsync() {
        let url = '';
        // sha:24be087eef9fac01d61b30a725c1a10d7b45a256
        const [digestType, digestHash] = this.digest.split(':');
        if (digestType === 'sha') {
            // This CloudFront URL edge caches the `now-files` S3 bucket to prevent
            // overloading it. Mutable files cannot be cached.
            // `https://now-files.s3.amazonaws.com/${digestHash}`
            url = this.mutable
                ? `https://now-files.s3.amazonaws.com/${digestHash}`
                : `https://dmmcy0pwk6bqi.cloudfront.net/${digestHash}`;
        }
        else if (digestType === 'sha+ephemeral') {
            // This URL is currently only used for cache files that constantly
            // change. We shouldn't cache it on CloudFront because it'd always be a
            // MISS.
            url = `https://now-ephemeral-files.s3.amazonaws.com/${digestHash}`;
        }
        else {
            throw new Error('Expected digest to be sha');
        }
        await semaToDownloadFromS3.acquire();
        // console.time(`downloading ${url}`);
        try {
            return await async_retry_1.default(async () => {
                const resp = await node_fetch_1.default(url);
                if (!resp.ok) {
                    const error = new BailableError(`download: ${resp.status} ${resp.statusText} for ${url}`);
                    if (resp.status === 403)
                        error.bail = true;
                    throw error;
                }
                return resp.body;
            }, { factor: 1, retries: 3 });
        }
        finally {
            // console.timeEnd(`downloading ${url}`);
            semaToDownloadFromS3.release();
        }
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
exports.default = FileRef;
