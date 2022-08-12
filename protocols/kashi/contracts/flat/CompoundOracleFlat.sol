// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

// File @boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol@v1.2.1
// License-Identifier: MIT

/// @notice A library for performing overflow-/underflow-safe math,
/// updated with awesomeness from of DappHub (https://github.com/dapphub/ds-math).
library BoringMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require((c = a + b) >= b, "BoringMath: Add Overflow");
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require((c = a - b) <= a, "BoringMath: Underflow");
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require(b == 0 || (c = a * b) / b == a, "BoringMath: Mul Overflow");
    }

    function to128(uint256 a) internal pure returns (uint128 c) {
        require(a <= uint128(-1), "BoringMath: uint128 Overflow");
        c = uint128(a);
    }

    function to64(uint256 a) internal pure returns (uint64 c) {
        require(a <= uint64(-1), "BoringMath: uint64 Overflow");
        c = uint64(a);
    }

    function to32(uint256 a) internal pure returns (uint32 c) {
        require(a <= uint32(-1), "BoringMath: uint32 Overflow");
        c = uint32(a);
    }
}

/// @notice A library for performing overflow-/underflow-safe addition and subtraction on uint128.
library BoringMath128 {
    function add(uint128 a, uint128 b) internal pure returns (uint128 c) {
        require((c = a + b) >= b, "BoringMath: Add Overflow");
    }

    function sub(uint128 a, uint128 b) internal pure returns (uint128 c) {
        require((c = a - b) <= a, "BoringMath: Underflow");
    }
}

/// @notice A library for performing overflow-/underflow-safe addition and subtraction on uint64.
library BoringMath64 {
    function add(uint64 a, uint64 b) internal pure returns (uint64 c) {
        require((c = a + b) >= b, "BoringMath: Add Overflow");
    }

    function sub(uint64 a, uint64 b) internal pure returns (uint64 c) {
        require((c = a - b) <= a, "BoringMath: Underflow");
    }
}

/// @notice A library for performing overflow-/underflow-safe addition and subtraction on uint32.
library BoringMath32 {
    function add(uint32 a, uint32 b) internal pure returns (uint32 c) {
        require((c = a + b) >= b, "BoringMath: Add Overflow");
    }

    function sub(uint32 a, uint32 b) internal pure returns (uint32 c) {
        require((c = a - b) <= a, "BoringMath: Underflow");
    }
}

// File contracts/interfaces/IOracle.sol
// License-Identifier: MIT

interface IOracle {
    /// @notice Get the latest exchange rate.
    /// @param data Usually abi encoded, implementation specific data that contains information and arguments to & about the oracle.
    /// For example:
    /// (string memory collateralSymbol, string memory assetSymbol, uint256 division) = abi.decode(data, (string, string, uint256));
    /// @return success if no valid (recent) rate is available, return false else true.
    /// @return rate The rate of the requested asset / pair / pool.
    function get(bytes calldata data) external returns (bool success, uint256 rate);

    /// @notice Check the last exchange rate without any state changes.
    /// @param data Usually abi encoded, implementation specific data that contains information and arguments to & about the oracle.
    /// For example:
    /// (string memory collateralSymbol, string memory assetSymbol, uint256 division) = abi.decode(data, (string, string, uint256));
    /// @return success if no valid (recent) rate is available, return false else true.
    /// @return rate The rate of the requested asset / pair / pool.
    function peek(bytes calldata data) external view returns (bool success, uint256 rate);

    /// @notice Check the current spot exchange rate without any state changes. For oracles like TWAP this will be different from peek().
    /// @param data Usually abi encoded, implementation specific data that contains information and arguments to & about the oracle.
    /// For example:
    /// (string memory collateralSymbol, string memory assetSymbol, uint256 division) = abi.decode(data, (string, string, uint256));
    /// @return rate The rate of the requested asset / pair / pool.
    function peekSpot(bytes calldata data) external view returns (uint256 rate);

    /// @notice Returns a human readable (short) name about this oracle.
    /// @param data Usually abi encoded, implementation specific data that contains information and arguments to & about the oracle.
    /// For example:
    /// (string memory collateralSymbol, string memory assetSymbol, uint256 division) = abi.decode(data, (string, string, uint256));
    /// @return (string) A human readable symbol name about this oracle.
    function symbol(bytes calldata data) external view returns (string memory);

    /// @notice Returns a human readable name about this oracle.
    /// @param data Usually abi encoded, implementation specific data that contains information and arguments to & about the oracle.
    /// For example:
    /// (string memory collateralSymbol, string memory assetSymbol, uint256 division) = abi.decode(data, (string, string, uint256));
    /// @return (string) A human readable name about this oracle.
    function name(bytes calldata data) external view returns (string memory);
}

// File contracts/oracles/CompoundOracle.sol
// License-Identifier: MIT

interface IUniswapAnchoredView {
    function price(string memory symbol) external view returns (uint256);
}

contract CompoundOracleV1 is IOracle {
    using BoringMath for uint256;

    IUniswapAnchoredView private constant ORACLE = IUniswapAnchoredView(0x922018674c12a7F0D394ebEEf9B58F186CdE13c1);

    struct PriceInfo {
        uint128 price;
        uint128 blockNumber;
    }

    mapping(string => PriceInfo) public prices;

    function _peekPrice(string memory symbol) internal view returns (uint256) {
        if (bytes(symbol).length == 0) {
            return 1000000;
        } // To allow only using collateralSymbol or assetSymbol if paired against USDx
        PriceInfo memory info = prices[symbol];
        if (block.number > info.blockNumber + 8) {
            return uint128(ORACLE.price(symbol)); // Prices are denominated with 6 decimals, so will fit in uint128
        }
        return info.price;
    }

    function _getPrice(string memory symbol) internal returns (uint256) {
        if (bytes(symbol).length == 0) {
            return 1000000;
        } // To allow only using collateralSymbol or assetSymbol if paired against USDx
        PriceInfo memory info = prices[symbol];
        if (block.number > info.blockNumber + 8) {
            info.price = uint128(ORACLE.price(symbol)); // Prices are denominated with 6 decimals, so will fit in uint128
            info.blockNumber = uint128(block.number); // Blocknumber will fit in uint128
            prices[symbol] = info;
        }
        return info.price;
    }

    function getDataParameter(
        string memory collateralSymbol,
        string memory assetSymbol,
        uint256 division
    ) public pure returns (bytes memory) {
        return abi.encode(collateralSymbol, assetSymbol, division);
    }

    // Get the latest exchange rate
    /// @inheritdoc IOracle
    function get(bytes calldata data) public override returns (bool, uint256) {
        (string memory collateralSymbol, string memory assetSymbol, uint256 division) = abi.decode(data, (string, string, uint256));
        return (true, uint256(1e36).mul(_getPrice(assetSymbol)) / _getPrice(collateralSymbol) / division);
    }

    // Check the last exchange rate without any state changes
    /// @inheritdoc IOracle
    function peek(bytes calldata data) public view override returns (bool, uint256) {
        (string memory collateralSymbol, string memory assetSymbol, uint256 division) = abi.decode(data, (string, string, uint256));
        return (true, uint256(1e36).mul(_peekPrice(assetSymbol)) / _peekPrice(collateralSymbol) / division);
    }

    // Check the current spot exchange rate without any state changes
    /// @inheritdoc IOracle
    function peekSpot(bytes calldata data) external view override returns (uint256 rate) {
        (, rate) = peek(data);
    }

    /// @inheritdoc IOracle
    function name(bytes calldata) public view override returns (string memory) {
        return "Compound";
    }

    /// @inheritdoc IOracle
    function symbol(bytes calldata) public view override returns (string memory) {
        return "COMP";
    }
}
