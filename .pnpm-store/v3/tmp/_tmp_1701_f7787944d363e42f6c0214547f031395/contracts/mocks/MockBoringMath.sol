// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../libraries/BoringMath.sol";

contract MockBoringMath {
    using BoringMath for uint256;
    using BoringMath128 for uint128;
    using BoringMath64 for uint64;
    using BoringMath32 for uint32;

    function add(uint256 a, uint256 b) public pure returns (uint256 c) {
        c = a.add(b);
    }

    function sub(uint256 a, uint256 b) public pure returns (uint256 c) {
        c = a.sub(b);
    }

    function mul(uint256 a, uint256 b) public pure returns (uint256 c) {
        c = a.mul(b);
    }

    function to128(uint256 a) public pure returns (uint128 c) {
        c = a.to128();
    }

    function add128(uint128 a, uint128 b) public pure returns (uint128 c) {
        c = a.add(b);
    }

    function sub128(uint128 a, uint128 b) public pure returns (uint128 c) {
        c = a.sub(b);
    }

    function to64(uint256 a) public pure returns (uint64 c) {
        c = a.to64();
    }

    function add64(uint64 a, uint64 b) public pure returns (uint64 c) {
        c = a.add(b);
    }

    function sub64(uint64 a, uint64 b) public pure returns (uint64 c) {
        c = a.sub(b);
    }

    function to32(uint256 a) public pure returns (uint32 c) {
        c = a.to32();
    }

    function add32(uint32 a, uint32 b) public pure returns (uint32 c) {
        c = a.add(b);
    }

    function sub32(uint32 a, uint32 b) public pure returns (uint32 c) {
        c = a.sub(b);
    }
}
