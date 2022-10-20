// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "../libraries/RebaseLibrary.sol";
import "../libraries/SafeCast.sol";

contract RebasingMock {

    using SafeCast for uint256;
    using RebaseLibrary for Rebase;

    Rebase public total;

    function toBase(uint256  elastic) public view returns (uint256 base) {
        base =  total.toBase(elastic);
    }

    function toElastic(uint256 base) public view returns (uint256 elastic) {
        elastic = total.toElastic(base);
    }

    function set(uint256 elastic, uint256 base) public {
        total.elastic = elastic.toUint128();
        total.base = base.toUint128();
    }
    function reset() public {
        total.elastic = 0;
        total.base = 0;
    }
}
