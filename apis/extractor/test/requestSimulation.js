"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
var TestMode;
(function (TestMode) {
    TestMode[TestMode["KNOWN_TOKENS"] = 0] = "KNOWN_TOKENS";
    TestMode[TestMode["ONE_UNKNOWN_TOKEN"] = 1] = "ONE_UNKNOWN_TOKEN";
    TestMode[TestMode["BOTH_UNKNOWN_TOKENS"] = 2] = "BOTH_UNKNOWN_TOKENS";
})(TestMode || (TestMode = {}));
const TEST_MODE = TestMode.KNOWN_TOKENS;
const REQUEST_PER_SEC = 150;
const SWAP_AMOUNT = 10;
const CACHE_DIR = '../cache';
const TOKEN_FILES_PREFIX = 'tokens-';
// const SERVER_ADDRESS = 'http://localhost:1337'
const SERVER_ADDRESS = 'https://swap2.sushi.com';
const USER_ADDRESS = '0xBa8656A5D95087ab4d015f1B68D72cD246FcC6C3'; // random address with no contract
const MS_PER_REQUEST = Math.round(1000 / REQUEST_PER_SEC);
const delay = async (ms) => new Promise((res) => setTimeout(res, ms));
function loadAllTokens() {
    const res = {};
    const fullDirName = path_1.default.resolve(__dirname, CACHE_DIR);
    fs_1.default.readdirSync(fullDirName).forEach((fileName) => {
        if (!fileName.startsWith(TOKEN_FILES_PREFIX))
            return;
        const fullFileName = path_1.default.resolve(fullDirName, fileName);
        const chainId = parseInt(fileName.substring(TOKEN_FILES_PREFIX.length));
        const file = fs_1.default.readFileSync(fullFileName, 'utf8');
        res[chainId] = file
            .split('\n')
            .map((s) => (s === '' ? undefined : JSON.parse(s)))
            .filter((t) => t !== undefined);
        res[chainId].unshift({
            address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
            name: 'Native',
            symbol: 'Native',
            decimals: 18,
        });
    });
    return res;
}
function getRandomNetwork(totalTokens, tokenNumber) {
    const num = Math.floor(Math.random() * totalTokens);
    let total = 0;
    for (let i = 0; i < tokenNumber.length; ++i) {
        total += tokenNumber[i][1];
        if (total >= num)
            return tokenNumber[i][0];
    }
    console.assert(false, 'Should not be reached');
    return 0;
}
// Arbitrary 2 tokens
function getRandomPair1(num) {
    const first = Math.floor(Math.random() * num);
    let second = Math.floor(Math.random() * (num - 1));
    if (second >= first)
        ++second;
    return [first, second];
}
// arbitrary token against arbitrary first 5 tokens
function getRandomPair2(num) {
    const best = Math.min(num - 1, 6);
    const first = Math.floor(Math.random() * best);
    let second = Math.floor(Math.random() * (num - 1));
    if (second >= first)
        ++second;
    return Math.random() < 0.5 ? [first, second] : [second, first];
}
function getRandomPair3(num) {
    const best = Math.min(num - 1, 6);
    const first = Math.floor(Math.random() * best);
    let second = Math.floor(Math.random() * (best - 1));
    if (second >= first)
        ++second;
    return Math.random() < 0.5 ? [first, second] : [second, first];
}
function getRandomPair(num, mode) {
    const func = mode === TestMode.KNOWN_TOKENS
        ? getRandomPair3
        : mode === TestMode.ONE_UNKNOWN_TOKEN
            ? getRandomPair2
            : getRandomPair1;
    return func(num);
}
let success = 0;
let successTime = 0;
let failed = 0;
let failedTime = 0;
async function makeRequest(chainId, from, amount, to, recipient) {
    const startTime = performance.now();
    const requestUrl = `${SERVER_ADDRESS}/?chainId=${chainId}` +
        `&tokenIn=${from.address}&tokenOut=${to.address}&amount=${amount}&to=${recipient}`;
    let res = 'Failed';
    try {
        const resp = await fetch(requestUrl);
        if (resp.status === 200) {
            const json = (await resp.json());
            const respObj = JSON.parse(json);
            res = respObj.route?.status ?? respObj.status;
        }
        else
            throw new Error(resp.status.toString());
    }
    catch (e) {
        const timing = performance.now() - startTime;
        ++failed;
        failedTime += timing;
        console.log('Failed request:', 
        //requestUrl,
        `${Math.round((failed / (failed + success)) * 100)}%`, `${success > 0 ? Math.round(successTime / success) : 0}ms`, `${failed > 0 ? Math.round(failedTime / failed) : 0}ms`, e.message);
        //return 'Failed'
    }
    const timing = performance.now() - startTime;
    ++success;
    successTime += timing;
    console.log(`Request: ${chainId} 1e${from.decimals + 1} ${from.symbol}->${to.symbol} ${res} ${Math.round(timing)}ms ()`, `${Math.round((success / (failed + success)) * 100)}%`, `${success > 0 ? Math.round(successTime / success) : 0}ms`, `${failed > 0 ? Math.round(failedTime / failed) : 0}ms`);
}
async function simulate() {
    const tokens = loadAllTokens();
    const tokenNumber = Object.entries(tokens).map(([id, tokens]) => [Number(id), tokens.length]);
    const totalTokens = tokenNumber.reduce((a, b) => a + b[1], 0);
    for (;;) {
        const delayPromise = delay(MS_PER_REQUEST);
        const chainId = getRandomNetwork(totalTokens, tokenNumber);
        const chainTokens = tokens[chainId];
        const [from, to] = getRandomPair(chainTokens.length, TEST_MODE);
        const amount = BigInt(SWAP_AMOUNT * 10 ** chainTokens[from].decimals);
        // const startTime = performance.now()
        // const res = await
        makeRequest(chainId, chainTokens[from], amount, chainTokens[to], USER_ADDRESS);
        // const timing = performance.now() - startTime
        // console.log(
        //   `Request: ${chainId} 1e${chainTokens[from].decimals + 1} ${
        //     chainTokens[from].symbol
        //   }->${chainTokens[to].symbol} ${res} ${Math.round(timing)}ms`,
        // )
        await delayPromise;
    }
}
simulate();
