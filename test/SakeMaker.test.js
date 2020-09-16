const { expectRevert } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');
const SakeMaker = artifacts.require('SakeMaker');
const MockERC20 = artifacts.require('MockERC20');
const SakeSwapPair = artifacts.require('SakeSwapPair');
const SakeSwapFactory = artifacts.require('SakeSwapFactory');

contract('SakeMaker', ([alice, bar, minter]) => {
    beforeEach(async () => {
        this.factory = await SakeSwapFactory.new(alice, { from: alice });
        this.sake = await SakeToken.new({ from: alice });
        await this.sake.mint(minter, '100000000', { from: alice });
        this.weth = await MockERC20.new('WETH', 'WETH', '100000000', { from: minter });
        this.token1 = await MockERC20.new('TOKEN1', 'TOKEN', '100000000', { from: minter });
        this.token2 = await MockERC20.new('TOKEN2', 'TOKEN2', '100000000', { from: minter });
        this.maker = await SakeMaker.new(this.factory.address, bar, this.sake.address, this.weth.address);
        this.sakeWETH = await SakeSwapPair.at((await this.factory.createPair(this.weth.address, this.sake.address)).logs[0].args.pair);
        this.wethToken1 = await SakeSwapPair.at((await this.factory.createPair(this.weth.address, this.token1.address)).logs[0].args.pair);
        this.wethToken2 = await SakeSwapPair.at((await this.factory.createPair(this.weth.address, this.token2.address)).logs[0].args.pair);
        this.token1Token2 = await SakeSwapPair.at((await this.factory.createPair(this.token1.address, this.token2.address)).logs[0].args.pair);
        this.blackHoldAddress = '0000000000000000000000000000000000000001';
    });

    it('should transfer owner successfully', async () => {
        assert.equal(await this.maker.owner(), alice);
        await this.maker.transferOwnership(bar);
        assert.equal(await this.maker.owner(), bar);
    })

    it('should set burn ratio successfully', async () => {
        assert.equal(await this.maker.burnRatio(), 3);
        await this.maker.setBurnRatio(0, { from: alice });
        assert.equal(await this.maker.burnRatio(), 0);
        await this.maker.setBurnRatio(10, { from: alice });
        assert.equal(await this.maker.burnRatio(), 10);
        await expectRevert(this.maker.setBurnRatio(11, { from: alice }), 'invalid burn ratio');
        await expectRevert(this.maker.setBurnRatio(10, { from: bar }), 'Ownable: caller is not the owner');
    })

    it('should make SAKEs successfully', async () => {
        await this.factory.setFeeTo(this.maker.address, { from: alice });
        await this.weth.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.sake.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.sakeWETH.mint(minter);
        await this.weth.transfer(this.wethToken1.address, '10000000', { from: minter });
        await this.token1.transfer(this.wethToken1.address, '10000000', { from: minter });
        await this.wethToken1.mint(minter);
        await this.weth.transfer(this.wethToken2.address, '10000000', { from: minter });
        await this.token2.transfer(this.wethToken2.address, '10000000', { from: minter });
        await this.wethToken2.mint(minter);
        await this.token1.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token1Token2.mint(minter);
        // Fake some revenue
        await this.token1.transfer(this.token1Token2.address, '100000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '100000', { from: minter });
        await this.token1Token2.sync();
        await this.token1.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token1Token2.mint(minter);
        // Maker should have the LP now
        assert.equal((await this.token1Token2.balanceOf(this.maker.address)).valueOf(), '16528');
        // After calling convert, bar should have SAKE value at ~1/6 of revenue
        await this.maker.convert(this.token1.address, this.token2.address);
        assert.equal((await this.sake.balanceOf(bar)).valueOf(), '23098');
        assert.equal((await this.sake.balanceOf(this.blackHoldAddress)).valueOf(), '9866');
        assert.equal((await this.token1Token2.balanceOf(this.maker.address)).valueOf(), '0');
        // Should also work for SAKE-ETH pair
        await this.sake.transfer(this.sakeWETH.address, '100000', { from: minter });
        await this.weth.transfer(this.sakeWETH.address, '100000', { from: minter });
        await this.sakeWETH.sync();
        await this.sake.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.weth.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.sakeWETH.mint(minter);
        assert.equal((await this.sakeWETH.balanceOf(this.maker.address)).valueOf(), '16537');
        await this.maker.convert(this.sake.address, this.weth.address);
        assert.equal((await this.sake.balanceOf(bar)).valueOf(), '46400');
        assert.equal((await this.sake.balanceOf(this.blackHoldAddress)).valueOf(), '19847');
        assert.equal((await this.sakeWETH.balanceOf(this.maker.address)).valueOf(), '0');
    });

    it('should make SAKEs with new burn ratio successfully', async () => {
        await this.factory.setFeeTo(this.maker.address, { from: alice });
        await this.maker.setBurnRatio(5, { from: alice });
        await this.weth.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.sake.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.sakeWETH.mint(minter);
        await this.weth.transfer(this.wethToken1.address, '10000000', { from: minter });
        await this.token1.transfer(this.wethToken1.address, '10000000', { from: minter });
        await this.wethToken1.mint(minter);
        await this.weth.transfer(this.wethToken2.address, '10000000', { from: minter });
        await this.token2.transfer(this.wethToken2.address, '10000000', { from: minter });
        await this.wethToken2.mint(minter);
        await this.token1.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token1Token2.mint(minter);
        // Fake some revenue
        await this.token1.transfer(this.token1Token2.address, '100000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '100000', { from: minter });
        await this.token1Token2.sync();
        await this.token1.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token2.transfer(this.token1Token2.address, '10000000', { from: minter });
        await this.token1Token2.mint(minter);
        // Maker should have the LP now
        assert.equal((await this.token1Token2.balanceOf(this.maker.address)).valueOf(), '16528');
        // After calling convert, bar should have SAKE value at ~1/6 of revenue
        await this.maker.convert(this.token1.address, this.token2.address);
        assert.equal((await this.sake.balanceOf(bar)).valueOf(), '16509');
        assert.equal((await this.sake.balanceOf(this.blackHoldAddress)).valueOf(), '16455');
        assert.equal((await this.token1Token2.balanceOf(this.maker.address)).valueOf(), '0');
        // Should also work for SAKE-ETH pair
        await this.sake.transfer(this.sakeWETH.address, '100000', { from: minter });
        await this.weth.transfer(this.sakeWETH.address, '100000', { from: minter });
        await this.sakeWETH.sync();
        await this.sake.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.weth.transfer(this.sakeWETH.address, '10000000', { from: minter });
        await this.sakeWETH.mint(minter);
        assert.equal((await this.sakeWETH.balanceOf(this.maker.address)).valueOf(), '16537');
        await this.maker.convert(this.sake.address, this.weth.address);
        assert.equal((await this.sake.balanceOf(bar)).valueOf(), '33155');
        assert.equal((await this.sake.balanceOf(this.blackHoldAddress)).valueOf(), '33093');
        assert.equal((await this.sakeWETH.balanceOf(this.maker.address)).valueOf(), '0');
    })
});