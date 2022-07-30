// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import "@boringcrypto/boring-solidity/contracts/interfaces/IERC20.sol";
import "@sushiswap/bentobox-sdk/contracts/IBentoBoxV1.sol";
import "./IOracle.sol";
import "./ISwapper.sol";

interface IKashiPair {
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event LogAccrue(uint256 accruedAmount, uint256 feeFraction, uint64 rate, uint256 utilization);
    event LogAddAsset(address indexed from, address indexed to, uint256 share, uint256 fraction);
    event LogAddCollateral(address indexed from, address indexed to, uint256 share);
    event LogBorrow(address indexed from, address indexed to, uint256 amount, uint256 part);
    event LogExchangeRate(uint256 rate);
    event LogFeeTo(address indexed newFeeTo);
    event LogRemoveAsset(address indexed from, address indexed to, uint256 share, uint256 fraction);
    event LogRemoveCollateral(address indexed from, address indexed to, uint256 share);
    event LogRepay(address indexed from, address indexed to, uint256 amount, uint256 part);
    event LogWithdrawFees(address indexed feeTo, uint256 feesEarnedFraction);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function DOMAIN_SEPARATOR() external view returns (bytes32);

    function accrue() external;

    function accrueInfo()
        external
        view
        returns (
            uint64 interestPerSecond,
            uint64 lastBlockAccrued,
            uint128 feesEarnedFraction
        );

    function addAsset(
        address to,
        bool skim,
        uint256 share
    ) external returns (uint256 fraction);

    function addCollateral(
        address to,
        bool skim,
        uint256 share
    ) external;

    function allowance(address, address) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function asset() external view returns (IERC20);

    function balanceOf(address) external view returns (uint256);

    function bentoBox() external view returns (IBentoBoxV1);

    function borrow(address to, uint256 amount) external returns (uint256 part, uint256 share);

    function claimOwnership() external;

    function collateral() external view returns (IERC20);

    function cook(
        uint8[] calldata actions,
        uint256[] calldata values,
        bytes[] calldata datas
    ) external payable returns (uint256 value1, uint256 value2);

    function decimals() external view returns (uint8);

    function exchangeRate() external view returns (uint256);

    function feeTo() external view returns (address);

    function getInitData(
        IERC20 collateral_,
        IERC20 asset_,
        IOracle oracle_,
        bytes calldata oracleData_
    ) external pure returns (bytes memory data);

    function init(bytes calldata data) external payable;

    function isSolvent(address user, bool open) external view returns (bool);

    function liquidate(
        address[] calldata users,
        uint256[] calldata borrowParts,
        address to,
        ISwapper swapper,
        bool open
    ) external;

    function masterContract() external view returns (address);

    function name() external view returns (string memory);

    function nonces(address) external view returns (uint256);

    function oracle() external view returns (IOracle);

    function oracleData() external view returns (bytes memory);

    function owner() external view returns (address);

    function pendingOwner() external view returns (address);

    function permit(
        address owner_,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function removeAsset(address to, uint256 fraction) external returns (uint256 share);

    function removeCollateral(address to, uint256 share) external;

    function repay(
        address to,
        bool skim,
        uint256 part
    ) external returns (uint256 amount);

    function setFeeTo(address newFeeTo) external;

    function setSwapper(ISwapper swapper, bool enable) external;

    function swappers(ISwapper) external view returns (bool);

    function symbol() external view returns (string memory);

    function totalAsset() external view returns (uint128 elastic, uint128 base);

    function totalBorrow() external view returns (uint128 elastic, uint128 base);

    function totalCollateralShare() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transferOwnership(
        address newOwner,
        bool direct,
        bool renounce
    ) external;

    function updateExchangeRate() external returns (bool updated, uint256 rate);

    function userBorrowPart(address) external view returns (uint256);

    function userCollateralShare(address) external view returns (uint256);

    function withdrawFees() external;
}
