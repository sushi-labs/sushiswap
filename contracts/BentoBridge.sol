// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

/// @dev brief EIP 20 interface for contract bridges
interface IERC20 {
     function balanceOf(address account) external view returns (uint256);
     
     function approve(address spender, uint256 amount) external returns (bool);
     
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
    
    function transfer(address recipient, uint256 amount) external returns (bool);
    
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

interface IAaveBridge {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);

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

interface ICompoundBridge {
    function underlying() external view returns (address);
    
    function mint(uint mintAmount) external returns (uint);
    
    function redeemUnderlying(uint redeemAmount) external returns (uint);
}

contract BentoBridge {
    IAaveBridge immutable aave; // AAVE lending pool contract - 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
    IBentoBridge immutable bento; // BENTO token vault contract - 
    
    constructor(IAaveBridge _aave, IBentoBridge _bento) public {
        _bento.registerProtocol();
        aave = _aave;
        bento = _bento;
    }
    
    function approveTokenBridge(IERC20[] calldata underlying, address[] calldata cToken) external {
        for (uint256 i = 0; i < underlying.length; i++) {
            underlying[i].approve(address(aave), type(uint256).max); // max approve `aave` spender to pull `underlying` from this contract
            underlying[i].approve(address(bento), type(uint256).max); // max approve `bento` spender to pull `underlying` from this contract
            underlying[i].approve(address(cToken[i]), type(uint256).max); // max approve `cToken` spender to pull `underlying` from this contract
        }
    }
    
    /// - AAVE - ///
    function aaveToBento(address aToken, uint256 amount) external {
        IERC20(aToken).transferFrom(msg.sender, address(this), amount);
        address underlying = IAaveBridge(aToken).UNDERLYING_ASSET_ADDRESS();
        aave.withdraw(underlying, amount, address(this));
        bento.deposit(IERC20(underlying), address(this), msg.sender, amount, 0);
    }
    
    function aaveToBentoWithPermit(
        address aToken, uint256 amount, 
        uint8 v, bytes32 r, bytes32 s
    ) external {
        IERC20(aToken).permit(msg.sender, address(this), amount, now, v, r, s);
        IERC20(aToken).transferFrom(msg.sender, address(this), amount);
        address underlying = IAaveBridge(aToken).UNDERLYING_ASSET_ADDRESS();
        aave.withdraw(underlying, amount, address(this));
        bento.deposit(IERC20(underlying), address(this), msg.sender, amount, 0);
    }
    
    function bentoToAave(IERC20 underlying, uint256 amount) external {
        bento.withdraw(underlying, msg.sender, address(this), amount, 0);
        aave.deposit(address(underlying), underlying.balanceOf(address(this)), msg.sender, 0); 
    }
    
    /// - COMPOUND - ///
    function compoundToBento(address cToken, uint256 amount) external {
        IERC20(cToken).transferFrom(msg.sender, address(this), amount);
        address underlying = ICompoundBridge(cToken).underlying();
        ICompoundBridge(cToken).redeemUnderlying(amount);
        bento.deposit(IERC20(underlying), address(this), msg.sender, amount, 0);
    }
    
    function bentoToCompound(address cToken, uint256 amount) external {
        address underlying = ICompoundBridge(cToken).underlying();
        bento.withdraw(IERC20(underlying), msg.sender, address(this), amount, 0);
        ICompoundBridge(cToken).mint(amount);
        IERC20(cToken).transfer(msg.sender, IERC20(cToken).balanceOf(address(this))); 
    }
}
