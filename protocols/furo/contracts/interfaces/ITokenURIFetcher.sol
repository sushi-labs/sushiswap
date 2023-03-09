// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.10;

interface ITokenURIFetcher {
    function fetchTokenURIData(uint256 id)
        external
        view
        returns (string memory);
}
