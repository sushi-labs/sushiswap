const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const MockERC20 = artifacts.require('MockERC20');
const SakeSwapRouter = artifacts.require('SakeSwapRouter');
const SakeSwapFactory = artifacts.require('SakeSwapFactory');
const SakeSwapPair = artifacts.require('SakeSwapPair');
const Weth = artifacts.require('WETH9');
const SakeSwapMigrator = artifacts.require('SakeSwapMigrator');
const { keccak256, defaultAbiCoder, solidityPack } = require("ethers/utils");
const util = require("ethereumjs-util");

contract('SakeSwapMigrator', ([alice, bar, minter]) => {
    beforeEach(async () => {
        this.weth = await Weth.new();
        this.uniFactory = await SakeSwapFactory.new(alice);
        this.uniRouter = await SakeSwapRouter.new(this.uniFactory.address, this.weth.address)
        this.sushiFactory = await SakeSwapFactory.new(alice);
        this.sushiRouter = await SakeSwapRouter.new(this.sushiFactory.address, this.weth.address);
        this.sakeFactory = await SakeSwapFactory.new(alice);
        this.sakeRouter = await SakeSwapRouter.new(this.sakeFactory.address, this.weth.address);
        this.token1 = await MockERC20.new('TOKEN1', 'TOKEN', '100000000');
        this.token2 = await MockERC20.new('TOKEN2', 'TOKEN2', '100000000');
        this.uniPair = await SakeSwapPair.at((await this.uniFactory.createPair(this.token1.address, this.token2.address)).logs[0].args.pair);
        this.sushiPair = await SakeSwapPair.at((await this.sushiFactory.createPair(this.token1.address, this.token2.address)).logs[0].args.pair);
        this.sakePair = await SakeSwapPair.at((await this.sakeFactory.createPair(this.token1.address, this.token2.address)).logs[0].args.pair);
        this.sakeSwapMigrator = await SakeSwapMigrator.new(this.uniFactory.address, this.uniRouter.address, this.sushiFactory.address,
            this.sushiRouter.address, this.sakeRouter.address);
        this.bob = await web3.eth.accounts.privateKeyToAccount('f26d2c81b56dfa568219bf842a6402f449501ed80719eac17792191cadcd707f');
    });

    function getApprovalDigest(that, owner, spender, value, nonce, deadline) {
        return keccak256(
            solidityPack(
                ["bytes1", "bytes1", "bytes32", "bytes32"],
                [
                    "0x19",
                    "0x01",
                    that.DOMAIN_SEPARATOR,
                    keccak256(
                        defaultAbiCoder.encode(
                            ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
                            [that.PERMIT_TYPEHASH, owner, spender, value, nonce, deadline]
                        )
                    ),
                ]
            )
        );
    }

    it('should migrate from uniswap successfully', async () => {
        await this.token1.approve(this.uniRouter.address, '10000');
        await this.token2.approve(this.uniRouter.address, '10000');
        await this.uniRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', bar, '10000000000000');
        const uniLpAmount = await this.uniPair.balanceOf(bar);
        assert.equal(uniLpAmount.valueOf(), '9000');

        await this.token1.approve(this.sakeRouter.address, '10000');
        await this.token2.approve(this.sakeRouter.address, '10000');
        await this.sakeRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', bar, '10000000000000');
        const sakeLpAmount = await this.sakePair.balanceOf(bar);
        assert.equal(sakeLpAmount.valueOf(), '9000');

        await this.uniPair.approve(this.sakeSwapMigrator.address, '9000', { from: bar });
        await this.sakeSwapMigrator.migrateUniswap(this.token1.address, this.token2.address, '9000', { from: bar });
        assert.equal((await this.uniPair.balanceOf(bar)).valueOf(), '0');
        assert.equal((await this.sakePair.balanceOf(bar)).valueOf(), '18000');
    });

    it('should migrate from sushiswap successfully', async () => {
        await this.token1.approve(this.sushiRouter.address, '10000');
        await this.token2.approve(this.sushiRouter.address, '10000');
        await this.sushiRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', bar, '10000000000000');
        const sushiLpAmount = await this.sushiPair.balanceOf(bar);
        assert.equal(sushiLpAmount.valueOf(), '9000');

        await this.token1.approve(this.sakeRouter.address, '10000');
        await this.token2.approve(this.sakeRouter.address, '10000');
        await this.sakeRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', bar, '10000000000000');
        const sakeLpAmount = await this.sakePair.balanceOf(bar);
        assert.equal(sakeLpAmount.valueOf(), '9000');

        await this.sushiPair.approve(this.sakeSwapMigrator.address, '9000', { from: bar });
        await this.sakeSwapMigrator.migrateSushiSwap(this.token1.address, this.token2.address, '9000', { from: bar });
        assert.equal((await this.sushiPair.balanceOf(bar)).valueOf(), '0');
        assert.equal((await this.sakePair.balanceOf(bar)).valueOf(), '18000');
    });

    it('should migrate from uniswap with permit successfully', async () => {
        await web3.eth.personal.importRawKey(this.bob.privateKey, "");
        await web3.eth.personal.unlockAccount(this.bob.address, "", 60000);
        await web3.eth.sendTransaction({
            from: alice,
            to: this.bob.address,
            value: '1000000000000000000'
        });

        await this.token1.approve(this.uniRouter.address, '10000');
        await this.token2.approve(this.uniRouter.address, '10000');
        await this.uniRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', this.bob.address, '10000000000000');
        const uniLpAmount = await this.uniPair.balanceOf(this.bob.address);
        assert.equal(uniLpAmount.valueOf(), '9000');

        await this.token1.approve(this.sakeRouter.address, '10000');
        await this.token2.approve(this.sakeRouter.address, '10000');
        await this.sakeRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', this.bob.address, '10000000000000');
        const sakeLpAmount = await this.sakePair.balanceOf(this.bob.address);
        assert.equal(sakeLpAmount.valueOf(), '9000');

        this.DOMAIN_SEPARATOR = (await this.uniPair.DOMAIN_SEPARATOR()).toString();
        this.PERMIT_TYPEHASH = (await this.uniPair.PERMIT_TYPEHASH()).toString();

        const digest = getApprovalDigest(this, this.bob.address, this.sakeSwapMigrator.address, 9000, 0, 10000000000000);
        const priKeyBuf = util.toBuffer(this.bob.privateKey);
        const { v, r, s } = util.ecsign(Buffer.from(digest.slice(2), "hex"), priKeyBuf);
        await this.sakeSwapMigrator.migrateUniswapWithPermit(this.token1.address, this.token2.address,
            '9000', '10000000000000', v, r, s, { from: this.bob.address });
        assert.equal((await this.uniPair.balanceOf(this.bob.address)).valueOf(), '0');
        assert.equal((await this.sakePair.balanceOf(this.bob.address)).valueOf(), '18000');
    });

    it('should migrate from sushiswap with permit successfully', async () => {
        await web3.eth.personal.importRawKey(this.bob.privateKey, "");
        await web3.eth.personal.unlockAccount(this.bob.address, "", 60000);
        await web3.eth.sendTransaction({
            from: alice,
            to: this.bob.address,
            value: '1000000000000000000'
        });

        await this.token1.approve(this.sushiRouter.address, '10000');
        await this.token2.approve(this.sushiRouter.address, '10000');
        await this.sushiRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', this.bob.address, '10000000000000');
        const sushiLpAmount = await this.sushiPair.balanceOf(this.bob.address);
        assert.equal(sushiLpAmount.valueOf(), '9000');

        await this.token1.approve(this.sakeRouter.address, '10000');
        await this.token2.approve(this.sakeRouter.address, '10000');
        await this.sakeRouter.addLiquidity(this.token1.address, this.token2.address, '10000', '10000', '0', '0', this.bob.address, '10000000000000');
        const sakeLpAmount = await this.sakePair.balanceOf(this.bob.address);
        assert.equal(sakeLpAmount.valueOf(), '9000');

        this.DOMAIN_SEPARATOR = (await this.sushiPair.DOMAIN_SEPARATOR()).toString();
        this.PERMIT_TYPEHASH = (await this.sushiPair.PERMIT_TYPEHASH()).toString();

        const digest = getApprovalDigest(this, this.bob.address, this.sakeSwapMigrator.address, 9000, 0, 10000000000000);
        const priKeyBuf = util.toBuffer(this.bob.privateKey);
        const { v, r, s } = util.ecsign(Buffer.from(digest.slice(2), "hex"), priKeyBuf);
        await this.sakeSwapMigrator.migrateSushiSwapWithPermit(this.token1.address, this.token2.address,
            '9000', '10000000000000', v, r, s, { from: this.bob.address });
        assert.equal((await this.sushiPair.balanceOf(this.bob.address)).valueOf(), '0');
        assert.equal((await this.sakePair.balanceOf(this.bob.address)).valueOf(), '18000');
    });
})