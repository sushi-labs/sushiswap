// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

// File @boringcrypto/boring-solidity/contracts/interfaces/IERC20.sol@v1.2.0
// License-Identifier: MIT

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /// @notice EIP 2612
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

// File @boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol@v1.2.0
// License-Identifier: MIT

library BoringERC20 {
    bytes4 private constant SIG_SYMBOL = 0x95d89b41; // symbol()
    bytes4 private constant SIG_NAME = 0x06fdde03; // name()
    bytes4 private constant SIG_DECIMALS = 0x313ce567; // decimals()
    bytes4 private constant SIG_TRANSFER = 0xa9059cbb; // transfer(address,uint256)
    bytes4 private constant SIG_TRANSFER_FROM = 0x23b872dd; // transferFrom(address,address,uint256)

    /// @notice Provides a safe ERC20.transfer version for different ERC-20 implementations.
    /// Reverts on a failed transfer.
    /// @param token The address of the ERC-20 token.
    /// @param to Transfer tokens to.
    /// @param amount The token amount.
    function safeTransfer(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(SIG_TRANSFER, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "BoringERC20: Transfer failed");
    }

    /// @notice Provides a safe ERC20.transferFrom version for different ERC-20 implementations.
    /// Reverts on a failed transfer.
    /// @param token The address of the ERC-20 token.
    /// @param from Transfer tokens from.
    /// @param to Transfer tokens to.
    /// @param amount The token amount.
    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 amount
    ) internal {
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(SIG_TRANSFER_FROM, from, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "BoringERC20: TransferFrom failed");
    }
}

/// @notice interface for `aave` deposit and withdraw
interface IAaveBridge {
    function deposit( 
        address asset, 
        uint256 amount, 
        address onBehalfOf, 
        uint16 referralCode
    ) external;

    function withdraw( 
        address token, 
        uint256 amount, 
        address destination
    ) external;
}

/// @notice interface for `bento` deposit and withdraw
interface IBentoBridge {
    function registerProtocol() external;

    function deposit( 
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external payable returns (uint256 amountOut, uint256 shareOut);

    function withdraw(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external returns (uint256 amountOut, uint256 shareOut);
}

/// @notice interface for `cToken` deposit and withdraw
interface ICompoundBridge {
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
}

/// @notice interface for `dai` deposit via `permit()` primitive
interface IDAIPermit {
    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract BentoBridge {
    using BoringERC20 for IERC20;

    IAaveBridge immutable aave; // AAVE lending contract - 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
    IBentoBridge immutable bento; // BENTO vault contract - 0xF5BCE5077908a1b7370B9ae04AdC565EBd643966
    address immutable dai; // DAI token contract - 0x6B175474E89094C44Da98b954EedeAC495271d0F

    constructor(IAaveBridge _aave, IBentoBridge _bento, address _dai) public {
        _bento.registerProtocol();
        aave = _aave;
        bento = _bento;
        dai = _dai;
    }
    
    function approveTokenBridge(IERC20[] calldata underlying, address[] calldata cToken) external {
        for (uint256 i = 0; i < underlying.length; i++) {
            underlying[i].approve(address(aave), type(uint256).max); // max approve `aave` spender to pull `underlying` from this contract
            underlying[i].approve(address(bento), type(uint256).max); // max approve `bento` spender to pull `underlying` from this contract
            underlying[i].approve(cToken[i], type(uint256).max); // max approve `cToken` spender to pull `underlying` from this contract
        }
    }

    /// - AAVE - ///
    function aaveToBento(IERC20 aToken, IERC20 underlying, uint256 amount) external { // `underlying` is param to save from reading storage - if wrong, tx will fail
        aToken.safeTransferFrom(msg.sender, address(this), amount);
        aave.withdraw(address(underlying), amount, address(this));
        bento.deposit(underlying, address(this), msg.sender, amount, 0);
    }

    function aaveToBentoWithPermit(
        IERC20 aToken, IERC20 underlying, uint256 amount, 
        uint8 v, bytes32 r, bytes32 s
    ) external {
        aToken.permit(msg.sender, address(this), amount, now, v, r, s);
        aToken.safeTransferFrom(msg.sender, address(this), amount);
        aave.withdraw(address(underlying), amount, address(this));
        bento.deposit(underlying, address(this), msg.sender, amount, 0);
    }

    function bentoToAave(IERC20 underlying, uint256 amount) external {
        bento.withdraw(underlying, msg.sender, address(this), amount, 0);
        aave.deposit(address(underlying), underlying.balanceOf(address(this)), msg.sender, 0); 
    }

    /// - COMPOUND - ///
    function compoundToBento(address cToken, IERC20 underlying, uint256 amount) external {
        IERC20(cToken).safeTransferFrom(msg.sender, address(this), amount);
        ICompoundBridge(cToken).redeem(amount);
        bento.deposit(underlying, address(this), msg.sender, underlying.balanceOf(address(this)), 0);
    }

    function bentoToCompound(address cToken, IERC20 underlying, uint256 amount) external {
        bento.withdraw(underlying, msg.sender, address(this), amount, 0);
        ICompoundBridge(cToken).mint(amount);
        IERC20(cToken).safeTransfer(msg.sender, IERC20(cToken).balanceOf(address(this))); 
    }
    
    /// - DAI - ///
    function daiToBentoWithPermit(
        uint256 amount, uint256 nonce, 
        uint8 v, bytes32 r, bytes32 s
    ) external {
        IDAIPermit(dai).permit(msg.sender, address(this), nonce, now, true, v, r, s);
        IERC20(dai).safeTransferFrom(msg.sender, address(this), amount);
        bento.deposit(IERC20(dai), address(this), msg.sender, amount, 0);
    }
}
