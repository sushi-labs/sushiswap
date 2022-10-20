"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderlyApiService = void 0;
const axios = __importStar(require("axios"));
const fs_1 = __importDefault(require("fs"));
const plugins_1 = require("hardhat/plugins");
const yaml = __importStar(require("js-yaml"));
const os_1 = require("os");
const path_1 = require("path");
const index_1 = require("../index");
const TenderlyService_1 = require("./TenderlyService");
class TenderlyApiService {
    static configureInstance() {
        const yamlData = this.getTenderlyConfig();
        return axios.default.create({
            baseURL: TenderlyService_1.TENDERLY_API_BASE_URL,
            headers: { "x-access-key": yamlData.access_key }
        });
    }
    static configureTenderlyRPCInstance() {
        const yamlData = this.getTenderlyConfig();
        return axios.default.create({
            baseURL: TenderlyService_1.TENDERLY_RPC_BASE,
            headers: {
                "x-access-key": yamlData.access_key,
                Head: yamlData.head !== undefined ? yamlData.head : ""
            }
        });
    }
    static configureAnonymousInstance() {
        return axios.default.create({
            baseURL: TenderlyService_1.TENDERLY_API_BASE_URL
        });
    }
    static isAuthenticated() {
        try {
            this.getTenderlyConfig();
            return true;
        }
        catch (e) {
            return false;
        }
    }
    static getTenderlyConfig() {
        const filepath = (0, os_1.homedir)() + path_1.sep + ".tenderly" + path_1.sep + "config.yaml";
        const fileData = fs_1.default.readFileSync(filepath);
        const yamlData = yaml.load(fileData.toString());
        if (yamlData.access_key == null) {
            throw new plugins_1.HardhatPluginError(index_1.PluginName, `Access token not provided at filepath ${filepath}.\n` +
                `You can find the token at ${TenderlyService_1.TENDERLY_DASHBOARD_BASE_URL}/account/authorization`);
        }
        return yamlData;
    }
}
exports.TenderlyApiService = TenderlyApiService;
//# sourceMappingURL=TenderlyApiService.js.map