// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../interfaces/IOracle.sol";
import "@boringcrypto/boring-solidity/contracts/interfaces/IERC20.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";

interface IAggregator {
    function latestAnswer() external view returns (int256 answer);
}

/// @title xSUSHIOracle
/// @author BoringCrypto
/// @notice Oracle used for getting the price of xSUSHI based on Chainlink
/// @dev
contract xSUSHIOracle is IOracle {
    using BoringMath for uint256; // Keep everything in uint256

    IERC20 public immutable sushi;
    IERC20 public immutable bar;
    IAggregator public immutable sushiOracle;

    constructor(
        IERC20 sushi_,
        IERC20 bar_,
        IAggregator sushiOracle_
    ) public {
        sushi = sushi_;
        bar = bar_;
        sushiOracle = sushiOracle_;
    }

    // Calculates the lastest exchange rate
    // Uses sushi rate and xSUSHI conversion and divide for any conversion other than from SUSHI to ETH
    function _get(address divide, uint256 decimals) internal view returns (uint256) {
        uint256 price = uint256(1e36);
        price = (price.mul(uint256(sushiOracle.latestAnswer())) / bar.totalSupply()).mul(sushi.balanceOf(address(bar)));

        if (divide != address(0)) {
            price = price / uint256(IAggregator(divide).latestAnswer());
        }

        return price / decimals;
    }

    function getDataParameter(address divide, uint256 decimals) public pure returns (bytes memory) {
        return abi.encode(divide, decimals);
    }

    // Get the latest exchange rate
    /// @inheritdoc IOracle
    function get(bytes calldata data) public override returns (bool, uint256) {
        (address divide, uint256 decimals) = abi.decode(data, (address, uint256));
        return (true, _get(divide, decimals));
    }

    // Check the last exchange rate without any state changes
    /// @inheritdoc IOracle
    function peek(bytes calldata data) public view override returns (bool, uint256) {
        (address divide, uint256 decimals) = abi.decode(data, (address, uint256));
        return (true, _get(divide, decimals));
    }

    // Check the current spot exchange rate without any state changes
    /// @inheritdoc IOracle
    function peekSpot(bytes calldata data) external view override returns (uint256 rate) {
        (, rate) = peek(data);
    }

    /// @inheritdoc IOracle
    function name(bytes calldata) public view override returns (string memory) {
        return "xSUSHI Chainlink";
    }

    /// @inheritdoc IOracle
    function symbol(bytes calldata) public view override returns (string memory) {
        return "xSUSHI-LINK";
    }
}
