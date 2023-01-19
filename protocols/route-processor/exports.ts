export default {
  "1": [
    {
      "name": "ethereum",
      "chainId": "1",
      "contracts": {
        "RouteProcessor": {
          "address": "0x7af71799C40F952237eAA4D81A77C1af49125113",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_bentoBox",
                  "type": "address"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [],
              "name": "bentoBox",
              "outputs": [
                {
                  "internalType": "contract IBentoBoxMinimal",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenIn",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountIn",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "tokenOut",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountOutMin",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "route",
                  "type": "bytes"
                }
              ],
              "name": "processRoute",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "amountOut",
                  "type": "uint256"
                }
              ],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            }
          ]
        }
      }
    }
  ],
  "137": [
    {
      "name": "polygon",
      "chainId": "137",
      "contracts": {
        "RouteProcessor": {
          "address": "0x7CD29170e8fA3fE5204624deDE5A66F4e8161741",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_bentoBox",
                  "type": "address"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [],
              "name": "bentoBox",
              "outputs": [
                {
                  "internalType": "contract IBentoBoxMinimal",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenIn",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountIn",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "tokenOut",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountOutMin",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "route",
                  "type": "bytes"
                }
              ],
              "name": "processRoute",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "amountOut",
                  "type": "uint256"
                }
              ],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            }
          ]
        }
      }
    }
  ],
  "250": [
    {
      "name": "fantom",
      "chainId": "250",
      "contracts": {
        "RouteProcessor": {
          "address": "0x9e4791ad13f14783C7B2A6A7bD8D6DDD1DC95847",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_bentoBox",
                  "type": "address"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [],
              "name": "bentoBox",
              "outputs": [
                {
                  "internalType": "contract IBentoBoxMinimal",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenIn",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountIn",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "tokenOut",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountOutMin",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "route",
                  "type": "bytes"
                }
              ],
              "name": "processRoute",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "amountOut",
                  "type": "uint256"
                }
              ],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            }
          ]
        }
      }
    }
  ],
  "31337": [
    {
      "name": "hardhat",
      "chainId": "31337",
      "contracts": {}
    }
  ],
  "42161": [
    {
      "name": "arbitrum",
      "chainId": "42161",
      "contracts": {
        "RouteProcessor": {
          "address": "0x9f18658f7206EaA8D885bBfBb95aB6D9f6c6C12F",
          "abi": [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_bentoBox",
                  "type": "address"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [],
              "name": "bentoBox",
              "outputs": [
                {
                  "internalType": "contract IBentoBoxMinimal",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "tokenIn",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountIn",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "tokenOut",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amountOutMin",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "route",
                  "type": "bytes"
                }
              ],
              "name": "processRoute",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "amountOut",
                  "type": "uint256"
                }
              ],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "stateMutability": "payable",
              "type": "receive"
            }
          ]
        }
      }
    }
  ]
} as const