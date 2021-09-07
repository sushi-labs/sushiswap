// SPDX-License-Identifier: MIT

pragma solidity =0.6.12;
import './uniswapv2/UniswapV2Pair.sol';

contract InitCodeHash {
    function getInitHash() public pure returns(bytes32){
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        return keccak256(abi.encodePacked(bytecode));
    }
}
