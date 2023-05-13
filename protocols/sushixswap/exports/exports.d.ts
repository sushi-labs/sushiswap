import type { NumberStringToNumber } from "@sushiswap/types";
export declare const sushiXSwapExports: {
    readonly "1": {
        readonly address: "0x011E52E4E40CF9498c79273329E8827b21E2e581";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "_bentoBox";
                readonly type: "address";
            }, {
                readonly internalType: "contract IStargateRouter";
                readonly name: "_stargateRouter";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "_factory";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "_pairCodeHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "contract IStargateWidget";
                readonly name: "_stargateWidget";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [];
            readonly name: "NotStargateRouter";
            readonly type: "error";
        }, {
            readonly inputs: readonly [];
            readonly name: "TooLittleReceived";
            readonly type: "error";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }, {
                readonly indexed: false;
                readonly internalType: "bool";
                readonly name: "failed";
                readonly type: "bool";
            }];
            readonly name: "StargateSushiXSwapDst";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }];
            readonly name: "StargateSushiXSwapSrc";
            readonly type: "event";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "token";
                readonly type: "address";
            }];
            readonly name: "approveToStargateRouter";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint8[]";
                readonly name: "actions";
                readonly type: "uint8[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "values";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "datas";
                readonly type: "bytes[]";
            }];
            readonly name: "cook";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "factory";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "_dstChainId";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "_functionType";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "_receiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "_gas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "_dustAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "_payload";
                readonly type: "bytes";
            }];
            readonly name: "getFee";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "a";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "b";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pairCodeHash";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "";
                readonly type: "uint16";
            }, {
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "_token";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountLD";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "payload";
                readonly type: "bytes";
            }];
            readonly name: "sgReceive";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateRouter";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateRouter";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateWidget";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateWidget";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly stateMutability: "payable";
            readonly type: "receive";
        }];
    };
    readonly "10": {
        readonly address: "0x8B396ddF906D552b2F98a8E7d743DD58Cd0d920f";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "_bentoBox";
                readonly type: "address";
            }, {
                readonly internalType: "contract IStargateRouter";
                readonly name: "_stargateRouter";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "_factory";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "_pairCodeHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "contract IStargateWidget";
                readonly name: "_stargateWidget";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [];
            readonly name: "NotStargateRouter";
            readonly type: "error";
        }, {
            readonly inputs: readonly [];
            readonly name: "TooLittleReceived";
            readonly type: "error";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }, {
                readonly indexed: false;
                readonly internalType: "bool";
                readonly name: "failed";
                readonly type: "bool";
            }];
            readonly name: "StargateSushiXSwapDst";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }];
            readonly name: "StargateSushiXSwapSrc";
            readonly type: "event";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "token";
                readonly type: "address";
            }];
            readonly name: "approveToStargateRouter";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint8[]";
                readonly name: "actions";
                readonly type: "uint8[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "values";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "datas";
                readonly type: "bytes[]";
            }];
            readonly name: "cook";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "factory";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "_dstChainId";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "_functionType";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "_receiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "_gas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "_dustAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "_payload";
                readonly type: "bytes";
            }];
            readonly name: "getFee";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "a";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "b";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pairCodeHash";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "";
                readonly type: "uint16";
            }, {
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "_token";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountLD";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "payload";
                readonly type: "bytes";
            }];
            readonly name: "sgReceive";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateRouter";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateRouter";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateWidget";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateWidget";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly stateMutability: "payable";
            readonly type: "receive";
        }];
    };
    readonly "56": {
        readonly address: "0x7A4af156379f512DE147ed3b96393047226d923F";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "_bentoBox";
                readonly type: "address";
            }, {
                readonly internalType: "contract IStargateRouter";
                readonly name: "_stargateRouter";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "_factory";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "_pairCodeHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "contract IStargateWidget";
                readonly name: "_stargateWidget";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [];
            readonly name: "NotStargateRouter";
            readonly type: "error";
        }, {
            readonly inputs: readonly [];
            readonly name: "TooLittleReceived";
            readonly type: "error";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }, {
                readonly indexed: false;
                readonly internalType: "bool";
                readonly name: "failed";
                readonly type: "bool";
            }];
            readonly name: "StargateSushiXSwapDst";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }];
            readonly name: "StargateSushiXSwapSrc";
            readonly type: "event";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "token";
                readonly type: "address";
            }];
            readonly name: "approveToStargateRouter";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint8[]";
                readonly name: "actions";
                readonly type: "uint8[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "values";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "datas";
                readonly type: "bytes[]";
            }];
            readonly name: "cook";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "factory";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "_dstChainId";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "_functionType";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "_receiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "_gas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "_dustAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "_payload";
                readonly type: "bytes";
            }];
            readonly name: "getFee";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "a";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "b";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pairCodeHash";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "";
                readonly type: "uint16";
            }, {
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "_token";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountLD";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "payload";
                readonly type: "bytes";
            }];
            readonly name: "sgReceive";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateRouter";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateRouter";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateWidget";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateWidget";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly stateMutability: "payable";
            readonly type: "receive";
        }];
    };
    readonly "137": {
        readonly address: "0xd08b5f3e89F1e2d6b067e0A0cbdb094e6e41E77c";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "_bentoBox";
                readonly type: "address";
            }, {
                readonly internalType: "contract IStargateRouter";
                readonly name: "_stargateRouter";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "_factory";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "_pairCodeHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "contract IStargateWidget";
                readonly name: "_stargateWidget";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [];
            readonly name: "NotStargateRouter";
            readonly type: "error";
        }, {
            readonly inputs: readonly [];
            readonly name: "TooLittleReceived";
            readonly type: "error";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }, {
                readonly indexed: false;
                readonly internalType: "bool";
                readonly name: "failed";
                readonly type: "bool";
            }];
            readonly name: "StargateSushiXSwapDst";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }];
            readonly name: "StargateSushiXSwapSrc";
            readonly type: "event";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "token";
                readonly type: "address";
            }];
            readonly name: "approveToStargateRouter";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint8[]";
                readonly name: "actions";
                readonly type: "uint8[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "values";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "datas";
                readonly type: "bytes[]";
            }];
            readonly name: "cook";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "factory";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "_dstChainId";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "_functionType";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "_receiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "_gas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "_dustAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "_payload";
                readonly type: "bytes";
            }];
            readonly name: "getFee";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "a";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "b";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pairCodeHash";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "";
                readonly type: "uint16";
            }, {
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "_token";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountLD";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "payload";
                readonly type: "bytes";
            }];
            readonly name: "sgReceive";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateRouter";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateRouter";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateWidget";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateWidget";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly stateMutability: "payable";
            readonly type: "receive";
        }];
    };
    readonly "250": {
        readonly address: "0xD045d27c1f7e7f770a807B0a85d8e3F852e0F2BE";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "_bentoBox";
                readonly type: "address";
            }, {
                readonly internalType: "contract IStargateRouter";
                readonly name: "_stargateRouter";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "_factory";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "_pairCodeHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "contract IStargateWidget";
                readonly name: "_stargateWidget";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [];
            readonly name: "NotStargateRouter";
            readonly type: "error";
        }, {
            readonly inputs: readonly [];
            readonly name: "TooLittleReceived";
            readonly type: "error";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }, {
                readonly indexed: false;
                readonly internalType: "bool";
                readonly name: "failed";
                readonly type: "bool";
            }];
            readonly name: "StargateSushiXSwapDst";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }];
            readonly name: "StargateSushiXSwapSrc";
            readonly type: "event";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "token";
                readonly type: "address";
            }];
            readonly name: "approveToStargateRouter";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint8[]";
                readonly name: "actions";
                readonly type: "uint8[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "values";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "datas";
                readonly type: "bytes[]";
            }];
            readonly name: "cook";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "factory";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "_dstChainId";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "_functionType";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "_receiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "_gas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "_dustAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "_payload";
                readonly type: "bytes";
            }];
            readonly name: "getFee";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "a";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "b";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pairCodeHash";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "";
                readonly type: "uint16";
            }, {
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "_token";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountLD";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "payload";
                readonly type: "bytes";
            }];
            readonly name: "sgReceive";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateRouter";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateRouter";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateWidget";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateWidget";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly stateMutability: "payable";
            readonly type: "receive";
        }];
    };
    readonly "42161": {
        readonly address: "0x53b08DbD70327b7Ba3B7886Fc9987BC985d27262";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "_bentoBox";
                readonly type: "address";
            }, {
                readonly internalType: "contract IStargateRouter";
                readonly name: "_stargateRouter";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "_factory";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "_pairCodeHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "contract IStargateWidget";
                readonly name: "_stargateWidget";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [];
            readonly name: "NotStargateRouter";
            readonly type: "error";
        }, {
            readonly inputs: readonly [];
            readonly name: "TooLittleReceived";
            readonly type: "error";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }, {
                readonly indexed: false;
                readonly internalType: "bool";
                readonly name: "failed";
                readonly type: "bool";
            }];
            readonly name: "StargateSushiXSwapDst";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }];
            readonly name: "StargateSushiXSwapSrc";
            readonly type: "event";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "token";
                readonly type: "address";
            }];
            readonly name: "approveToStargateRouter";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint8[]";
                readonly name: "actions";
                readonly type: "uint8[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "values";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "datas";
                readonly type: "bytes[]";
            }];
            readonly name: "cook";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "factory";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "_dstChainId";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "_functionType";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "_receiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "_gas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "_dustAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "_payload";
                readonly type: "bytes";
            }];
            readonly name: "getFee";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "a";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "b";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pairCodeHash";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "";
                readonly type: "uint16";
            }, {
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "_token";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountLD";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "payload";
                readonly type: "bytes";
            }];
            readonly name: "sgReceive";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateRouter";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateRouter";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateWidget";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateWidget";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly stateMutability: "payable";
            readonly type: "receive";
        }];
    };
    readonly "43114": {
        readonly address: "0x2c8C987C4777AB740d20Cb581f5d381BE95A4A4a";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "_bentoBox";
                readonly type: "address";
            }, {
                readonly internalType: "contract IStargateRouter";
                readonly name: "_stargateRouter";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "_factory";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "_pairCodeHash";
                readonly type: "bytes32";
            }, {
                readonly internalType: "contract IStargateWidget";
                readonly name: "_stargateWidget";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly inputs: readonly [];
            readonly name: "NotStargateRouter";
            readonly type: "error";
        }, {
            readonly inputs: readonly [];
            readonly name: "TooLittleReceived";
            readonly type: "error";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }, {
                readonly indexed: false;
                readonly internalType: "bool";
                readonly name: "failed";
                readonly type: "bool";
            }];
            readonly name: "StargateSushiXSwapDst";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "bytes32";
                readonly name: "srcContext";
                readonly type: "bytes32";
            }];
            readonly name: "StargateSushiXSwapSrc";
            readonly type: "event";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "token";
                readonly type: "address";
            }];
            readonly name: "approveToStargateRouter";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxMinimal";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint8[]";
                readonly name: "actions";
                readonly type: "uint8[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "values";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "datas";
                readonly type: "bytes[]";
            }];
            readonly name: "cook";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "factory";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "_dstChainId";
                readonly type: "uint16";
            }, {
                readonly internalType: "uint8";
                readonly name: "_functionType";
                readonly type: "uint8";
            }, {
                readonly internalType: "address";
                readonly name: "_receiver";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "_gas";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "_dustAmount";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "_payload";
                readonly type: "bytes";
            }];
            readonly name: "getFee";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "a";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "b";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pairCodeHash";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "uint16";
                readonly name: "";
                readonly type: "uint16";
            }, {
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }, {
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }, {
                readonly internalType: "address";
                readonly name: "_token";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amountLD";
                readonly type: "uint256";
            }, {
                readonly internalType: "bytes";
                readonly name: "payload";
                readonly type: "bytes";
            }];
            readonly name: "sgReceive";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateRouter";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateRouter";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "stargateWidget";
            readonly outputs: readonly [{
                readonly internalType: "contract IStargateWidget";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly stateMutability: "payable";
            readonly type: "receive";
        }];
    };
};
export type SushiXSwapExports = typeof sushiXSwapExports;
export type SushiXSwapChainId = NumberStringToNumber<keyof SushiXSwapExports>;
export declare const isSushiXSwapChainId: (chainId: number) => chainId is SushiXSwapChainId;
export declare const sushiXSwapAddress: {
    readonly "1": "0x011E52E4E40CF9498c79273329E8827b21E2e581";
    readonly "10": "0x8B396ddF906D552b2F98a8E7d743DD58Cd0d920f";
    readonly "56": "0x7A4af156379f512DE147ed3b96393047226d923F";
    readonly "137": "0xd08b5f3e89F1e2d6b067e0A0cbdb094e6e41E77c";
    readonly "250": "0xD045d27c1f7e7f770a807B0a85d8e3F852e0F2BE";
    readonly "42161": "0x53b08DbD70327b7Ba3B7886Fc9987BC985d27262";
    readonly "43114": "0x2c8C987C4777AB740d20Cb581f5d381BE95A4A4a";
};
export declare const sushiXSwapAbi: {
    readonly "1": readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "_bentoBox";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStargateRouter";
            readonly name: "_stargateRouter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_pairCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "contract IStargateWidget";
            readonly name: "_stargateWidget";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotStargateRouter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "TooLittleReceived";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "failed";
            readonly type: "bool";
        }];
        readonly name: "StargateSushiXSwapDst";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }];
        readonly name: "StargateSushiXSwapSrc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "approveToStargateRouter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8[]";
            readonly name: "actions";
            readonly type: "uint8[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "datas";
            readonly type: "bytes[]";
        }];
        readonly name: "cook";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "_functionType";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_dustAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "a";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "b";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pairCodeHash";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountLD";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly name: "sgReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateRouter";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateRouter";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateWidget";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateWidget";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    readonly "10": readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "_bentoBox";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStargateRouter";
            readonly name: "_stargateRouter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_pairCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "contract IStargateWidget";
            readonly name: "_stargateWidget";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotStargateRouter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "TooLittleReceived";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "failed";
            readonly type: "bool";
        }];
        readonly name: "StargateSushiXSwapDst";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }];
        readonly name: "StargateSushiXSwapSrc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "approveToStargateRouter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8[]";
            readonly name: "actions";
            readonly type: "uint8[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "datas";
            readonly type: "bytes[]";
        }];
        readonly name: "cook";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "_functionType";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_dustAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "a";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "b";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pairCodeHash";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountLD";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly name: "sgReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateRouter";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateRouter";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateWidget";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateWidget";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    readonly "56": readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "_bentoBox";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStargateRouter";
            readonly name: "_stargateRouter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_pairCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "contract IStargateWidget";
            readonly name: "_stargateWidget";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotStargateRouter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "TooLittleReceived";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "failed";
            readonly type: "bool";
        }];
        readonly name: "StargateSushiXSwapDst";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }];
        readonly name: "StargateSushiXSwapSrc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "approveToStargateRouter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8[]";
            readonly name: "actions";
            readonly type: "uint8[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "datas";
            readonly type: "bytes[]";
        }];
        readonly name: "cook";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "_functionType";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_dustAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "a";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "b";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pairCodeHash";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountLD";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly name: "sgReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateRouter";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateRouter";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateWidget";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateWidget";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    readonly "137": readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "_bentoBox";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStargateRouter";
            readonly name: "_stargateRouter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_pairCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "contract IStargateWidget";
            readonly name: "_stargateWidget";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotStargateRouter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "TooLittleReceived";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "failed";
            readonly type: "bool";
        }];
        readonly name: "StargateSushiXSwapDst";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }];
        readonly name: "StargateSushiXSwapSrc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "approveToStargateRouter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8[]";
            readonly name: "actions";
            readonly type: "uint8[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "datas";
            readonly type: "bytes[]";
        }];
        readonly name: "cook";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "_functionType";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_dustAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "a";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "b";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pairCodeHash";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountLD";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly name: "sgReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateRouter";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateRouter";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateWidget";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateWidget";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    readonly "250": readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "_bentoBox";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStargateRouter";
            readonly name: "_stargateRouter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_pairCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "contract IStargateWidget";
            readonly name: "_stargateWidget";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotStargateRouter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "TooLittleReceived";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "failed";
            readonly type: "bool";
        }];
        readonly name: "StargateSushiXSwapDst";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }];
        readonly name: "StargateSushiXSwapSrc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "approveToStargateRouter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8[]";
            readonly name: "actions";
            readonly type: "uint8[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "datas";
            readonly type: "bytes[]";
        }];
        readonly name: "cook";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "_functionType";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_dustAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "a";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "b";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pairCodeHash";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountLD";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly name: "sgReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateRouter";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateRouter";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateWidget";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateWidget";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    readonly "42161": readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "_bentoBox";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStargateRouter";
            readonly name: "_stargateRouter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_pairCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "contract IStargateWidget";
            readonly name: "_stargateWidget";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotStargateRouter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "TooLittleReceived";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "failed";
            readonly type: "bool";
        }];
        readonly name: "StargateSushiXSwapDst";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }];
        readonly name: "StargateSushiXSwapSrc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "approveToStargateRouter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8[]";
            readonly name: "actions";
            readonly type: "uint8[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "datas";
            readonly type: "bytes[]";
        }];
        readonly name: "cook";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "_functionType";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_dustAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "a";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "b";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pairCodeHash";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountLD";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly name: "sgReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateRouter";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateRouter";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateWidget";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateWidget";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    readonly "43114": readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "_bentoBox";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStargateRouter";
            readonly name: "_stargateRouter";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_pairCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "contract IStargateWidget";
            readonly name: "_stargateWidget";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "NotStargateRouter";
        readonly type: "error";
    }, {
        readonly inputs: readonly [];
        readonly name: "TooLittleReceived";
        readonly type: "error";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }, {
            readonly indexed: false;
            readonly internalType: "bool";
            readonly name: "failed";
            readonly type: "bool";
        }];
        readonly name: "StargateSushiXSwapDst";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "bytes32";
            readonly name: "srcContext";
            readonly type: "bytes32";
        }];
        readonly name: "StargateSushiXSwapSrc";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "approveToStargateRouter";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxMinimal";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint8[]";
            readonly name: "actions";
            readonly type: "uint8[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "values";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "bytes[]";
            readonly name: "datas";
            readonly type: "bytes[]";
        }];
        readonly name: "cook";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "_dstChainId";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint8";
            readonly name: "_functionType";
            readonly type: "uint8";
        }, {
            readonly internalType: "address";
            readonly name: "_receiver";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_gas";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_dustAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_payload";
            readonly type: "bytes";
        }];
        readonly name: "getFee";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "a";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "b";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pairCodeHash";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amountLD";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "payload";
            readonly type: "bytes";
        }];
        readonly name: "sgReceive";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateRouter";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateRouter";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "stargateWidget";
        readonly outputs: readonly [{
            readonly internalType: "contract IStargateWidget";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
};
export declare const sushiXSwapChainIds: SushiXSwapChainId[];
