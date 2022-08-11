// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.10;

import './interfaces/IFuroStream.sol';

contract FuroStreamRouter is Multicall {
  IBentoBoxMinimal public immutable bentoBox;
  IFuroStream public immutable furoStream;

  // custom errors
  error InsufficientShares();

  constructor(IBentoBoxMinimal _bentoBox, IFuroStream _furoStream) {
    bentoBox = _bentoBox;
    furoStream = _furoStream;
    _bentoBox.registerProtocol();
    _bentoBox.setMasterContractApproval(address(this), address(_furoStream), true, 0, bytes32(0), bytes32(0));
  }

  function setBentoBoxApproval(
    address user,
    bool approved,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external payable {
    bentoBox.setMasterContractApproval(user, address(this), approved, v, r, s);
  }

  function createStream(
    address recipient,
    address token,
    uint64 startTime,
    uint64 endTime,
    uint256 amount, /// @dev in token amount and not in shares
    bool fromBentoBox,
    uint256 minShare
  ) external payable returns (uint256 streamId, uint256 depositedShares) {
    depositedShares = _depositToken(token, msg.sender, address(this), amount, fromBentoBox);

    if (depositedShares < minShare) revert InsufficientShares();

    (streamId, ) = furoStream.createStream(recipient, token, startTime, endTime, amount, true);

    furoStream.updateSender(streamId, msg.sender);
  }

  function _depositToken(
    address token,
    address from,
    address to,
    uint256 amount,
    bool fromBentoBox
  ) internal returns (uint256 depositedShares) {
    if (fromBentoBox) {
      depositedShares = bentoBox.toShare(token, amount, false);
      bentoBox.transfer(token, from, to, depositedShares);
    } else {
      (, depositedShares) = bentoBox.deposit{value: token == address(0) ? amount : 0}(token, from, to, amount, 0);
    }
  }
}
