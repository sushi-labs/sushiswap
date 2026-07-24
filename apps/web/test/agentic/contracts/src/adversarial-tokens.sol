// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

abstract contract TestTokenBase {
    string internal tokenName;
    string internal tokenSymbol;
    uint8 internal tokenDecimals;
    uint256 public totalSupply;
    mapping(address => uint256) internal balances;
    mapping(address => mapping(address => uint256)) public allowance;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        tokenName = name_;
        tokenSymbol = symbol_;
        tokenDecimals = decimals_;
        _mint(msg.sender, 1_000_000 * 10 ** decimals_);
    }

    function name() external view virtual returns (string memory) {
        return tokenName;
    }

    function symbol() external view virtual returns (string memory) {
        return tokenSymbol;
    }

    function decimals() external view virtual returns (uint8) {
        return tokenDecimals;
    }

    function balanceOf(address account) public view virtual returns (uint256) {
        return balances[account];
    }

    function approve(address spender, uint256 amount) public virtual returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external virtual returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external virtual returns (bool) {
        uint256 available = allowance[from][msg.sender];
        require(available >= amount, "insufficient allowance");
        if (available != type(uint256).max) {
            allowance[from][msg.sender] = available - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(balances[from] >= amount, "insufficient balance");
        balances[from] -= amount;
        balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}

contract NoReturnApproveToken is TestTokenBase {
    constructor() TestTokenBase("No Return Approve", "NRA", 18) {}

    function approve(address spender, uint256 amount) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        assembly {
            return(0, 0)
        }
    }
}

contract FalseApproveToken is TestTokenBase {
    constructor() TestTokenBase("False Approve", "FALSE", 18) {}

    function approve(address spender, uint256 amount) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return false;
    }
}

contract ZeroFirstApproveToken is TestTokenBase {
    constructor() TestTokenBase("Zero First", "ZERO1", 6) {}

    function approve(address spender, uint256 amount) public override returns (bool) {
        require(amount == 0 || allowance[msg.sender][spender] == 0, "reset allowance to zero");
        return super.approve(spender, amount);
    }
}

contract RejectMaxApproveToken is TestTokenBase {
    constructor() TestTokenBase("Reject Max", "NOMAX", 18) {}

    function approve(address spender, uint256 amount) public override returns (bool) {
        require(amount != type(uint256).max, "max approval rejected");
        return super.approve(spender, amount);
    }
}

contract HighGasApproveToken is TestTokenBase {
    uint256 public approvalWork = 256;
    uint256 public sink;

    constructor() TestTokenBase("High Gas Approve", "GAS", 18) {}

    function setApprovalWork(uint256 work) external {
        require(work <= 2048, "work too high");
        approvalWork = work;
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        uint256 value = sink;
        for (uint256 index; index < approvalWork; ++index) {
            value = uint256(keccak256(abi.encode(value, index, spender, amount)));
        }
        sink = value;
        return super.approve(spender, amount);
    }
}

contract ConfigurableTransferToken is TestTokenBase {
    address public owner;
    bool public paused;
    uint16 public feeBps;
    uint256 public maxWallet;
    uint256 public cooldownSeconds;
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public feeExemptSender;
    mapping(address => bool) public feeExemptRecipient;
    mapping(address => uint256) public lastTransferAt;

    constructor() TestTokenBase("Configurable Transfer", "QUIRK", 9) {
        owner = msg.sender;
        maxWallet = type(uint256).max;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function configure(uint16 feeBps_, uint256 maxWallet_, uint256 cooldownSeconds_) external onlyOwner {
        require(feeBps_ <= 2_000, "fee too high");
        feeBps = feeBps_;
        maxWallet = maxWallet_;
        cooldownSeconds = cooldownSeconds_;
    }

    function setPaused(bool value) external onlyOwner {
        paused = value;
    }

    function setBlacklist(address account, bool value) external onlyOwner {
        blacklisted[account] = value;
    }

    function setFeeExempt(address account, bool sender, bool recipient) external onlyOwner {
        feeExemptSender[account] = sender;
        feeExemptRecipient[account] = recipient;
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        require(!paused, "paused");
        require(!blacklisted[from] && !blacklisted[to], "blacklisted");
        require(block.timestamp >= lastTransferAt[from] + cooldownSeconds, "cooldown");
        uint256 fee = feeExemptSender[from] || feeExemptRecipient[to]
            ? 0
            : amount * feeBps / 10_000;
        uint256 received = amount - fee;
        require(balances[to] + received <= maxWallet, "max wallet");
        lastTransferAt[from] = block.timestamp;
        super._transfer(from, to, received);
        if (fee > 0) {
            super._transfer(from, address(0xdead), fee);
        }
    }
}

contract RebaseToken is TestTokenBase {
    uint256 public multiplier = 1e18;

    constructor() TestTokenBase("Rebase Token", "REBASE", 18) {}

    function rebase(uint256 multiplier_) external {
        require(multiplier_ >= 5e17 && multiplier_ <= 2e18, "unsafe multiplier");
        multiplier = multiplier_;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return balances[account] * multiplier / 1e18;
    }
}

contract RevertingMetadataToken is TestTokenBase {
    constructor() TestTokenBase("unused", "unused", 18) {}

    function name() external pure override returns (string memory) {
        revert("name unavailable");
    }

    function symbol() external pure override returns (string memory) {
        revert("symbol unavailable");
    }

    function decimals() external pure override returns (uint8) {
        revert("decimals unavailable");
    }
}

contract Bytes32MetadataToken {
    bytes32 public constant name = "Bytes32 Metadata";
    bytes32 public constant symbol = "B32";
    uint8 public constant decimals = 18;
    uint256 public totalSupply = 1_000_000 ether;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract LongMetadataToken is TestTokenBase {
    constructor()
        TestTokenBase(
            "This token name is intentionally much longer than normal metadata rendered in a selector",
            "AN-INTENTIONALLY-LONG-SYMBOL-FOR-LAYOUT-TESTING",
            18
        )
    {}
}
