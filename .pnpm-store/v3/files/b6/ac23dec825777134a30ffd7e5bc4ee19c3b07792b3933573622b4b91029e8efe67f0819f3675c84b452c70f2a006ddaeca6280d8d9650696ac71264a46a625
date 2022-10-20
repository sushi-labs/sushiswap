// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

contract PoolTemplateMock {
    address public immutable token0;
    address public immutable token1;
    constructor(bytes memory _deployData) {
        (address _token0, address _token1) = abi.decode(
            _deployData,
            (address, address)
        );
        token0 = _token0;
        token1 = _token1;
    }
}
