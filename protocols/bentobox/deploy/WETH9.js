"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const deployFunction = function ({ deployments, ethers, getNamedAccounts, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deploy } = deployments;
        const { deployer } = yield getNamedAccounts();
        yield deploy('WETH9Mock', {
            from: deployer,
            deterministicDeployment: false,
        });
        const weth9 = yield ethers.getContract('WETH9Mock');
        yield weth9.deposit({ value: 100 });
    });
};
exports.default = deployFunction;
deployFunction.tags = ['WETH9'];
deployFunction.skip = ({ getChainId }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chainId = yield getChainId();
        resolve(chainId !== '31337');
    }
    catch (error) {
        reject(error);
    }
}));
