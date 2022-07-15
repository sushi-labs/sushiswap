// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../interfaces/IOracle.sol";

/// @title PeggedOracle
/// @author BoringCrypto
/// @notice Oracle used for pegged prices that don't change
/// @dev
contract PeggedOracle is IOracle {
    /// @notice
    /// @dev
    /// @param rate (uint256) The fixed exchange rate
    /// @return  (bytes)
    function getDataParameter(uint256 rate) public pure returns (bytes memory) {
        return abi.encode(rate);
    }

    // Get the exchange rate
    /// @inheritdoc IOracle
    function get(bytes calldata data) public override returns (bool, uint256) {
        uint256 rate = abi.decode(data, (uint256));
        return (rate != 0, rate);
    }

    // Check the exchange rate without any state changes
    /// @inheritdoc IOracle
    function peek(bytes calldata data) public view override returns (bool, uint256) {
        uint256 rate = abi.decode(data, (uint256));
        return (rate != 0, rate);
    }

    // Check the current spot exchange rate without any state changes
    /// @inheritdoc IOracle
    function peekSpot(bytes calldata data) external view override returns (uint256 rate) {
        (, rate) = peek(data);
    }

    /// @inheritdoc IOracle
    function name(bytes calldata) public view override returns (string memory) {
        return "Pegged";
    }

    /// @inheritdoc IOracle
    function symbol(bytes calldata) public view override returns (string memory) {
        return "PEG";
    }
}
