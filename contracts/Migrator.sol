pragma solidity 0.6.12;


contract Migrator {
    address public chef;
    address public factory;

    constructor(address _chef) public {
        chef = _chef;
    }

    function migrate(address orig) public {
        require(msg.sender == chef);
        // TODO
    }
}