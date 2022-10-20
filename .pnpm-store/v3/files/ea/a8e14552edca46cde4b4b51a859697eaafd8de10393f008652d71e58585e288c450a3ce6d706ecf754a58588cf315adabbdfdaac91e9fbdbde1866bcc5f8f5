import { __awaiter, __generator } from "tslib";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function withTimeout(sync, timeout, timeoutError) {
    var _this = this;
    if (timeoutError === void 0) { timeoutError = new Error('timeout'); }
    return {
        acquire: function () {
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var isTimeout, ticket, release;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isTimeout = false;
                            setTimeout(function () {
                                isTimeout = true;
                                reject(timeoutError);
                            }, timeout);
                            return [4 /*yield*/, sync.acquire()];
                        case 1:
                            ticket = _a.sent();
                            if (isTimeout) {
                                release = Array.isArray(ticket) ? ticket[1] : ticket;
                                release();
                            }
                            else {
                                resolve(ticket);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        },
        runExclusive: function (callback) {
            return __awaiter(this, void 0, void 0, function () {
                var release, ticket;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            release = function () { return undefined; };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 7, 8]);
                            return [4 /*yield*/, this.acquire()];
                        case 2:
                            ticket = _a.sent();
                            if (!Array.isArray(ticket)) return [3 /*break*/, 4];
                            release = ticket[1];
                            return [4 /*yield*/, callback(ticket[0])];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            release = ticket;
                            return [4 /*yield*/, callback()];
                        case 5: return [2 /*return*/, _a.sent()];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            release();
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        release: function () {
            sync.release();
        },
        isLocked: function () { return sync.isLocked(); },
    };
}
