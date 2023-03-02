// SPDX-License-Identifier: GPL-3.0-or-later-only

pragma solidity >=0.8.0;

/// @dev Custom Errors
error UnauthorisedDeployer();
error ZeroAddress();
error InvalidTokenOrder();

/// @notice Trident pool deployer for whitelisted template factories.
/// @author Mudit Gupta.
abstract contract PoolDeployer {
    address public immutable masterDeployer;

    mapping(address => mapping(address => address[])) public pools;
    mapping(bytes32 => address) public configAddress;

    modifier onlyMaster() {
        if (msg.sender != masterDeployer) revert UnauthorisedDeployer();
        _;
    }

    constructor(address _masterDeployer) {
        if (_masterDeployer == address(0)) revert ZeroAddress();
        masterDeployer = _masterDeployer;
    }

    function _registerPool(
        address pool,
        address[] memory tokens,
        bytes32 salt
    ) internal onlyMaster {
        // Store the address of the deployed contract.
        configAddress[salt] = pool;
        // Attacker used underflow, it was not very effective. poolimon!
        // null token array would cause deployment to fail via out of bounds memory axis/gas limit.
        unchecked {
            for (uint256 i; i < tokens.length - 1; ++i) {
                if (tokens[i] >= tokens[i + 1]) revert InvalidTokenOrder();
                for (uint256 j = i + 1; j < tokens.length; ++j) {
                    pools[tokens[i]][tokens[j]].push(pool);
                    pools[tokens[j]][tokens[i]].push(pool);
                }
            }
        }
    }

    function poolsCount(address token0, address token1) external view returns (uint256 count) {
        count = pools[token0][token1].length;
    }

    function getPools(
        address token0,
        address token1,
        uint256 startIndex,
        uint256 count
    ) external view returns (address[] memory pairPools) {
        pairPools = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            pairPools[i] = pools[token0][token1][startIndex + i];
        }
    }
}
