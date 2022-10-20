// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "../interfaces/IPool.sol";
import "../interfaces/ITridentCallee.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IBentoBoxMinimal.sol";
import "hardhat/console.sol";

contract FlashSwapMock {
    IBentoBoxMinimal public immutable bento;

    constructor(IBentoBoxMinimal _bento) {
        bento = _bento;
    }

    function testFlashSwap(IPool pair, bytes calldata data) external {
        pair.flashSwap(data);
    }

    function tridentSwapCallback(bytes calldata data) external {
        (bool success, address token, bool viaBento) = abi.decode(data, (bool, address, bool));
        if (success) {
            if (viaBento) {
                uint256 tokenBalanceBento = bento.balanceOf(token, address(this));
                bento.transfer(token, address(this), msg.sender, tokenBalanceBento);
            } else {
                uint256 tokenBalance = IERC20(token).balanceOf(address(this));
                IERC20(token).transfer(address(bento), tokenBalance);
                bento.deposit(token, address(bento), msg.sender, tokenBalance, 0);
            }
        }
    }
}
