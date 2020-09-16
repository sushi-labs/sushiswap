const { expectRevert, time } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');
const MockERC20 = artifacts.require('MockERC20');
const SakeSwapPair = artifacts.require('SakeSwapPair');
const SakeSwapFactory = artifacts.require('SakeSwapFactory');
const SakeDrinker = artifacts.require('SakeDrinker');

contract('SakeDrinker', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.factory = await SakeSwapFactory.new(alice, { from: alice });
        this.sake = await SakeToken.new({ from: alice });
        await this.sake.mint(alice, '100000000', { from: alice });
        this.uni = await MockERC20.new('UNI', 'UNI', '100000000', { from: alice });
        this.sakeuni = await SakeSwapPair.at((await this.factory.createPair(this.sake.address, this.uni.address)).logs[0].args.pair);
        this.blackHoldAddress = '0000000000000000000000000000000000000001';
        this.drinker = await SakeDrinker.new(this.factory.address, this.sake.address, this.uni.address);
    });

    it('only owner can set factory', async () => {
        assert.equal(await this.drinker.owner(), alice);
        assert.equal(await this.drinker.factory(), this.factory.address);
        await expectRevert(this.drinker.setFactory(bob, { from: bob }), 'only owner');
        await this.drinker.setFactory(bob, { from: alice });
        assert.equal(await this.drinker.factory(), bob);
    });

    it('should convert uni to sake successfully', async () => {
        // add liquidity
        await this.sake.transfer(this.sakeuni.address, '100000', { from: alice });
        await this.uni.transfer(this.sakeuni.address, '100000', { from: alice });
        await this.sakeuni.sync();
        await this.sake.transfer(this.sakeuni.address, '10000000', { from: alice });
        await this.uni.transfer(this.sakeuni.address, '10000000', { from: alice });
        await this.sakeuni.mint(alice);

        await this.uni.transfer(this.drinker.address, '1000');
        await this.drinker.convert();
        assert.equal(await this.uni.balanceOf(this.drinker.address), '0');
        assert.equal(await this.sake.balanceOf(this.blackHoldAddress), '996');
    });
})