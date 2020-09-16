const { expectRevert, time } = require('@openzeppelin/test-helpers');
const SakeMaster = artifacts.require('SakeMaster');
const SakeToken = artifacts.require('SakeToken');
const SakeLock = artifacts.require('SakeLock');

contract('SakeLock', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.sake = await SakeToken.new({ from: alice });
        this.master = await SakeMaster.new(this.sake.address, bob, '1000', '0', { from: alice });
        this.sakeLock = await SakeLock.new(this.sake.address, this.master.address, { from: alice });
    });

    it('should deposit SakeLock Token success', async () => {
        const totalSupply = await this.sakeLock.totalSupply();
        assert.equal(totalSupply.valueOf(), '1');
        await this.sake.transferOwnership(this.master.address, { from: alice });
        await this.master.add('100', this.sakeLock.address, false);
        await time.advanceBlockTo('8');
        await this.sakeLock.deposit('0', { from: alice });
        await time.advanceBlockTo('10');
        assert.equal((await this.master.pendingSake(0, this.sakeLock.address)).valueOf(), '1000');
        await this.sakeLock.withdrawFromSakeMaster('0', { from: alice });
        assert.equal(await this.sake.balanceOf(this.sakeLock.address).valueOf(), '2000');

        await this.sakeLock.setwithdrawContractAddr(carol);
        assert.equal(await this.sakeLock.withDrawAddr().valueOf(), carol);

        await this.sakeLock.withdrawToContract(50);
        assert.equal(await this.sake.balanceOf(this.sakeLock.address).valueOf(), '1950');
        assert.equal(await this.sake.balanceOf(carol).valueOf(), '50');
    });
})