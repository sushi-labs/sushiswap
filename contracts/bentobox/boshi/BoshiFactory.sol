// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import './IBoshiFactory.sol';
import './BoshiERC20.sol';
import './BoshiPair.sol';

contract BoshiFactory is IBoshiFactory {
    address public override feeTo;
    address public override feeToSetter;
    address public override migrator;

    mapping(IERC20 => mapping(IERC20 => address)) public override getPair;
    address[] public override allPairs;

    event PairCreated(IERC20 indexed token0, IERC20 indexed token1, address pair, uint256);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external override view returns (uint256) {
        return allPairs.length;
    }

    function pairCodeHash() external pure returns (bytes32) {
        return keccak256(type(BoshiPair).creationCode);
    }

    function createPair(IERC20 tokenA, IERC20 tokenB) external override returns (address pair) {
        require(tokenA != tokenB, 'Boshi: IDENTICAL_ADDRESSES');
        (IERC20 token0, IERC20 token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(address(token0) != address(0), 'Boshi: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'Boshi: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(BoshiPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        BoshiPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
    
    // **** GOVERNANCE **** 
    modifier onlyFeeToSetter {
        require(msg.sender == feeToSetter, 'Boshi: FORBIDDEN');
        _;
    }

    function setFeeTo(address _feeTo) external override onlyFeeToSetter {
        feeTo = _feeTo;
    }

    function setMigrator(address _migrator) external override onlyFeeToSetter {
        migrator = _migrator;
    }

    function setFeeToSetter(address _feeToSetter) external override onlyFeeToSetter {
        feeToSetter = _feeToSetter;
    }
}
