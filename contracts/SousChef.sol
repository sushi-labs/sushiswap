// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./uniswapv2/libraries/TransferHelper.sol";
import "./uniswapv2/libraries/SafeMath.sol";
import "./uniswapv2/interfaces/IUniswapV2ERC20.sol";
import "./SushiYieldToken.sol";

interface IYieldTokenFactory {
    function getYieldToken(uint256 pid) external view returns (address yieldToken);
}

contract SousChef {
    using TransferHelper for address;
    using SafeMathUniswap for uint;

    event Deposited(address yieldToken, uint256 amount, address to);
    event Withdrawn(address yieldToken, uint256 amount, address to);

    address public factory;
    address public weth;

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'expired');
        _;
    }

    constructor(address _yieldTokenFactory) public {
        factory = _yieldTokenFactory;
    }

    function depositMultipleWithPermit(
        uint256[] calldata pids,
        uint256[] calldata amounts,
        address to,
        uint256 deadline,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) external ensure(deadline) {
        for (uint256 i = 0; i < pids.length; i++) {
            address yieldToken = _getYieldToken(pids[i]);
            _depositWithPermit(yieldToken, amounts[i], to, deadline, v[i], r[i], s[i]);
        }
    }

    function depositWithPermit(
        uint256 pid,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external ensure(deadline) {
        address yieldToken = _getYieldToken(pid);
        _depositWithPermit(yieldToken, amount, to, deadline, v, r, s);
    }

    function _depositWithPermit(
        address yieldToken,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        address lpToken = SushiYieldToken(yieldToken).lpToken();
        _permit(lpToken, amount, deadline, v, r, s);
        _deposit(yieldToken, amount, to);
    }

    function deposit(
        uint256 pid,
        uint256 amount,
        address to
    ) external {
        address yieldToken = _getYieldToken(pid);
        _deposit(yieldToken, amount, to);
    }

    function _deposit(
        address yieldToken,
        uint256 amount,
        address to
    ) internal {
        address lpToken = SushiYieldToken(yieldToken).lpToken();
        lpToken.safeTransferFrom(msg.sender, yieldToken, amount);
        SushiYieldToken(yieldToken).mint(to);

        emit Deposited(yieldToken, amount, to);
    }

    function withdrawMultipleWithPermit(
        uint256[] calldata pids,
        uint256[] calldata amounts,
        address to,
        uint256 deadline,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) external ensure(deadline) {
        for (uint256 i = 0; i < pids.length; i++) {
            address yieldToken = _getYieldToken(pids[i]);
            _withdrawWithPermit(yieldToken, amounts[i], to, deadline, v[i], r[i], s[i]);
        }
    }

    function withdrawWithPermit(
        uint256 pid,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external ensure(deadline) {
        address yieldToken = _getYieldToken(pid);
        _withdrawWithPermit(yieldToken, amount, to, deadline, v, r, s);
    }

    function _withdrawWithPermit(
        address yieldToken,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        _permit(yieldToken, amount, deadline, v, r, s);
        _withdraw(yieldToken, amount, to);
    }

    function withdraw(
        uint256 pid,
        uint256 amount,
        address to
    ) external {
        address yieldToken = _getYieldToken(pid);
        _withdraw(yieldToken, amount, to);
    }

    function _withdraw(
        address yieldToken,
        uint256 amount,
        address to
    ) internal {
        yieldToken.safeTransferFrom(msg.sender, yieldToken, amount);
        SushiYieldToken(yieldToken).burn(to);

        emit Withdrawn(yieldToken, amount, to);
    }

    function _getYieldToken(uint256 pid) internal view returns (address) {
        address yieldToken = IYieldTokenFactory(factory).getYieldToken(pid);
        require(yieldToken != address(0), "invalid-pid");
        return yieldToken;
    }

    function _permit(address token, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) internal {
        IUniswapV2ERC20(token).permit(msg.sender, address(this), amount, deadline, v, r, s);
    }
}
