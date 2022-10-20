# BoringSolidity

[![Coverage Status](https://coveralls.io/repos/github/boringcrypto/BoringSolidity/badge.svg?branch=master)](https://coveralls.io/github/boringcrypto/BoringSolidity?branch=master)

BoringSolidity is a collection of general purpose Solidity contracts that have been reasonably optimized, reviewed and tested. Still, they come with no guarantees and are provided as-is.

## BoringMath Library

Once we can move to Solidity 0.8.0 we won't need this anymore, but until then, this library helps protect against over and under flows. Also contains some support for uint128.

There is no div function because never solidity versions will revert on a division by 0.

BoringMath128 does not contain a `mul` function on purpose. To avoid overflows during calculations, it's encouraged to convert to uint256 first.

## BoringOwnable

This is a combination of the well known Ownable and Claimable patterns. It's streamlined to reduce the amount of functions exposed for gas savings.

## BoringERC20

This is not a full ERC20 implementation, as it's missing totalSupply. It's optimized for minimal gas usage while remaining easy to read.

## BoringFactory

Simple universal factory to create minimal proxies from masterContracts.

## BoringBatchable

Extension to be added to any contract to allow calling multiple functions on the contract in a batch (a single EOA call). 
The EIP 2612 permit proxy function is included because it's common to approve spending before calling other functions on a contract.

## BoringRebase

The Rebase struct and RebaseLibary make it easy to track amounts and shares in a single storage slot. This will limit amounts and shares to 128 bits,
but if used for token balances, this should be enough for pretty much all tokens that have real use.

## Licence

MIT
