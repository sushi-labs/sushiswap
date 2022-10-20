// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IntermediaryToken.sol";
import "../interfaces/IMasterDeployer.sol";
import "../interfaces/IBentoBoxMinimal.sol";
import "../interfaces/IPoolFactory.sol";
import "../interfaces/IPool.sol";
import "../interfaces/IConstantProductPool.sol";
import "../interfaces/IUniswapV2Minimal.sol";

/// @notice Trident pool migrator contract for legacy SushiSwap.
/** Sushiswap's master chef contracts which distribute rewards to LP token holders have the option to migrate liquidity.
    We can set this contract as the migrator on the master chef contracts to migrate LP positions from the legacy to the new Trident
    constant product pools. After the migrator is set anyone can call the migrate() function (once per pool) on the master chef contract.
    Used by MasterChef / MasterChefV2 / MiniChef. */
contract Migrator {
    event Migrate(address indexed oldPool, address indexed newPool, address indexed intermediaryToken);

    /// @dev Intermediary token to new LP token mapping.
    /// @dev Used to prevent subsequent calls to masterchef's migrate function with the same PID.
    mapping(address => address) public migrated;

    IBentoBoxMinimal public immutable bento;
    IMasterDeployer public immutable masterDeployer;
    IPoolFactory public immutable constantProductPoolFactory;
    address public immutable masterChef;

    constructor(
        IBentoBoxMinimal _bento,
        IMasterDeployer _masterDeployer,
        IPoolFactory _constantProductPoolFactory,
        address _masterChef
    ) {
        bento = _bento;
        masterDeployer = _masterDeployer;
        constantProductPoolFactory = _constantProductPoolFactory;
        masterChef = _masterChef;
    }

    /// @notice Method to migrate MasterChef's liquidity from the legacy SushiSwap AMM to the Trident constant product pool.
    /// @param oldPool Legacy SushiSwap pool.
    /// @dev Since MasterChef has a requirement to receive the same amount of "LP" tokens back after migration we use an
    /// intermediary token so we can mint the desired balance. After unstaking users can call redeem() on the intermediary
    /// token to receive their share of the LP tokens of the new Trident constant product pool.
    function migrate(IUniswapV2Minimal oldPool) external returns (address) {
        require(msg.sender == address(masterChef), "ONLY_CHEF");
        require(migrated[address(oldPool)] == address(0), "ONLY_ONCE");

        address token0 = oldPool.token0();
        address token1 = oldPool.token1();

        bytes memory deployData = abi.encode(token0, token1, 30, false);

        IConstantProductPool pool = IConstantProductPool(constantProductPoolFactory.configAddress(keccak256(deployData)));

        // We deploy the pool if it doesn't exist yet.
        if (address(pool) == address(0)) {
            pool = IConstantProductPool(masterDeployer.deployPool(address(constantProductPoolFactory), deployData));
        }

        // We are migrating all of master chef's balance.
        uint256 lpBalance = oldPool.balanceOf(address(masterChef));

        if (lpBalance == 0) {
            return address(pool);
        }

        // Remove the liquidity and send assets to BentoBox.
        oldPool.transferFrom(address(masterChef), address(oldPool), lpBalance);
        (uint256 amount0, uint256 amount1) = oldPool.burn(address(bento));

        bento.deposit(token0, address(bento), address(pool), amount0, 0);
        bento.deposit(token1, address(bento), address(pool), amount1, 0);

        if (pool.totalSupply() != 0) {
            // We require the pools' prices to differ by no more than 0.5%.
            (uint256 _nativeReserve0, uint256 _nativeReserve1, ) = pool.getNativeReserves();
            uint256 oldPoolPrice = (1e18 * amount0) / amount1;
            uint256 newPoolPrice = (1e18 * _nativeReserve0) / _nativeReserve1;
            uint256 priceChange = (1e3 * oldPoolPrice) / newPoolPrice;
            require(priceChange < 1005 && priceChange >= 995, "PRICE_DIFFERENCE");
        }

        // We mint the intermediary token to Master Chef.
        address intermediaryToken = address(new IntermediaryToken(address(pool), masterChef, lpBalance));

        // The new Trident pool mints liquidity to the intermediary token.
        pool.mint(abi.encode(intermediaryToken));

        migrated[intermediaryToken] = address(pool);

        emit Migrate(address(oldPool), address(pool), intermediaryToken);

        return intermediaryToken;
    }
}
