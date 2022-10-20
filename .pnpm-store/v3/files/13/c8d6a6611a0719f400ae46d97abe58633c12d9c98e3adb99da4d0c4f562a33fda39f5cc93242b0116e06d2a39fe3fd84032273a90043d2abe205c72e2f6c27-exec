#!/bin/bash

cd `dirname $0`

CONTRACTS=$ZKSYNC_HOME/contracts/ethereum/artifacts/cache/solpp-generated-contracts

cat $CONTRACTS/bridge/interfaces/IL1Bridge.sol/IL1Bridge.json | jq '{ abi: .abi}' > IL1Bridge.json
cat $CONTRACTS/bridge/interfaces/IL2Bridge.sol/IL2Bridge.json | jq '{ abi: .abi}' > IL2Bridge.json
cat $CONTRACTS/zksync/interfaces/IZkSync.sol/IZkSync.json | jq '{ abi: .abi}' > IZkSync.json
cat $CONTRACTS/common/interfaces/IERC20.sol/IERC20.json | jq '{ abi: .abi}' > IERC20.json
