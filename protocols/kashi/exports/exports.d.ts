import type { NumberStringToNumber } from "@sushiswap/types";
export declare const kashiPairMediumRiskV1Exports: {
    readonly "1": {
        readonly name: "ethereum";
        readonly chainId: "1";
        readonly contracts: {
            readonly KashiPairMediumRiskV1: {
                readonly address: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
                readonly abi: readonly [{
                    readonly inputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "bentoBox_";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "constructor";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_owner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_spender";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Approval";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "accruedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeFraction";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint64";
                        readonly name: "rate";
                        readonly type: "uint64";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "utilization";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAccrue";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogBorrow";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogExchangeRate";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "LogFeeTo";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRepay";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "feeTo";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogWithdrawFees";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "previousOwner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }];
                    readonly name: "OwnershipTransferred";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Transfer";
                    readonly type: "event";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "DOMAIN_SEPARATOR";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "";
                        readonly type: "bytes32";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrue";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrueInfo";
                    readonly outputs: readonly [{
                        readonly internalType: "uint64";
                        readonly name: "interestPerSecond";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAccrued";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "allowance";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "approve";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "asset";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "balanceOf";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "bentoBox";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "borrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "claimOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "collateral";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
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
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "value1";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value2";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "decimals";
                    readonly outputs: readonly [{
                        readonly internalType: "uint8";
                        readonly name: "";
                        readonly type: "uint8";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "exchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "feeTo";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "data";
                        readonly type: "bytes";
                    }];
                    readonly name: "init";
                    readonly outputs: readonly [];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address[]";
                        readonly name: "users";
                        readonly type: "address[]";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "maxBorrowParts";
                        readonly type: "uint256[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "open";
                        readonly type: "bool";
                    }];
                    readonly name: "liquidate";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "masterContract";
                    readonly outputs: readonly [{
                        readonly internalType: "contract KashiPairMediumRiskV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "name";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "nonces";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracle";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IOracle";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracleData";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "";
                        readonly type: "bytes";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "owner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "pendingOwner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner_";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint8";
                        readonly name: "v";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "r";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "s";
                        readonly type: "bytes32";
                    }];
                    readonly name: "permit";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "repay";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "setFeeTo";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "enable";
                        readonly type: "bool";
                    }];
                    readonly name: "setSwapper";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "swappers";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "symbol";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalBorrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalSupply";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transfer";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transferFrom";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "direct";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "renounce";
                        readonly type: "bool";
                    }];
                    readonly name: "transferOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "updateExchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "updated";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userBorrowPart";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "withdrawFees";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }];
            };
        };
        readonly address: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "bentoBox_";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_owner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_spender";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Approval";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "accruedAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeFraction";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint64";
                readonly name: "rate";
                readonly type: "uint64";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "utilization";
                readonly type: "uint256";
            }];
            readonly name: "LogAccrue";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogAddAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogAddCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogBorrow";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly name: "LogExchangeRate";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "LogFeeTo";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogRepay";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "feeTo";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feesEarnedFraction";
                readonly type: "uint256";
            }];
            readonly name: "LogWithdrawFees";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "previousOwner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }];
            readonly name: "OwnershipTransferred";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Transfer";
            readonly type: "event";
        }, {
            readonly inputs: readonly [];
            readonly name: "DOMAIN_SEPARATOR";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrue";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrueInfo";
            readonly outputs: readonly [{
                readonly internalType: "uint64";
                readonly name: "interestPerSecond";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastAccrued";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint128";
                readonly name: "feesEarnedFraction";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "allowance";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "approve";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "asset";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "balanceOf";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "borrow";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "claimOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "collateral";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
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
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "value1";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "value2";
                readonly type: "uint256";
            }];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [{
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "exchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "feeTo";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address[]";
                readonly name: "users";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "maxBorrowParts";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "open";
                readonly type: "bool";
            }];
            readonly name: "liquidate";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "masterContract";
            readonly outputs: readonly [{
                readonly internalType: "contract KashiPairMediumRiskV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "name";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "nonces";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracle";
            readonly outputs: readonly [{
                readonly internalType: "contract IOracle";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracleData";
            readonly outputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "owner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pendingOwner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "owner_";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }];
            readonly name: "permit";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "removeAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "removeCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "repay";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "setFeeTo";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "enable";
                readonly type: "bool";
            }];
            readonly name: "setSwapper";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "swappers";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalBorrow";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transfer";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transferFrom";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "direct";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "renounce";
                readonly type: "bool";
            }];
            readonly name: "transferOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "updateExchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "updated";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userBorrowPart";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "withdrawFees";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }];
    };
    readonly "56": {
        readonly name: "bsc";
        readonly chainId: "56";
        readonly contracts: {
            readonly KashiPairMediumRiskV1: {
                readonly address: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
                readonly abi: readonly [{
                    readonly inputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "bentoBox_";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "constructor";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_owner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_spender";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Approval";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "accruedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeFraction";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint64";
                        readonly name: "rate";
                        readonly type: "uint64";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "utilization";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAccrue";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogBorrow";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogExchangeRate";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "LogFeeTo";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRepay";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "feeTo";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogWithdrawFees";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "previousOwner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }];
                    readonly name: "OwnershipTransferred";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Transfer";
                    readonly type: "event";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "DOMAIN_SEPARATOR";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "";
                        readonly type: "bytes32";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrue";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrueInfo";
                    readonly outputs: readonly [{
                        readonly internalType: "uint64";
                        readonly name: "interestPerSecond";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAccrued";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "allowance";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "approve";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "asset";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "balanceOf";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "bentoBox";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "borrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "claimOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "collateral";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
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
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "value1";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value2";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "decimals";
                    readonly outputs: readonly [{
                        readonly internalType: "uint8";
                        readonly name: "";
                        readonly type: "uint8";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "exchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "feeTo";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "data";
                        readonly type: "bytes";
                    }];
                    readonly name: "init";
                    readonly outputs: readonly [];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address[]";
                        readonly name: "users";
                        readonly type: "address[]";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "maxBorrowParts";
                        readonly type: "uint256[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "open";
                        readonly type: "bool";
                    }];
                    readonly name: "liquidate";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "masterContract";
                    readonly outputs: readonly [{
                        readonly internalType: "contract KashiPairMediumRiskV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "name";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "nonces";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracle";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IOracle";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracleData";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "";
                        readonly type: "bytes";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "owner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "pendingOwner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner_";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint8";
                        readonly name: "v";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "r";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "s";
                        readonly type: "bytes32";
                    }];
                    readonly name: "permit";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "repay";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "setFeeTo";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "enable";
                        readonly type: "bool";
                    }];
                    readonly name: "setSwapper";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "swappers";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "symbol";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalBorrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalSupply";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transfer";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transferFrom";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "direct";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "renounce";
                        readonly type: "bool";
                    }];
                    readonly name: "transferOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "updateExchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "updated";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userBorrowPart";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "withdrawFees";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }];
            };
        };
        readonly address: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "bentoBox_";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_owner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_spender";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Approval";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "accruedAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeFraction";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint64";
                readonly name: "rate";
                readonly type: "uint64";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "utilization";
                readonly type: "uint256";
            }];
            readonly name: "LogAccrue";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogAddAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogAddCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogBorrow";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly name: "LogExchangeRate";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "LogFeeTo";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogRepay";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "feeTo";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feesEarnedFraction";
                readonly type: "uint256";
            }];
            readonly name: "LogWithdrawFees";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "previousOwner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }];
            readonly name: "OwnershipTransferred";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Transfer";
            readonly type: "event";
        }, {
            readonly inputs: readonly [];
            readonly name: "DOMAIN_SEPARATOR";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrue";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrueInfo";
            readonly outputs: readonly [{
                readonly internalType: "uint64";
                readonly name: "interestPerSecond";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastAccrued";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint128";
                readonly name: "feesEarnedFraction";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "allowance";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "approve";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "asset";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "balanceOf";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "borrow";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "claimOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "collateral";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
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
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "value1";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "value2";
                readonly type: "uint256";
            }];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [{
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "exchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "feeTo";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address[]";
                readonly name: "users";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "maxBorrowParts";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "open";
                readonly type: "bool";
            }];
            readonly name: "liquidate";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "masterContract";
            readonly outputs: readonly [{
                readonly internalType: "contract KashiPairMediumRiskV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "name";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "nonces";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracle";
            readonly outputs: readonly [{
                readonly internalType: "contract IOracle";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracleData";
            readonly outputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "owner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pendingOwner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "owner_";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }];
            readonly name: "permit";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "removeAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "removeCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "repay";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "setFeeTo";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "enable";
                readonly type: "bool";
            }];
            readonly name: "setSwapper";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "swappers";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalBorrow";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transfer";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transferFrom";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "direct";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "renounce";
                readonly type: "bool";
            }];
            readonly name: "transferOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "updateExchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "updated";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userBorrowPart";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "withdrawFees";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }];
    };
    readonly "100": {
        readonly name: "gnosis";
        readonly chainId: "100";
        readonly contracts: {
            readonly KashiPairMediumRiskV1: {
                readonly address: "0x7a6DA9903d0a481F40b8336c1463487BC8C0407e";
                readonly abi: readonly [{
                    readonly inputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "bentoBox_";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "constructor";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_owner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_spender";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Approval";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "accruedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeFraction";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint64";
                        readonly name: "rate";
                        readonly type: "uint64";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "utilization";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAccrue";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogBorrow";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogExchangeRate";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "LogFeeTo";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRepay";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "feeTo";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogWithdrawFees";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "previousOwner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }];
                    readonly name: "OwnershipTransferred";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Transfer";
                    readonly type: "event";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "DOMAIN_SEPARATOR";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "";
                        readonly type: "bytes32";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrue";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrueInfo";
                    readonly outputs: readonly [{
                        readonly internalType: "uint64";
                        readonly name: "interestPerSecond";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAccrued";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "allowance";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "approve";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "asset";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "balanceOf";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "bentoBox";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "borrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "claimOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "collateral";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
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
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "value1";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value2";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "decimals";
                    readonly outputs: readonly [{
                        readonly internalType: "uint8";
                        readonly name: "";
                        readonly type: "uint8";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "exchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "feeTo";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "data";
                        readonly type: "bytes";
                    }];
                    readonly name: "init";
                    readonly outputs: readonly [];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address[]";
                        readonly name: "users";
                        readonly type: "address[]";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "maxBorrowParts";
                        readonly type: "uint256[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "open";
                        readonly type: "bool";
                    }];
                    readonly name: "liquidate";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "masterContract";
                    readonly outputs: readonly [{
                        readonly internalType: "contract KashiPairMediumRiskV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "name";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "nonces";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracle";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IOracle";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracleData";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "";
                        readonly type: "bytes";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "owner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "pendingOwner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner_";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint8";
                        readonly name: "v";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "r";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "s";
                        readonly type: "bytes32";
                    }];
                    readonly name: "permit";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "repay";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "setFeeTo";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "enable";
                        readonly type: "bool";
                    }];
                    readonly name: "setSwapper";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "swappers";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "symbol";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalBorrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalSupply";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transfer";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transferFrom";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "direct";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "renounce";
                        readonly type: "bool";
                    }];
                    readonly name: "transferOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "updateExchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "updated";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userBorrowPart";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "withdrawFees";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }];
            };
        };
        readonly address: "0x7a6DA9903d0a481F40b8336c1463487BC8C0407e";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "bentoBox_";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_owner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_spender";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Approval";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "accruedAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeFraction";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint64";
                readonly name: "rate";
                readonly type: "uint64";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "utilization";
                readonly type: "uint256";
            }];
            readonly name: "LogAccrue";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogAddAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogAddCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogBorrow";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly name: "LogExchangeRate";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "LogFeeTo";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogRepay";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "feeTo";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feesEarnedFraction";
                readonly type: "uint256";
            }];
            readonly name: "LogWithdrawFees";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "previousOwner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }];
            readonly name: "OwnershipTransferred";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Transfer";
            readonly type: "event";
        }, {
            readonly inputs: readonly [];
            readonly name: "DOMAIN_SEPARATOR";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrue";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrueInfo";
            readonly outputs: readonly [{
                readonly internalType: "uint64";
                readonly name: "interestPerSecond";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastAccrued";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint128";
                readonly name: "feesEarnedFraction";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "allowance";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "approve";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "asset";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "balanceOf";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "borrow";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "claimOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "collateral";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
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
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "value1";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "value2";
                readonly type: "uint256";
            }];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [{
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "exchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "feeTo";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address[]";
                readonly name: "users";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "maxBorrowParts";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "open";
                readonly type: "bool";
            }];
            readonly name: "liquidate";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "masterContract";
            readonly outputs: readonly [{
                readonly internalType: "contract KashiPairMediumRiskV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "name";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "nonces";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracle";
            readonly outputs: readonly [{
                readonly internalType: "contract IOracle";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracleData";
            readonly outputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "owner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pendingOwner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "owner_";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }];
            readonly name: "permit";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "removeAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "removeCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "repay";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "setFeeTo";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "enable";
                readonly type: "bool";
            }];
            readonly name: "setSwapper";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "swappers";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalBorrow";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transfer";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transferFrom";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "direct";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "renounce";
                readonly type: "bool";
            }];
            readonly name: "transferOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "updateExchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "updated";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userBorrowPart";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "withdrawFees";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }];
    };
    readonly "128": {
        readonly name: "heco";
        readonly chainId: "128";
        readonly contracts: {
            readonly KashiPairMediumRiskV1: {
                readonly address: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
                readonly abi: readonly [{
                    readonly inputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "bentoBox_";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "constructor";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_owner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_spender";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Approval";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "accruedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeFraction";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint64";
                        readonly name: "rate";
                        readonly type: "uint64";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "utilization";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAccrue";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogBorrow";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogExchangeRate";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "LogFeeTo";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRepay";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "feeTo";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogWithdrawFees";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "previousOwner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }];
                    readonly name: "OwnershipTransferred";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Transfer";
                    readonly type: "event";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "DOMAIN_SEPARATOR";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "";
                        readonly type: "bytes32";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrue";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrueInfo";
                    readonly outputs: readonly [{
                        readonly internalType: "uint64";
                        readonly name: "interestPerSecond";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAccrued";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "allowance";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "approve";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "asset";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "balanceOf";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "bentoBox";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "borrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "claimOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "collateral";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
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
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "value1";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value2";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "decimals";
                    readonly outputs: readonly [{
                        readonly internalType: "uint8";
                        readonly name: "";
                        readonly type: "uint8";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "exchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "feeTo";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "data";
                        readonly type: "bytes";
                    }];
                    readonly name: "init";
                    readonly outputs: readonly [];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address[]";
                        readonly name: "users";
                        readonly type: "address[]";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "maxBorrowParts";
                        readonly type: "uint256[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "open";
                        readonly type: "bool";
                    }];
                    readonly name: "liquidate";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "masterContract";
                    readonly outputs: readonly [{
                        readonly internalType: "contract KashiPairMediumRiskV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "name";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "nonces";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracle";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IOracle";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracleData";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "";
                        readonly type: "bytes";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "owner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "pendingOwner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner_";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint8";
                        readonly name: "v";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "r";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "s";
                        readonly type: "bytes32";
                    }];
                    readonly name: "permit";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "repay";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "setFeeTo";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "enable";
                        readonly type: "bool";
                    }];
                    readonly name: "setSwapper";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "swappers";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "symbol";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalBorrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalSupply";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transfer";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transferFrom";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "direct";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "renounce";
                        readonly type: "bool";
                    }];
                    readonly name: "transferOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "updateExchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "updated";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userBorrowPart";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "withdrawFees";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }];
            };
        };
        readonly address: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "bentoBox_";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_owner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_spender";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Approval";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "accruedAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeFraction";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint64";
                readonly name: "rate";
                readonly type: "uint64";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "utilization";
                readonly type: "uint256";
            }];
            readonly name: "LogAccrue";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogAddAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogAddCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogBorrow";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly name: "LogExchangeRate";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "LogFeeTo";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogRepay";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "feeTo";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feesEarnedFraction";
                readonly type: "uint256";
            }];
            readonly name: "LogWithdrawFees";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "previousOwner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }];
            readonly name: "OwnershipTransferred";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Transfer";
            readonly type: "event";
        }, {
            readonly inputs: readonly [];
            readonly name: "DOMAIN_SEPARATOR";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrue";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrueInfo";
            readonly outputs: readonly [{
                readonly internalType: "uint64";
                readonly name: "interestPerSecond";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastAccrued";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint128";
                readonly name: "feesEarnedFraction";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "allowance";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "approve";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "asset";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "balanceOf";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "borrow";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "claimOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "collateral";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
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
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "value1";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "value2";
                readonly type: "uint256";
            }];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [{
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "exchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "feeTo";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address[]";
                readonly name: "users";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "maxBorrowParts";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "open";
                readonly type: "bool";
            }];
            readonly name: "liquidate";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "masterContract";
            readonly outputs: readonly [{
                readonly internalType: "contract KashiPairMediumRiskV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "name";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "nonces";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracle";
            readonly outputs: readonly [{
                readonly internalType: "contract IOracle";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracleData";
            readonly outputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "owner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pendingOwner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "owner_";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }];
            readonly name: "permit";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "removeAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "removeCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "repay";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "setFeeTo";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "enable";
                readonly type: "bool";
            }];
            readonly name: "setSwapper";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "swappers";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalBorrow";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transfer";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transferFrom";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "direct";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "renounce";
                readonly type: "bool";
            }];
            readonly name: "transferOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "updateExchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "updated";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userBorrowPart";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "withdrawFees";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }];
    };
    readonly "137": {
        readonly name: "polygon";
        readonly chainId: "137";
        readonly contracts: {
            readonly KashiPairMediumRiskV1: {
                readonly address: "0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7";
                readonly abi: readonly [{
                    readonly inputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "bentoBox_";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "constructor";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_owner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_spender";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Approval";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "accruedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeFraction";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint64";
                        readonly name: "rate";
                        readonly type: "uint64";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "utilization";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAccrue";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogBorrow";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogExchangeRate";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "LogFeeTo";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRepay";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "feeTo";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogWithdrawFees";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "previousOwner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }];
                    readonly name: "OwnershipTransferred";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Transfer";
                    readonly type: "event";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "DOMAIN_SEPARATOR";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "";
                        readonly type: "bytes32";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrue";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrueInfo";
                    readonly outputs: readonly [{
                        readonly internalType: "uint64";
                        readonly name: "interestPerSecond";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAccrued";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "allowance";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "approve";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "asset";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "balanceOf";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "bentoBox";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "borrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "claimOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "collateral";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
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
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "value1";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value2";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "decimals";
                    readonly outputs: readonly [{
                        readonly internalType: "uint8";
                        readonly name: "";
                        readonly type: "uint8";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "exchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "feeTo";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "data";
                        readonly type: "bytes";
                    }];
                    readonly name: "init";
                    readonly outputs: readonly [];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address[]";
                        readonly name: "users";
                        readonly type: "address[]";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "maxBorrowParts";
                        readonly type: "uint256[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "open";
                        readonly type: "bool";
                    }];
                    readonly name: "liquidate";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "masterContract";
                    readonly outputs: readonly [{
                        readonly internalType: "contract KashiPairMediumRiskV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "name";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "nonces";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracle";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IOracle";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracleData";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "";
                        readonly type: "bytes";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "owner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "pendingOwner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner_";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint8";
                        readonly name: "v";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "r";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "s";
                        readonly type: "bytes32";
                    }];
                    readonly name: "permit";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "repay";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "setFeeTo";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "enable";
                        readonly type: "bool";
                    }];
                    readonly name: "setSwapper";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "swappers";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "symbol";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalBorrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalSupply";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transfer";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transferFrom";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "direct";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "renounce";
                        readonly type: "bool";
                    }];
                    readonly name: "transferOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "updateExchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "updated";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userBorrowPart";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "withdrawFees";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }];
            };
        };
        readonly address: "0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "bentoBox_";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_owner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_spender";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Approval";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "accruedAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeFraction";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint64";
                readonly name: "rate";
                readonly type: "uint64";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "utilization";
                readonly type: "uint256";
            }];
            readonly name: "LogAccrue";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogAddAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogAddCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogBorrow";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly name: "LogExchangeRate";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "LogFeeTo";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogRepay";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "feeTo";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feesEarnedFraction";
                readonly type: "uint256";
            }];
            readonly name: "LogWithdrawFees";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "previousOwner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }];
            readonly name: "OwnershipTransferred";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Transfer";
            readonly type: "event";
        }, {
            readonly inputs: readonly [];
            readonly name: "DOMAIN_SEPARATOR";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrue";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrueInfo";
            readonly outputs: readonly [{
                readonly internalType: "uint64";
                readonly name: "interestPerSecond";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastAccrued";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint128";
                readonly name: "feesEarnedFraction";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "allowance";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "approve";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "asset";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "balanceOf";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "borrow";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "claimOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "collateral";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
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
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "value1";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "value2";
                readonly type: "uint256";
            }];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [{
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "exchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "feeTo";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address[]";
                readonly name: "users";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "maxBorrowParts";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "open";
                readonly type: "bool";
            }];
            readonly name: "liquidate";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "masterContract";
            readonly outputs: readonly [{
                readonly internalType: "contract KashiPairMediumRiskV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "name";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "nonces";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracle";
            readonly outputs: readonly [{
                readonly internalType: "contract IOracle";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracleData";
            readonly outputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "owner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pendingOwner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "owner_";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }];
            readonly name: "permit";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "removeAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "removeCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "repay";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "setFeeTo";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "enable";
                readonly type: "bool";
            }];
            readonly name: "setSwapper";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "swappers";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalBorrow";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transfer";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transferFrom";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "direct";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "renounce";
                readonly type: "bool";
            }];
            readonly name: "transferOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "updateExchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "updated";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userBorrowPart";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "withdrawFees";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }];
    };
    readonly "42161": {
        readonly name: "arbitrum";
        readonly chainId: "42161";
        readonly contracts: {
            readonly KashiPairMediumRiskV1: {
                readonly address: "0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e";
                readonly abi: readonly [{
                    readonly inputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "bentoBox_";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "constructor";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_owner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_spender";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Approval";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "accruedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeFraction";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint64";
                        readonly name: "rate";
                        readonly type: "uint64";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "utilization";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAccrue";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogBorrow";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogExchangeRate";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "LogFeeTo";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRepay";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "feeTo";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogWithdrawFees";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "previousOwner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }];
                    readonly name: "OwnershipTransferred";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Transfer";
                    readonly type: "event";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "DOMAIN_SEPARATOR";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "";
                        readonly type: "bytes32";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrue";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrueInfo";
                    readonly outputs: readonly [{
                        readonly internalType: "uint64";
                        readonly name: "interestPerSecond";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAccrued";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "allowance";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "approve";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "asset";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "balanceOf";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "bentoBox";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "borrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "claimOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "collateral";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
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
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "value1";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value2";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "decimals";
                    readonly outputs: readonly [{
                        readonly internalType: "uint8";
                        readonly name: "";
                        readonly type: "uint8";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "exchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "feeTo";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "data";
                        readonly type: "bytes";
                    }];
                    readonly name: "init";
                    readonly outputs: readonly [];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address[]";
                        readonly name: "users";
                        readonly type: "address[]";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "maxBorrowParts";
                        readonly type: "uint256[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "open";
                        readonly type: "bool";
                    }];
                    readonly name: "liquidate";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "masterContract";
                    readonly outputs: readonly [{
                        readonly internalType: "contract KashiPairMediumRiskV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "name";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "nonces";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracle";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IOracle";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracleData";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "";
                        readonly type: "bytes";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "owner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "pendingOwner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner_";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint8";
                        readonly name: "v";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "r";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "s";
                        readonly type: "bytes32";
                    }];
                    readonly name: "permit";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "repay";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "setFeeTo";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "enable";
                        readonly type: "bool";
                    }];
                    readonly name: "setSwapper";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "swappers";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "symbol";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalBorrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalSupply";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transfer";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transferFrom";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "direct";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "renounce";
                        readonly type: "bool";
                    }];
                    readonly name: "transferOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "updateExchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "updated";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userBorrowPart";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "withdrawFees";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }];
            };
        };
        readonly address: "0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "bentoBox_";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_owner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_spender";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Approval";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "accruedAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeFraction";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint64";
                readonly name: "rate";
                readonly type: "uint64";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "utilization";
                readonly type: "uint256";
            }];
            readonly name: "LogAccrue";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogAddAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogAddCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogBorrow";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly name: "LogExchangeRate";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "LogFeeTo";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogRepay";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "feeTo";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feesEarnedFraction";
                readonly type: "uint256";
            }];
            readonly name: "LogWithdrawFees";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "previousOwner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }];
            readonly name: "OwnershipTransferred";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Transfer";
            readonly type: "event";
        }, {
            readonly inputs: readonly [];
            readonly name: "DOMAIN_SEPARATOR";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrue";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrueInfo";
            readonly outputs: readonly [{
                readonly internalType: "uint64";
                readonly name: "interestPerSecond";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastAccrued";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint128";
                readonly name: "feesEarnedFraction";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "allowance";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "approve";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "asset";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "balanceOf";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "borrow";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "claimOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "collateral";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
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
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "value1";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "value2";
                readonly type: "uint256";
            }];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [{
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "exchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "feeTo";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address[]";
                readonly name: "users";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "maxBorrowParts";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "open";
                readonly type: "bool";
            }];
            readonly name: "liquidate";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "masterContract";
            readonly outputs: readonly [{
                readonly internalType: "contract KashiPairMediumRiskV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "name";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "nonces";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracle";
            readonly outputs: readonly [{
                readonly internalType: "contract IOracle";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracleData";
            readonly outputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "owner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pendingOwner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "owner_";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }];
            readonly name: "permit";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "removeAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "removeCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "repay";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "setFeeTo";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "enable";
                readonly type: "bool";
            }];
            readonly name: "setSwapper";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "swappers";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalBorrow";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transfer";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transferFrom";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "direct";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "renounce";
                readonly type: "bool";
            }];
            readonly name: "transferOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "updateExchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "updated";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userBorrowPart";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "withdrawFees";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }];
    };
    readonly "43114": {
        readonly name: "avalanche";
        readonly chainId: "43114";
        readonly contracts: {
            readonly KashiPairMediumRiskV1: {
                readonly address: "0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb";
                readonly abi: readonly [{
                    readonly inputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "bentoBox_";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "constructor";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_owner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_spender";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Approval";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "accruedAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeFraction";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint64";
                        readonly name: "rate";
                        readonly type: "uint64";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "utilization";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAccrue";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogAddCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feeAmount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogBorrow";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogExchangeRate";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "LogFeeTo";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveAsset";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRemoveCollateral";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogRepay";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "feeTo";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "LogWithdrawFees";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "previousOwner";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }];
                    readonly name: "OwnershipTransferred";
                    readonly type: "event";
                }, {
                    readonly anonymous: false;
                    readonly inputs: readonly [{
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_from";
                        readonly type: "address";
                    }, {
                        readonly indexed: true;
                        readonly internalType: "address";
                        readonly name: "_to";
                        readonly type: "address";
                    }, {
                        readonly indexed: false;
                        readonly internalType: "uint256";
                        readonly name: "_value";
                        readonly type: "uint256";
                    }];
                    readonly name: "Transfer";
                    readonly type: "event";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "DOMAIN_SEPARATOR";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes32";
                        readonly name: "";
                        readonly type: "bytes32";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrue";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "accrueInfo";
                    readonly outputs: readonly [{
                        readonly internalType: "uint64";
                        readonly name: "interestPerSecond";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint64";
                        readonly name: "lastAccrued";
                        readonly type: "uint64";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "feesEarnedFraction";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "addCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "allowance";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "approve";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "asset";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "balanceOf";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "bentoBox";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IBentoBoxV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "borrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "claimOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "collateral";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IERC20";
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
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "value1";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value2";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "decimals";
                    readonly outputs: readonly [{
                        readonly internalType: "uint8";
                        readonly name: "";
                        readonly type: "uint8";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "exchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "feeTo";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "data";
                        readonly type: "bytes";
                    }];
                    readonly name: "init";
                    readonly outputs: readonly [];
                    readonly stateMutability: "payable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address[]";
                        readonly name: "users";
                        readonly type: "address[]";
                    }, {
                        readonly internalType: "uint256[]";
                        readonly name: "maxBorrowParts";
                        readonly type: "uint256[]";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "open";
                        readonly type: "bool";
                    }];
                    readonly name: "liquidate";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "masterContract";
                    readonly outputs: readonly [{
                        readonly internalType: "contract KashiPairMediumRiskV1";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "name";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "nonces";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracle";
                    readonly outputs: readonly [{
                        readonly internalType: "contract IOracle";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "oracleData";
                    readonly outputs: readonly [{
                        readonly internalType: "bytes";
                        readonly name: "";
                        readonly type: "bytes";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "owner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "pendingOwner";
                    readonly outputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "owner_";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "spender";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "value";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "deadline";
                        readonly type: "uint256";
                    }, {
                        readonly internalType: "uint8";
                        readonly name: "v";
                        readonly type: "uint8";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "r";
                        readonly type: "bytes32";
                    }, {
                        readonly internalType: "bytes32";
                        readonly name: "s";
                        readonly type: "bytes32";
                    }];
                    readonly name: "permit";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "fraction";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "share";
                        readonly type: "uint256";
                    }];
                    readonly name: "removeCollateral";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "skim";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "part";
                        readonly type: "uint256";
                    }];
                    readonly name: "repay";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newFeeTo";
                        readonly type: "address";
                    }];
                    readonly name: "setFeeTo";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "swapper";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "enable";
                        readonly type: "bool";
                    }];
                    readonly name: "setSwapper";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "contract ISwapper";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "swappers";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "symbol";
                    readonly outputs: readonly [{
                        readonly internalType: "string";
                        readonly name: "";
                        readonly type: "string";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalAsset";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalBorrow";
                    readonly outputs: readonly [{
                        readonly internalType: "uint128";
                        readonly name: "elastic";
                        readonly type: "uint128";
                    }, {
                        readonly internalType: "uint128";
                        readonly name: "base";
                        readonly type: "uint128";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "totalSupply";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transfer";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "from";
                        readonly type: "address";
                    }, {
                        readonly internalType: "address";
                        readonly name: "to";
                        readonly type: "address";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "amount";
                        readonly type: "uint256";
                    }];
                    readonly name: "transferFrom";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "";
                        readonly type: "bool";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "newOwner";
                        readonly type: "address";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "direct";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "bool";
                        readonly name: "renounce";
                        readonly type: "bool";
                    }];
                    readonly name: "transferOwnership";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "updateExchangeRate";
                    readonly outputs: readonly [{
                        readonly internalType: "bool";
                        readonly name: "updated";
                        readonly type: "bool";
                    }, {
                        readonly internalType: "uint256";
                        readonly name: "rate";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userBorrowPart";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [{
                        readonly internalType: "address";
                        readonly name: "";
                        readonly type: "address";
                    }];
                    readonly name: "userCollateralShare";
                    readonly outputs: readonly [{
                        readonly internalType: "uint256";
                        readonly name: "";
                        readonly type: "uint256";
                    }];
                    readonly stateMutability: "view";
                    readonly type: "function";
                }, {
                    readonly inputs: readonly [];
                    readonly name: "withdrawFees";
                    readonly outputs: readonly [];
                    readonly stateMutability: "nonpayable";
                    readonly type: "function";
                }];
            };
        };
        readonly address: "0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb";
        readonly abi: readonly [{
            readonly inputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "bentoBox_";
                readonly type: "address";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "constructor";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_owner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_spender";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Approval";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "accruedAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeFraction";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint64";
                readonly name: "rate";
                readonly type: "uint64";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "utilization";
                readonly type: "uint256";
            }];
            readonly name: "LogAccrue";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogAddAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogAddCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feeAmount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogBorrow";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly name: "LogExchangeRate";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "LogFeeTo";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveAsset";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "LogRemoveCollateral";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "LogRepay";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "feeTo";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "feesEarnedFraction";
                readonly type: "uint256";
            }];
            readonly name: "LogWithdrawFees";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "previousOwner";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }];
            readonly name: "OwnershipTransferred";
            readonly type: "event";
        }, {
            readonly anonymous: false;
            readonly inputs: readonly [{
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_from";
                readonly type: "address";
            }, {
                readonly indexed: true;
                readonly internalType: "address";
                readonly name: "_to";
                readonly type: "address";
            }, {
                readonly indexed: false;
                readonly internalType: "uint256";
                readonly name: "_value";
                readonly type: "uint256";
            }];
            readonly name: "Transfer";
            readonly type: "event";
        }, {
            readonly inputs: readonly [];
            readonly name: "DOMAIN_SEPARATOR";
            readonly outputs: readonly [{
                readonly internalType: "bytes32";
                readonly name: "";
                readonly type: "bytes32";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrue";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "accrueInfo";
            readonly outputs: readonly [{
                readonly internalType: "uint64";
                readonly name: "interestPerSecond";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint64";
                readonly name: "lastAccrued";
                readonly type: "uint64";
            }, {
                readonly internalType: "uint128";
                readonly name: "feesEarnedFraction";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "addCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "allowance";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "approve";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "asset";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "balanceOf";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "bentoBox";
            readonly outputs: readonly [{
                readonly internalType: "contract IBentoBoxV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "borrow";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "claimOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "collateral";
            readonly outputs: readonly [{
                readonly internalType: "contract IERC20";
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
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "value1";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "value2";
                readonly type: "uint256";
            }];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "decimals";
            readonly outputs: readonly [{
                readonly internalType: "uint8";
                readonly name: "";
                readonly type: "uint8";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "exchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "feeTo";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "data";
                readonly type: "bytes";
            }];
            readonly name: "init";
            readonly outputs: readonly [];
            readonly stateMutability: "payable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address[]";
                readonly name: "users";
                readonly type: "address[]";
            }, {
                readonly internalType: "uint256[]";
                readonly name: "maxBorrowParts";
                readonly type: "uint256[]";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "open";
                readonly type: "bool";
            }];
            readonly name: "liquidate";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "masterContract";
            readonly outputs: readonly [{
                readonly internalType: "contract KashiPairMediumRiskV1";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "name";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "nonces";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracle";
            readonly outputs: readonly [{
                readonly internalType: "contract IOracle";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "oracleData";
            readonly outputs: readonly [{
                readonly internalType: "bytes";
                readonly name: "";
                readonly type: "bytes";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "owner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "pendingOwner";
            readonly outputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "owner_";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "spender";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "value";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "deadline";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }];
            readonly name: "permit";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "fraction";
                readonly type: "uint256";
            }];
            readonly name: "removeAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "share";
                readonly type: "uint256";
            }];
            readonly name: "removeCollateral";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "skim";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "part";
                readonly type: "uint256";
            }];
            readonly name: "repay";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newFeeTo";
                readonly type: "address";
            }];
            readonly name: "setFeeTo";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "swapper";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "enable";
                readonly type: "bool";
            }];
            readonly name: "setSwapper";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "contract ISwapper";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "swappers";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "symbol";
            readonly outputs: readonly [{
                readonly internalType: "string";
                readonly name: "";
                readonly type: "string";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalAsset";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalBorrow";
            readonly outputs: readonly [{
                readonly internalType: "uint128";
                readonly name: "elastic";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "base";
                readonly type: "uint128";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "totalSupply";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transfer";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "from";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "uint256";
                readonly name: "amount";
                readonly type: "uint256";
            }];
            readonly name: "transferFrom";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "";
                readonly type: "bool";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "newOwner";
                readonly type: "address";
            }, {
                readonly internalType: "bool";
                readonly name: "direct";
                readonly type: "bool";
            }, {
                readonly internalType: "bool";
                readonly name: "renounce";
                readonly type: "bool";
            }];
            readonly name: "transferOwnership";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "updateExchangeRate";
            readonly outputs: readonly [{
                readonly internalType: "bool";
                readonly name: "updated";
                readonly type: "bool";
            }, {
                readonly internalType: "uint256";
                readonly name: "rate";
                readonly type: "uint256";
            }];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userBorrowPart";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [{
                readonly internalType: "address";
                readonly name: "";
                readonly type: "address";
            }];
            readonly name: "userCollateralShare";
            readonly outputs: readonly [{
                readonly internalType: "uint256";
                readonly name: "";
                readonly type: "uint256";
            }];
            readonly stateMutability: "view";
            readonly type: "function";
        }, {
            readonly inputs: readonly [];
            readonly name: "withdrawFees";
            readonly outputs: readonly [];
            readonly stateMutability: "nonpayable";
            readonly type: "function";
        }];
    };
};
export type KashiPairMediumRiskV1Exports = typeof kashiPairMediumRiskV1Exports;
export type KashiPairMediumRiskV1ChainId = NumberStringToNumber<keyof KashiPairMediumRiskV1Exports>;
export declare const isKashiPairMediumRiskV1ChainId: (chainId: number) => chainId is KashiPairMediumRiskV1ChainId;
export declare const kashiPairMediumRiskV1Address: {
    readonly 1: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
    readonly 56: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
    readonly 100: "0x7a6DA9903d0a481F40b8336c1463487BC8C0407e";
    readonly 128: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42";
    readonly 137: "0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7";
    readonly 42161: "0xa010eE0226cd071BeBd8919A1F675cAE1f1f5D3e";
    readonly 43114: "0x513037395FA0C9c35E41f89189ceDfE3bD42fAdb";
};
export declare const kashiPairMediumRiskV1Abi: {
    readonly 1: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "bentoBox_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "accruedAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeFraction";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "rate";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "utilization";
            readonly type: "uint256";
        }];
        readonly name: "LogAccrue";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogAddAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogAddCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogBorrow";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "LogExchangeRate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "LogFeeTo";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogRepay";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "feeTo";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feesEarnedFraction";
            readonly type: "uint256";
        }];
        readonly name: "LogWithdrawFees";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrue";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrueInfo";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "interestPerSecond";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastAccrued";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "feesEarnedFraction";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "asset";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "borrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "claimOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
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
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value2";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "feeTo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "init";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "users";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "maxBorrowParts";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "open";
            readonly type: "bool";
        }];
        readonly name: "liquidate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "masterContract";
        readonly outputs: readonly [{
            readonly internalType: "contract KashiPairMediumRiskV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracle";
        readonly outputs: readonly [{
            readonly internalType: "contract IOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "removeAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "removeCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "setFeeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "enable";
            readonly type: "bool";
        }];
        readonly name: "setSwapper";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "swappers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalBorrow";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "direct";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "renounce";
            readonly type: "bool";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateExchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "updated";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userBorrowPart";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawFees";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    readonly 56: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "bentoBox_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "accruedAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeFraction";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "rate";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "utilization";
            readonly type: "uint256";
        }];
        readonly name: "LogAccrue";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogAddAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogAddCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogBorrow";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "LogExchangeRate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "LogFeeTo";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogRepay";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "feeTo";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feesEarnedFraction";
            readonly type: "uint256";
        }];
        readonly name: "LogWithdrawFees";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrue";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrueInfo";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "interestPerSecond";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastAccrued";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "feesEarnedFraction";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "asset";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "borrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "claimOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
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
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value2";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "feeTo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "init";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "users";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "maxBorrowParts";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "open";
            readonly type: "bool";
        }];
        readonly name: "liquidate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "masterContract";
        readonly outputs: readonly [{
            readonly internalType: "contract KashiPairMediumRiskV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracle";
        readonly outputs: readonly [{
            readonly internalType: "contract IOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "removeAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "removeCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "setFeeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "enable";
            readonly type: "bool";
        }];
        readonly name: "setSwapper";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "swappers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalBorrow";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "direct";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "renounce";
            readonly type: "bool";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateExchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "updated";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userBorrowPart";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawFees";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    readonly 100: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "bentoBox_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "accruedAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeFraction";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "rate";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "utilization";
            readonly type: "uint256";
        }];
        readonly name: "LogAccrue";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogAddAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogAddCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogBorrow";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "LogExchangeRate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "LogFeeTo";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogRepay";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "feeTo";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feesEarnedFraction";
            readonly type: "uint256";
        }];
        readonly name: "LogWithdrawFees";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrue";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrueInfo";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "interestPerSecond";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastAccrued";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "feesEarnedFraction";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "asset";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "borrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "claimOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
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
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value2";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "feeTo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "init";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "users";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "maxBorrowParts";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "open";
            readonly type: "bool";
        }];
        readonly name: "liquidate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "masterContract";
        readonly outputs: readonly [{
            readonly internalType: "contract KashiPairMediumRiskV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracle";
        readonly outputs: readonly [{
            readonly internalType: "contract IOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "removeAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "removeCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "setFeeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "enable";
            readonly type: "bool";
        }];
        readonly name: "setSwapper";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "swappers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalBorrow";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "direct";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "renounce";
            readonly type: "bool";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateExchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "updated";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userBorrowPart";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawFees";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    readonly 128: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "bentoBox_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "accruedAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeFraction";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "rate";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "utilization";
            readonly type: "uint256";
        }];
        readonly name: "LogAccrue";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogAddAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogAddCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogBorrow";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "LogExchangeRate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "LogFeeTo";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogRepay";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "feeTo";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feesEarnedFraction";
            readonly type: "uint256";
        }];
        readonly name: "LogWithdrawFees";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrue";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrueInfo";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "interestPerSecond";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastAccrued";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "feesEarnedFraction";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "asset";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "borrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "claimOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
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
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value2";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "feeTo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "init";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "users";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "maxBorrowParts";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "open";
            readonly type: "bool";
        }];
        readonly name: "liquidate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "masterContract";
        readonly outputs: readonly [{
            readonly internalType: "contract KashiPairMediumRiskV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracle";
        readonly outputs: readonly [{
            readonly internalType: "contract IOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "removeAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "removeCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "setFeeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "enable";
            readonly type: "bool";
        }];
        readonly name: "setSwapper";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "swappers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalBorrow";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "direct";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "renounce";
            readonly type: "bool";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateExchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "updated";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userBorrowPart";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawFees";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    readonly 137: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "bentoBox_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "accruedAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeFraction";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "rate";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "utilization";
            readonly type: "uint256";
        }];
        readonly name: "LogAccrue";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogAddAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogAddCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogBorrow";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "LogExchangeRate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "LogFeeTo";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogRepay";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "feeTo";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feesEarnedFraction";
            readonly type: "uint256";
        }];
        readonly name: "LogWithdrawFees";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrue";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrueInfo";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "interestPerSecond";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastAccrued";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "feesEarnedFraction";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "asset";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "borrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "claimOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
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
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value2";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "feeTo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "init";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "users";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "maxBorrowParts";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "open";
            readonly type: "bool";
        }];
        readonly name: "liquidate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "masterContract";
        readonly outputs: readonly [{
            readonly internalType: "contract KashiPairMediumRiskV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracle";
        readonly outputs: readonly [{
            readonly internalType: "contract IOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "removeAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "removeCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "setFeeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "enable";
            readonly type: "bool";
        }];
        readonly name: "setSwapper";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "swappers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalBorrow";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "direct";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "renounce";
            readonly type: "bool";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateExchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "updated";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userBorrowPart";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawFees";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    readonly 42161: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "bentoBox_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "accruedAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeFraction";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "rate";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "utilization";
            readonly type: "uint256";
        }];
        readonly name: "LogAccrue";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogAddAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogAddCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogBorrow";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "LogExchangeRate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "LogFeeTo";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogRepay";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "feeTo";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feesEarnedFraction";
            readonly type: "uint256";
        }];
        readonly name: "LogWithdrawFees";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrue";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrueInfo";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "interestPerSecond";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastAccrued";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "feesEarnedFraction";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "asset";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "borrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "claimOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
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
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value2";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "feeTo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "init";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "users";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "maxBorrowParts";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "open";
            readonly type: "bool";
        }];
        readonly name: "liquidate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "masterContract";
        readonly outputs: readonly [{
            readonly internalType: "contract KashiPairMediumRiskV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracle";
        readonly outputs: readonly [{
            readonly internalType: "contract IOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "removeAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "removeCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "setFeeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "enable";
            readonly type: "bool";
        }];
        readonly name: "setSwapper";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "swappers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalBorrow";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "direct";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "renounce";
            readonly type: "bool";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateExchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "updated";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userBorrowPart";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawFees";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    readonly 43114: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "bentoBox_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "accruedAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeFraction";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint64";
            readonly name: "rate";
            readonly type: "uint64";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "utilization";
            readonly type: "uint256";
        }];
        readonly name: "LogAccrue";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogAddAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogAddCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feeAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogBorrow";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly name: "LogExchangeRate";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "LogFeeTo";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveAsset";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "LogRemoveCollateral";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "LogRepay";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "feeTo";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "feesEarnedFraction";
            readonly type: "uint256";
        }];
        readonly name: "LogWithdrawFees";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrue";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "accrueInfo";
        readonly outputs: readonly [{
            readonly internalType: "uint64";
            readonly name: "interestPerSecond";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint64";
            readonly name: "lastAccrued";
            readonly type: "uint64";
        }, {
            readonly internalType: "uint128";
            readonly name: "feesEarnedFraction";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "addCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "asset";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "bentoBox";
        readonly outputs: readonly [{
            readonly internalType: "contract IBentoBoxV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "borrow";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "claimOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
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
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "value1";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "value2";
            readonly type: "uint256";
        }];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "exchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "feeTo";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "init";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "users";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "maxBorrowParts";
            readonly type: "uint256[]";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "open";
            readonly type: "bool";
        }];
        readonly name: "liquidate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "masterContract";
        readonly outputs: readonly [{
            readonly internalType: "contract KashiPairMediumRiskV1";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracle";
        readonly outputs: readonly [{
            readonly internalType: "contract IOracle";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "oracleData";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pendingOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner_";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "fraction";
            readonly type: "uint256";
        }];
        readonly name: "removeAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "share";
            readonly type: "uint256";
        }];
        readonly name: "removeCollateral";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "skim";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "part";
            readonly type: "uint256";
        }];
        readonly name: "repay";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newFeeTo";
            readonly type: "address";
        }];
        readonly name: "setFeeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "swapper";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "enable";
            readonly type: "bool";
        }];
        readonly name: "setSwapper";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract ISwapper";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "swappers";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalAsset";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalBorrow";
        readonly outputs: readonly [{
            readonly internalType: "uint128";
            readonly name: "elastic";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "base";
            readonly type: "uint128";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "direct";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "renounce";
            readonly type: "bool";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateExchangeRate";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "updated";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "rate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userBorrowPart";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "userCollateralShare";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawFees";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
};
