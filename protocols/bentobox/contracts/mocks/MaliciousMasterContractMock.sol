// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "@boringcrypto/boring-solidity/contracts/interfaces/IMasterContract.sol";
import "../BentoBox.sol";

contract MaliciousMasterContractMock is IMasterContract {
    function init(bytes calldata) external payable override {
        return;
    }

    function attack(BentoBox bentoBox) public {
        bentoBox.setMasterContractApproval(address(this), address(this), true, 0, 0, 0);
    }
}
