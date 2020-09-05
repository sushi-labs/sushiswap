const { expectRevert, time } = require('@openzeppelin/test-helpers');
const ethers = require('ethers');
const SakeToken = artifacts.require('SakeToken');
const SakeMaster = artifacts.require('SakeMaster');
const Timelock = artifacts.require('Timelock');
const GovernorAlpha = artifacts.require('GovernorAlpha');
const MockERC20 = artifacts.require('MockERC20');

function encodeParameters(types, values) {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
}

contract('Governor', ([alice, minter, dev]) => {
    it('should work', async () => {
        this.sake = await SakeToken.new({ from: alice });
        await this.sake.delegate(dev, { from: dev });
        this.chef = await SakeMaster.new(this.sake.address, dev, '100', '0', { from: alice });
        await this.sake.transferOwnership(this.chef.address, { from: alice });
        this.lp = await MockERC20.new('LPToken', 'LP', '10000000000', { from: minter });
        this.lp2 = await MockERC20.new('LPToken2', 'LP2', '10000000000', { from: minter });
        await this.chef.add('100', this.lp.address, true, { from: alice });
        await this.lp.approve(this.chef.address, '1000', { from: minter });
        await this.chef.deposit(0, '100', { from: minter });
        // Perform another deposit to make sure some SAKEs are minted in that 1 block.
        await this.chef.deposit(0, '100', { from: minter });
        assert.equal((await this.sake.totalSupply()).valueOf(), '1066');
        assert.equal((await this.sake.balanceOf(minter)).valueOf(), '1000');
        assert.equal((await this.sake.balanceOf(dev)).valueOf(), '66');
        // Transfer ownership to timelock contract
        this.timelock = await Timelock.new(alice, time.duration.days(2), { from: alice });
        this.gov = await GovernorAlpha.new(this.timelock.address, this.sake.address, alice, { from: alice });
        await this.timelock.setPendingAdmin(this.gov.address, { from: alice });
        await this.gov.__acceptAdmin({ from: alice });
        await this.chef.transferOwnership(this.timelock.address, { from: alice });
        await expectRevert(
            this.chef.add('100', this.lp2.address, true, { from: alice }),
            'Ownable: caller is not the owner',
        );
        await expectRevert(
            this.gov.propose(
                [this.chef.address], ['0'], ['add(uint256,address,bool)'],
                [encodeParameters(['uint256', 'address', 'bool'], ['100', this.lp2.address, true])],
                'Add LP2',
                { from: alice },
            ),
            'GovernorAlpha::propose: proposer votes below proposal threshold',
        );
        await this.gov.propose(
            [this.chef.address], ['0'], ['add(uint256,address,bool)'],
            [encodeParameters(['uint256', 'address', 'bool'], ['100', this.lp2.address, true])],
            'Add LP2',
            { from: dev },
        );
        await time.advanceBlock();
        await this.gov.castVote('1', true, { from: dev });
        await expectRevert(this.gov.queue('1'), "GovernorAlpha::queue: proposal can only be queued if it is succeeded");
        console.log("Advancing 17280 blocks. Will take a while...");
        for (let i = 0; i < 17280; ++i) {
            await time.advanceBlock();
        }
        await this.gov.queue('1');
        await expectRevert(this.gov.execute('1'), "Timelock::executeTransaction: Transaction hasn't surpassed time lock.");
        await time.increase(time.duration.days(3));
        await this.gov.execute('1');
        assert.equal((await this.chef.poolLength()).valueOf(), '2');
    });
});
