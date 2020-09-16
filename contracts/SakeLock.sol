pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SakeToken.sol";
import "./SakeMaster.sol";

contract SakeLock is ERC20("SakeLockToken", "SakeLock"), Ownable {
    using SafeMath for uint256;
    using Address for address;

    SakeToken public sake;
    SakeMaster public sakeMaster;
    address public withDrawAddr;

    constructor(SakeToken _sake, SakeMaster _sakeMaster) public {
        require(address(_sake) != address(0) && address(_sakeMaster) != address(0), "invalid address");
        sake = _sake;
        sakeMaster = _sakeMaster;
        _mint(address(this), 1);
    }

    function deposit(uint256 _pid) public onlyOwner {
        _approve(address(this), address(sakeMaster), 1);
        sakeMaster.deposit(_pid, 1);
    }

    function withdrawFromSakeMaster(uint256 _pid) public {
        sakeMaster.deposit(_pid, 0);
    }

    function withdrawToContract(uint256 _amount) public onlyOwner {
        require(withDrawAddr != address(0), "invalid address");
        uint256 totalAmount = sake.balanceOf(address(this));
        require(_amount > 0 && _amount <= totalAmount, "invalid amount");
        sake.transfer(withDrawAddr, _amount);
    }

    function setwithdrawContractAddr(address _withDrawaddr) public onlyOwner {
        withDrawAddr = _withDrawaddr;
    }
}
