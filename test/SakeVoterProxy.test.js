const { expectRevert } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');
const SakeMaster = artifacts.require('SakeMaster');
const SakeVoterProxy = artifacts.require('SakeVoterProxy');
const MockERC20 = artifacts.require('MockERC20');
const SakeSwapPair = artifacts.require('SakeSwapPair');
const SakeSwapFactory = artifacts.require('SakeSwapFactory');

const TOTAL_SUPPLY = 10000000;
const LP_SUPPLY    = 1000000;

contract('SakeVoterProxy', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.sakeToken = await SakeToken.new({ from: alice });
        await this.sakeToken.mint(minter, TOTAL_SUPPLY, { from: alice });
        this.sakeMaster = await SakeMaster.new(this.sakeToken.address, dev, '1000', '0', { from: alice });
        this.sakeVoterProxy = await SakeVoterProxy.new(this.sakeToken.address, this.sakeMaster.address, { from: alice });
    });

    it('check totalSupply', async () => {
        await this.sakeToken.mint(alice, '100', { from: alice });
        await this.sakeToken.mint(bob, '100', { from: alice });
        await this.sakeToken.mint(carol, '100', { from: alice });
        assert.equal((await this.sakeVoterProxy.totalSupply()).valueOf(), '10000300');
        await this.sakeToken.mint(carol, '100', { from: alice });
        assert.equal((await this.sakeVoterProxy.totalSupply()).valueOf(), '10000400');
        await this.sakeToken.mint(bob, '200', { from: alice });
        assert.equal((await this.sakeVoterProxy.totalSupply()).valueOf(), '10000600');
    });

    it('check votePools api', async () => {
        // assert.equal((await this.sakeVoterProxy.getVotePoolNum()).valueOf(), '5');
        // assert.equal((await this.sakeVoterProxy.getVotePoolId(1)).valueOf(), '32');
        await expectRevert(this.sakeVoterProxy.addVotePool(5,{ from: bob }),'Not Owner');
        // assert.equal((await this.sakeVoterProxy.getVotePoolNum()).valueOf(), '5');
        this.sakeVoterProxy.addVotePool('5', { from: alice });
        // assert.equal((await this.sakeVoterProxy.getVotePoolNum()).valueOf(), '6');
        // assert.equal((await this.sakeVoterProxy.getVotePoolId(3)).valueOf(), '34');
        // assert.equal((await this.sakeVoterProxy.getVotePoolId(5)).valueOf(), '5');
        await expectRevert(this.sakeVoterProxy.delVotePool('5', { from: bob }),'Not Owner');
        // assert.equal((await this.sakeVoterProxy.getVotePoolNum()).valueOf(), '6');
        this.sakeVoterProxy.delVotePool('5', { from: alice });
        // assert.equal((await this.sakeVoterProxy.getVotePoolNum()).valueOf(), '5');
        // assert.equal((await this.sakeVoterProxy.getVotePoolId(2)).valueOf(), '33');
        // this.sakeVoterProxy.addVotePool('9', { from: alice });
        // assert.equal((await this.sakeVoterProxy.getVotePoolNum()).valueOf(), '6');
        // assert.equal((await this.sakeVoterProxy.getVotePoolId(5)).valueOf(), '9');
    });

    it('check balanceOf', async () => {
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '0');
        this.factory0 = await SakeSwapFactory.new(alice, { from: alice });
        this.factory32 = await SakeSwapFactory.new(alice, { from: alice });
        this.factory33 = await SakeSwapFactory.new(alice, { from: alice });
        this.factory34 = await SakeSwapFactory.new(alice, { from: alice });
        await this.sakeToken.transferOwnership(this.sakeMaster.address, { from: alice });
        this.token0 = await MockERC20.new('TToken', 'TOKEN0', TOTAL_SUPPLY, { from: minter });
        this.lp0 = await SakeSwapPair.at((await this.factory0.createPair(this.token0.address, this.sakeToken.address)).logs[0].args.pair);
        await this.token0.transfer(this.lp0.address, LP_SUPPLY, { from: minter });
        await this.sakeToken.transfer(this.lp0.address, LP_SUPPLY, { from: minter });
        await this.lp0.mint(minter);
        await this.sakeMaster.add('100', this.lp0.address, true);
        for(i=1;i<32;i++)
        {
            this.lptemp = await MockERC20.new('LPToken', 'TOKEN', TOTAL_SUPPLY, { from: minter });
            await this.sakeMaster.add('100', this.lptemp.address, true);
        }
        this.token32 = await MockERC20.new('TToken', 'Token32', TOTAL_SUPPLY, { from: minter });
        this.lp32 = await SakeSwapPair.at((await this.factory32.createPair(this.token32.address, this.sakeToken.address)).logs[0].args.pair);
        await this.token32.transfer(this.lp32.address, LP_SUPPLY, { from: minter });
        await this.sakeToken.transfer(this.lp32.address, LP_SUPPLY, { from: minter });
        await this.lp32.mint(minter);
        await this.sakeMaster.add('100', this.lp32.address, true);
        this.token33 = await MockERC20.new('TToken', 'TOKEN33', TOTAL_SUPPLY, { from: minter });
        this.lp33 = await SakeSwapPair.at((await this.factory33.createPair(this.token33.address, this.sakeToken.address)).logs[0].args.pair);
        await this.token33.transfer(this.lp33.address, LP_SUPPLY, { from: minter });
        await this.sakeToken.transfer(this.lp33.address, LP_SUPPLY, { from: minter });
        await this.lp33.mint(minter);
        await this.sakeMaster.add('100', this.lp33.address, true);
        this.token34 = await MockERC20.new('LPToken', 'TOKEN34', TOTAL_SUPPLY, { from: minter });
        this.lp34 = await SakeSwapPair.at((await this.factory34.createPair(this.token34.address, this.sakeToken.address)).logs[0].args.pair);
        await this.token34.transfer(this.lp34.address, LP_SUPPLY, { from: minter });
        await this.sakeToken.transfer(this.lp34.address, LP_SUPPLY, { from: minter });
        await this.lp34.mint(minter);
        await this.sakeMaster.add('100', this.lp34.address, true);
        //null pool will destroy 1000 lp_token
        // console.log("get minter lp0",(await this.lp0.balanceOf(minter)).valueOf());
        // console.log("get minter vote",(await this.sakeVoterProxy.balanceOf(minter)).valueOf());
        await this.lp0.approve(this.sakeMaster.address, '100', { from: minter });
        await this.sakeMaster.deposit(0, '100', { from: minter });
        assert.equal((await this.sakeVoterProxy.balanceOf(minter)).valueOf(), '6000100');
        await this.lp32.approve(this.sakeMaster.address, '200', { from: minter });
        await this.sakeMaster.deposit(32, '100', { from: minter });
        assert.equal((await this.sakeVoterProxy.balanceOf(minter)).valueOf(), '6000200');

        await this.lp0.transfer(bob, '500', { from: minter });
        await this.lp0.approve(this.sakeMaster.address, '500', { from: bob });
        await this.sakeMaster.deposit(0, '500', { from: bob });
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '500');
        await this.lp32.transfer(bob, '500', { from: minter });
        await this.lp32.approve(this.sakeMaster.address, '500', { from: bob });
        await this.sakeMaster.deposit(32, '500', { from: bob });
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '1000');
        await this.lp34.transfer(bob, '500', { from: minter });
        await this.lp34.approve(this.sakeMaster.address, '500', { from: bob });
        await this.sakeMaster.deposit(34, '500', { from: bob });
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '1500');
        await this.sakeMaster.withdraw(34, '500', { from: bob });
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '1028');

        //no votepool deposit
        this.factory35 = await SakeSwapFactory.new(alice, { from: alice });
        this.token35 = await MockERC20.new('TToken', 'TOKE35', TOTAL_SUPPLY, { from: minter });
        this.lp35 = await SakeSwapPair.at((await this.factory35.createPair(this.token35.address, this.sakeToken.address)).logs[0].args.pair);
        await this.token35.transfer(this.lp35.address, LP_SUPPLY, { from: minter });
        await this.sakeToken.transfer(this.lp35.address, LP_SUPPLY, { from: minter });
        await this.lp35.mint(minter);
        await this.sakeMaster.add('100', this.lp35.address, true);
        await this.lp35.transfer(bob, '500', { from: minter });
        await this.lp35.approve(this.sakeMaster.address, '500', { from: bob });
        await this.sakeMaster.deposit(35, '500', { from: bob });
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '1028');
        //add votepool 35
        this.sakeVoterProxy.addVotePool('35', { from: alice });
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '1528');
        await this.sakeMaster.withdraw(35, '300', { from: bob });
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '1283');
        //del votepool 35
        this.sakeVoterProxy.delVotePool('35', { from: alice });
        //votepools only have 200 balanceOf
        assert.equal((await this.sakeVoterProxy.balanceOf(bob)).valueOf(), '1083');
    });
});
