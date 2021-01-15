// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./uniswapv2/libraries/SafeMath.sol";
import "./uniswapv2/libraries/TransferHelper.sol";
import "./interfaces/IERC20.sol";

contract SushiYieldToken {
    using SafeMathUniswap for uint256;
    using TransferHelper for address;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed sender, uint256 amount);
    event Burn(address indexed sender, uint256 amount, address indexed to);

    /**
     * @return address of YieldTokenFactory
     */
    address public factory;
    /**
     * @return address of lp token
     */
    address public lpToken;
    /**
     * @return data to be used when `mint`ing/`burn`ing
     */
    bytes public data;

    string public constant name = "SushiSwap Yield";
    string public constant symbol = "SYD";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    bytes32 public DOMAIN_SEPARATOR;
    // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
    bytes32 public constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
    mapping(address => uint256) public nonces;

    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "locked");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor() public {
        factory = msg.sender;

        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function initialize(address _lpToken, bytes memory _data) external {
        require(msg.sender == factory, "forbidden");
        lpToken = _lpToken;
        data = _data;
    }

    function _mint(address to, uint256 value) internal {
        totalSupply = totalSupply.add(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint256 value) internal {
        balanceOf[from] = balanceOf[from].sub(value);
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }

    function _approve(address owner, address spender, uint256 value) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _transfer(address from, address to, uint256 value) private {
        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint256 value) external returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        if (allowance[from][msg.sender] != uint256(-1)) {
            allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);
        }
        _transfer(from, to, value);
        return true;
    }

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(deadline >= block.timestamp, "expired");
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline))
            )
        );
        address recoveredAddress = ecrecover(digest, v, r, s);
        require(recoveredAddress != address(0) && recoveredAddress == owner, "invalid-signature");
        _approve(owner, spender, value);
    }

    function mint(address to) external lock returns (uint256 amount) {
        amount = IERC20(lpToken).balanceOf(address(this));
        require(amount > 0, "insufficient-balance");

        (bool success,) = factory.delegatecall(abi.encodeWithSignature("deposit(bytes,uint256,address)", data, amount, to));
        require(success, "failed-to-deposit");

        _mint(to, amount);

        emit Mint(msg.sender, amount);
    }

    function burn(address to) external lock returns (uint256 amount) {
        amount = balanceOf[address(this)];
        require(amount > 0, "insufficient-balance");

        (bool success,) = factory.delegatecall(abi.encodeWithSignature("withdraw(bytes,uint256,address)", data, amount, to));
        require(success, "failed-to-withdraw");

        _burn(address(this), amount);

        emit Burn(msg.sender, amount, to);
    }
}
