// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.12;

import "./SakeSwapPair.sol";

contract SakeSwapFactory {
    address public feeTo;
    address public feeToSetter;
    address public migrator;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "SakeSwap: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "SakeSwap: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "SakeSwap: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(SakeSwapPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        ISakeSwapPair(pair).initialize(token0, token1);

        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "SakeSwap: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "SakeSwap: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    function setMigrator(address _migrator) external {
        require(msg.sender == feeToSetter, "SakeSwap: FORBIDDEN");
        migrator = _migrator;
    }
}
