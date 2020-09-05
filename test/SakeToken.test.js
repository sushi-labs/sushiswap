const { expectRevert } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');

contract('SakeToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.sake = await SakeToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.sake.name();
        const symbol = await this.sake.symbol();
        const decimals = await this.sake.decimals();
        assert.equal(name.valueOf(), 'SakeToken');
        assert.equal(symbol.valueOf(), 'SAKE');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.sake.mint(alice, '100', { from: alice });
        await this.sake.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.sake.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.sake.totalSupply();
        const aliceBal = await this.sake.balanceOf(alice);
        const bobBal = await this.sake.balanceOf(bob);
        const carolBal = await this.sake.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.sake.mint(alice, '100', { from: alice });
        await this.sake.mint(bob, '1000', { from: alice });
        await this.sake.transfer(carol, '10', { from: alice });
        await this.sake.transfer(carol, '100', { from: bob });
        const totalSupply = await this.sake.totalSupply();
        const aliceBal = await this.sake.balanceOf(alice);
        const bobBal = await this.sake.balanceOf(bob);
        const carolBal = await this.sake.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.sake.mint(alice, '100', { from: alice });
        await expectRevert(
            this.sake.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.sake.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });

    it('should update vote of delegatee when delegator transfers', async () => {
        await this.sake.mint(alice, '100', { from: alice });
        await this.sake.delegate(bob, { from: alice });
        assert.equal(await this.sake.getCurrentVotes(alice), '0');
        assert.equal(await this.sake.getCurrentVotes(bob), '100');
        await this.sake.mint(alice, '100', { from: alice });
        assert.equal(await this.sake.getCurrentVotes(bob), '200');
        await this.sake.mint(carol, '100', { from: alice });
        await this.sake.transfer(alice, '50', { from: carol });
        assert.equal(await this.sake.getCurrentVotes(bob), '250');
        await this.sake.delegate(carol, { from: alice });
        assert.equal(await this.sake.getCurrentVotes(bob), '0');
        assert.equal(await this.sake.getCurrentVotes(carol), '250');
    });
  });
