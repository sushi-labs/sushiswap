// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../BentoBox.sol";

// An example a contract that stores tokens in the BentoBox.
// A single contract that users can approve for the BentoBox, hence the registerProtocol call.
// PS. This isn't good code, just kept it simple to illustrate usage.
contract HelloWorld {
    BentoBox public bentoBox;
    IERC20 public token;

    constructor(BentoBox _bentoBox, IERC20 _token) public {
        bentoBox = _bentoBox;
        token = _token;
        bentoBox.registerProtocol();
    }

    mapping(address => uint256) public bentoBoxShares;

    // Deposits an amount of token into the BentoBox. BentoBox shares are given to the HelloWorld contract and
    // assigned to the user in bentoBoxShares.
    // Don't deposit twice, you'll lose the first deposit ;)
    function deposit(uint256 amount) public {
        (, bentoBoxShares[msg.sender]) = bentoBox.deposit(token, msg.sender, address(this), amount, 0);
    }

    // This will return the current value in amount of the BentoBox shares.
    // Through flash loans and maybe a strategy, the value can go up over time.
    function balance() public view returns (uint256 amount) {
        return bentoBox.toAmount(token, bentoBoxShares[msg.sender], false);
    }

    // Withdraw all shares from the BentoBox and receive the token.
    function withdraw() public {
        bentoBox.withdraw(token, address(this), msg.sender, 0, bentoBoxShares[msg.sender]);
    }
}
