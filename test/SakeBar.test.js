const { expectRevert } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');
const SakeBar = artifacts.require('SakeBar');

contract('SakeBar', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.sake = await SakeToken.new({ from: alice });
        this.bar = await SakeBar.new(this.sake.address, { from: alice });
        this.sake.mint(alice, '100', { from: alice });
        this.sake.mint(bob, '100', { from: alice });
        this.sake.mint(carol, '100', { from: alice });
    });

    it('should not allow enter if not enough approve', async () => {
        await expectRevert(
            this.bar.enter('100', { from: alice }),
            'ERC20: transfer amount exceeds allowance',
        );
        await this.sake.approve(this.bar.address, '50', { from: alice });
        await expectRevert(
            this.bar.enter('100', { from: alice }),
            'ERC20: transfer amount exceeds allowance',
        );
        await this.sake.approve(this.bar.address, '100', { from: alice });
        await this.bar.enter('100', { from: alice });
        assert.equal((await this.bar.balanceOf(alice)).valueOf(), '100');
    });

    it('should not allow withraw more than what you have', async () => {
        await this.sake.approve(this.bar.address, '100', { from: alice });
        await this.bar.enter('100', { from: alice });
        await expectRevert(
            this.bar.leave('200', { from: alice }),
            'ERC20: burn amount exceeds balance',
        );
    });

    it('should work with more than one participant', async () => {
        await this.sake.approve(this.bar.address, '100', { from: alice });
        await this.sake.approve(this.bar.address, '100', { from: bob });
        // Alice enters and gets 20 shares. Bob enters and gets 10 shares.
        await this.bar.enter('20', { from: alice });
        await this.bar.enter('10', { from: bob });
        assert.equal((await this.bar.balanceOf(alice)).valueOf(), '20');
        assert.equal((await this.bar.balanceOf(bob)).valueOf(), '10');
        assert.equal((await this.sake.balanceOf(this.bar.address)).valueOf(), '30');
        // SakeBar get 20 more SAKEs from an external source.
        await this.sake.transfer(this.bar.address, '20', { from: carol });
        // Alice deposits 10 more SAKEs. She should receive 10*30/50 = 6 shares.
        await this.bar.enter('10', { from: alice });
        assert.equal((await this.bar.balanceOf(alice)).valueOf(), '26');
        assert.equal((await this.bar.balanceOf(bob)).valueOf(), '10');
        // Bob withdraws 5 shares. He should receive 5*60/36 = 8 shares
        await this.bar.leave('5', { from: bob });
        assert.equal((await this.bar.balanceOf(alice)).valueOf(), '26');
        assert.equal((await this.bar.balanceOf(bob)).valueOf(), '5');
        assert.equal((await this.sake.balanceOf(this.bar.address)).valueOf(), '52');
        assert.equal((await this.sake.balanceOf(alice)).valueOf(), '70');
        assert.equal((await this.sake.balanceOf(bob)).valueOf(), '98');
    });
});
