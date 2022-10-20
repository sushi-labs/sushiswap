import { __awaiter, __generator } from "tslib";
import Semaphore from './Semaphore';
var Mutex = /** @class */ (function () {
    function Mutex() {
        this._semaphore = new Semaphore(1);
    }
    Mutex.prototype.acquire = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, releaser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._semaphore.acquire()];
                    case 1:
                        _a = _b.sent(), releaser = _a[1];
                        return [2 /*return*/, releaser];
                }
            });
        });
    };
    Mutex.prototype.runExclusive = function (callback) {
        return this._semaphore.runExclusive(function () { return callback(); });
    };
    Mutex.prototype.isLocked = function () {
        return this._semaphore.isLocked();
    };
    Mutex.prototype.release = function () {
        this._semaphore.release();
    };
    return Mutex;
}());
export default Mutex;
