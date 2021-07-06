// SPDX-License-Identifier: GPL-3.0

pragma solidity =0.6.12;

import './interfaces/ISuniswapFactory.sol';
import './SuniswapPair.sol';

contract SuniswapFactory is ISuniswapFactory {


    //GENERATE CODE INIT CODE PAIR HASH
    //bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(SuniswapPair).creationCode));


    address public override feeTo;
    address public override feeToSetter;
    address public override migrator;

    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external override view returns (uint) {
        return allPairs.length;
    }

    //SUNI INIT CODE HASH
    function pairCodeHash() external pure returns (bytes32) {
        return keccak256(type(SuniswapPair).creationCode);
    }

    function createPair(address tokenA, address tokenB) external override returns (address pair) {
        require(tokenA != tokenB, 'Suniswap: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Suniswap: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'Suniswap: PAIR_EXISTS'); // single check is sufficient

        //SUNI INIT CODE HASH
        bytes memory bytecode = type(SuniswapPair).creationCode;

        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        SuniswapPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, 'Suniswap: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setMigrator(address _migrator) external override {
        require(msg.sender == feeToSetter, 'Suniswap: FORBIDDEN');
        migrator = _migrator;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, 'Suniswap: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }

}
