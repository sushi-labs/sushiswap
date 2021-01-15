// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./uniswapv2/libraries/TransferHelper.sol";
import "./interfaces/IERC20.sol";
import "./SushiYieldToken.sol";

interface IMasterChef {
    struct PoolInfo {
        address lpToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 accSushiPerShare;
    }

    function sushi() external view returns (address);

    function poolInfo(uint256 index) external view returns (
        address lpToken,
        uint256 allocPoint,
        uint256 lastRewardBlock,
        uint256 accSushiPerShare
    );

    function deposit(uint256 pid, uint256 amount) external;

    function withdraw(uint256 pid, uint256 amount) external;
}

contract YieldTokenFactory {
    using TransferHelper for address;

    event YieldTokenCreated(uint256 pid, address token);

    /**
     * @return address of `MasterChef`
     */
    address public masterChef;

    /**
     * @return address of `SushiToken`
     */
    address public sushi;

    /**
     * @return address of `SushiYieldToken` for `pid`
     */
    mapping(uint256 => address) public getYieldToken;

    constructor(address _masterChef) public {
        masterChef = _masterChef;
        sushi = IMasterChef(_masterChef).sushi();
    }

    /**
     * @return init hash of `SushiYieldToken`
     */
    function yieldTokenCodeHash() external pure returns (bytes32) {
        return keccak256(type(SushiYieldToken).creationCode);
    }

    /**
     * @notice create a new `SushiYieldToken` for `pid`
     *
     * @return token created token's address
     */
    function createYieldToken(uint256 pid) external returns (address token) {
        require(getYieldToken[pid] == address(0), "already-created");

        bytes memory bytecode = type(SushiYieldToken).creationCode;
        bytes memory data = abi.encodePacked(pid);
        bytes32 salt = keccak256(data);
        assembly {
            token := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        (address lpToken,,,) = IMasterChef(masterChef).poolInfo(pid);
        SushiYieldToken(token).initialize(lpToken, data);
        getYieldToken[pid] = token;

        emit YieldTokenCreated(pid, token);
    }

    /**
     * @notice deposit lp token (meant to be `delegatecall`ed by `SushiYieldToken`)
     *
     * @param data encoded `pid`
     * @param amount amount of lp tokens
     * @param to receiver of sushi rewards
     */
    function deposit(bytes memory data, uint256 amount, address to) external {
        uint256 pid = abi.decode(data, (uint256));
        (address lpToken,,,) = IMasterChef(masterChef).poolInfo(pid);
        lpToken.safeApprove(masterChef, amount);
        IMasterChef(masterChef).deposit(pid, amount);
        _transferBalance(sushi, to);
    }

    /**
     * @notice withdraw lp tokens (meant to be `delegatecall`ed by `SushiYieldToken`)
     *
     * @param data encoded `pid`
     * @param amount amount of lp tokens
     * @param to receiver of lp tokens
     */
    function withdraw(bytes memory data, uint256 amount, address to) external {
        uint256 pid = abi.decode(data, (uint256));
        (address lpToken,,,) = IMasterChef(masterChef).poolInfo(pid);
        IMasterChef(masterChef).withdraw(pid, amount);
        _transferBalance(lpToken, to);
        _transferBalance(sushi, to);
    }

    function _transferBalance(address token, address to) internal {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance > 0) {
            token.safeTransfer(to, balance);
        }
    }
}
