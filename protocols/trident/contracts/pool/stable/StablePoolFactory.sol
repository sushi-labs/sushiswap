// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import {PoolDeployer} from "../../abstract/PoolDeployer.sol";
import {StablePool} from "./StablePool.sol";
import {IStablePoolFactory} from "../../interfaces/IStablePoolFactory.sol";
import {IMasterDeployerV2} from "../../interfaces/IMasterDeployerV2.sol";

contract StablePoolFactory is IStablePoolFactory, PoolDeployer {
    bytes32 public constant bytecodeHash = keccak256(type(StablePool).creationCode);

    bytes private cachedDeployData;

    constructor(address _masterDeployer) PoolDeployer(_masterDeployer) {}

    function deployPool(bytes memory _deployData) external returns (address pool) {
        (address tokenA, address tokenB, uint256 swapFee) = abi.decode(_deployData, (address, address, uint256));

        if (tokenA > tokenB) {
            (tokenA, tokenB) = (tokenB, tokenA);
        }

        // Strips any extra data.
        _deployData = abi.encode(tokenA, tokenB, swapFee);

        address[] memory tokens = new address[](2);
        tokens[0] = tokenA;
        tokens[1] = tokenB;

        bytes32 salt = keccak256(_deployData);

        cachedDeployData = _deployData;

        pool = address(new StablePool{salt: salt}());

        cachedDeployData = "";

        _registerPool(pool, tokens, salt);
    }

    // This called in the StablePool constructor.
    function getDeployData() external view override returns (bytes memory, IMasterDeployerV2) {
        return (cachedDeployData, IMasterDeployerV2(masterDeployer));
    }

    function calculatePoolAddress(
        address token0,
        address token1,
        uint256 swapFee
    ) external view returns (address) {
        bytes32 salt = keccak256(abi.encode(token0, token1, swapFee));
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash));
        return address(uint160(uint256(hash)));
    }
}
