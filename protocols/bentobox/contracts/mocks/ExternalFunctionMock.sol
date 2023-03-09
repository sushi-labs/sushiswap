// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";

contract ExternalFunctionMock {
    using BoringMath for uint256;

    event Result(uint256 output);

    function sum(uint256 a, uint256 b) external returns (uint256 c) {
        c = a.add(b);
        emit Result(c);
    }
}
