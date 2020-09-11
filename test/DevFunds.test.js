const { expectRevert, time } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');
const DevFunds = artifacts.require('DevFunds');

contract('DevFunds', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.sake = await SakeToken.new({ from: alice });
        this.devFunds = await DevFunds.new(this.sake.address, bob, { from: alice });
        this.withdrawInternal = await this.devFunds.WITHDRAW_INTERVAL();
        this.maxWithdraw = await this.devFunds.WITHDRAW_MAX();
    });

    it('should revert before lockTime', async () => {
        await expectRevert(this.devFunds.withdraw({ from: alice }), 'sake locked');
        const currentBlock = await time.latestBlock();
        const unlockBlock = parseInt(currentBlock) + parseInt(this.withdrawInternal);
        await time.advanceBlockTo(unlockBlock);
        await expectRevert(this.devFunds.withdraw({ from: alice }), 'zero sake amount');
        await this.sake.mint(this.devFunds.address, '1000000000000000000000000');
        await this.devFunds.withdraw({ from: alice });
        const bal = await this.sake.balanceOf(bob);
        assert.equal(bal.valueOf(), parseInt(this.maxWithdraw));
        const lastWithdrawBlock = await this.devFunds.lastWithdrawBlock();
        assert.equal(lastWithdrawBlock.valueOf(), unlockBlock + 3);
    });
})