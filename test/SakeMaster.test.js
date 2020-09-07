const { expectRevert, time } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');
const SakeMaster = artifacts.require('SakeMaster');
const MockERC20 = artifacts.require('MockERC20');

contract('SakeMaster', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.sake = await SakeToken.new({ from: alice });
    });

    it('should set correct state variables', async () => {
        this.chef = await SakeMaster.new(this.sake.address, dev, '1000', '0', { from: alice });
        await this.sake.transferOwnership(this.chef.address, { from: alice });
        const sake = await this.chef.sake();
        const devaddr = await this.chef.devaddr();
        const owner = await this.sake.owner();
        assert.equal(sake.valueOf(), this.sake.address);
        assert.equal(devaddr.valueOf(), dev);
        assert.equal(owner.valueOf(), this.chef.address);
    });

    it('should allow dev and only dev to update dev', async () => {
        this.chef = await SakeMaster.new(this.sake.address, dev, '1000', '0', { from: alice });
        assert.equal((await this.chef.devaddr()).valueOf(), dev);
        await expectRevert(this.chef.dev(bob, { from: bob }), 'dev: wut?');
        await this.chef.dev(bob, { from: dev });
        assert.equal((await this.chef.devaddr()).valueOf(), bob);
        await this.chef.dev(alice, { from: bob });
        assert.equal((await this.chef.devaddr()).valueOf(), alice);
    });

    context('With ERC/LP token added to the field', () => {
        beforeEach(async () => {
            this.lp = await MockERC20.new('LPToken', 'LP', '10000000000', { from: minter });
            await this.lp.transfer(alice, '1000', { from: minter });
            await this.lp.transfer(bob, '1000', { from: minter });
            await this.lp.transfer(carol, '1000', { from: minter });
            this.lp2 = await MockERC20.new('LPToken2', 'LP2', '10000000000', { from: minter });
            await this.lp2.transfer(alice, '1000', { from: minter });
            await this.lp2.transfer(bob, '1000', { from: minter });
            await this.lp2.transfer(carol, '1000', { from: minter });
        });

        it('should allow emergency withdraw', async () => {
            // 100 per block farming rate starting at block 100 with bonus until block 1000
            this.chef = await SakeMaster.new(this.sake.address, dev, '100', '100', { from: alice });
            await this.chef.add('100', this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await this.chef.deposit(0, '100', { from: bob });
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '900');
            await this.chef.emergencyWithdraw(0, { from: bob });
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
        });

        it('should give out SAKEs only after farming time', async () => {
            // 100 per block farming rate starting at block 100 with bonus until block 1000
            this.chef = await SakeMaster.new(this.sake.address, dev, '50', '100', { from: alice });
            await this.sake.transferOwnership(this.chef.address, { from: alice });
            await this.chef.add('100', this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await this.chef.deposit(0, '100', { from: bob });
            await time.advanceBlockTo('89');
            await this.chef.deposit(0, '0', { from: bob }); // block 90
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('94');
            await this.chef.deposit(0, '0', { from: bob }); // block 95
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('99');
            await this.chef.deposit(0, '0', { from: bob }); // block 100
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('100');
            await this.chef.deposit(0, '0', { from: bob }); // block 101
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '50');
            await time.advanceBlockTo('104');
            await this.chef.deposit(0, '0', { from: bob }); // block 105
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '250');
            assert.equal((await this.sake.balanceOf(dev)).valueOf(), '16');
            assert.equal((await this.sake.totalSupply()).valueOf(), '266');
        });

        it('should not distribute SAKEs if no one deposit', async () => {
            // 100 per block farming rate starting at block 200 with bonus until block 1000
            this.chef = await SakeMaster.new(this.sake.address, dev, '50', '200', { from: alice });
            await this.sake.transferOwnership(this.chef.address, { from: alice });
            await this.chef.add('100', this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await time.advanceBlockTo('199');
            assert.equal((await this.sake.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('204');
            assert.equal((await this.sake.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('209');
            await this.chef.deposit(0, '10', { from: bob }); // block 210
            assert.equal((await this.sake.totalSupply()).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(dev)).valueOf(), '0');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '990');
            await time.advanceBlockTo('219');
            await this.chef.withdraw(0, '10', { from: bob }); // block 220
            assert.equal((await this.sake.totalSupply()).valueOf(), '533');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '500');
            assert.equal((await this.sake.balanceOf(dev)).valueOf(), '33');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
        });

        it('should distribute SAKEs properly for each staker', async () => {
            // 100 per block farming rate starting at block 300 with bonus until block 1000
            this.chef = await SakeMaster.new(this.sake.address, dev, '50', '300', { from: alice });
            await this.sake.transferOwnership(this.chef.address, { from: alice });
            await this.chef.add('100', this.lp.address, true);
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: bob });
            await this.lp.approve(this.chef.address, '1000', { from: carol });
            // Alice deposits 10 LPs at block 310
            await time.advanceBlockTo('309');
            await this.chef.deposit(0, '10', { from: alice });
            // Bob deposits 20 LPs at block 314
            await time.advanceBlockTo('313');
            await this.chef.deposit(0, '20', { from: bob });
            // Carol deposits 30 LPs at block 318
            await time.advanceBlockTo('317');
            await this.chef.deposit(0, '30', { from: carol });
            // Alice deposits 10 more LPs at block 320. At this point:
            //   Alice should have: 4*50 + 4*1/3*50 + 2*1/6*50 = 283
            //   SakeMaster should have the remaining: 500 - 283 = 217
            await time.advanceBlockTo('319')
            await this.chef.deposit(0, '10', { from: alice });
            assert.equal((await this.sake.totalSupply()).valueOf(), '532');
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '283');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(carol)).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(this.chef.address)).valueOf(), '217');
            assert.equal((await this.sake.balanceOf(dev)).valueOf(), '32');
            // Bob withdraws 5 LPs at block 330. At this point:
            //   Bob should have: 4*2/3*50 + 2*2/6*50 + 10*2/7*50 = 309
            await time.advanceBlockTo('329')
            await this.chef.withdraw(0, '5', { from: bob });
            assert.equal((await this.sake.totalSupply()).valueOf(), '1065');
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '283');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '309');
            assert.equal((await this.sake.balanceOf(carol)).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(this.chef.address)).valueOf(), '408');
            assert.equal((await this.sake.balanceOf(dev)).valueOf(), '65');
            // Alice withdraws 20 LPs at block 340.
            // Bob withdraws 15 LPs at block 350.
            // Carol withdraws 30 LPs at block 360.
            await time.advanceBlockTo('339')
            await this.chef.withdraw(0, '20', { from: alice });
            await time.advanceBlockTo('349')
            await this.chef.withdraw(0, '15', { from: bob });
            await time.advanceBlockTo('359')
            await this.chef.withdraw(0, '30', { from: carol });
            assert.equal((await this.sake.totalSupply()).valueOf(), '2664');
            assert.equal((await this.sake.balanceOf(dev)).valueOf(), '164');
            // Alice should have: 283 + 10*2/7*50 + 10*2/6.5*50 = 580
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '580');
            // Bob should have: 309 + 10*1.5/6.5 * 50 + 10*1.5/4.5*50 = 591
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '591');
            // Carol should have: 2*3/6*50 + 10*3/7*50 + 10*3/6.5*50 + 10*3/4.5*50 + 10*50 = 1329
            assert.equal((await this.sake.balanceOf(carol)).valueOf(), '1329');
            // All of them should have 1000 LPs back.
            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '1000');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
            assert.equal((await this.lp.balanceOf(carol)).valueOf(), '1000');
        });

        it('should give proper SAKEs allocation to each pool', async () => {
            // 100 per block farming rate starting at block 400 with bonus until block 1000
            this.chef = await SakeMaster.new(this.sake.address, dev, '50', '400', { from: alice });
            await this.sake.transferOwnership(this.chef.address, { from: alice });
            await this.lp.approve(this.chef.address, '1000', { from: alice });
            await this.lp2.approve(this.chef.address, '1000', { from: bob });
            // Add first LP to the pool with allocation 1
            await this.chef.add('10', this.lp.address, true);
            // Alice deposits 10 LPs at block 410
            await time.advanceBlockTo('409');
            await this.chef.deposit(0, '10', { from: alice });
            // Add LP2 to the pool with allocation 2 at block 420
            await time.advanceBlockTo('419');
            await this.chef.add('20', this.lp2.address, true);
            // Alice should have 10*1000 pending reward
            assert.equal((await this.chef.pendingSake(0, alice)).valueOf(), '500');
            // Bob deposits 10 LP2s at block 425
            await time.advanceBlockTo('424');
            await this.chef.deposit(1, '5', { from: bob });
            // Alice should have 500 + 5*1/3*50 = 583 pending reward
            assert.equal((await this.chef.pendingSake(0, alice)).valueOf(), '583');
            await time.advanceBlockTo('430');
            // At block 430. Bob should get 5*2/3*50 = 166. Alice should get ~83 more.
            assert.equal((await this.chef.pendingSake(0, alice)).valueOf(), '666');
            assert.equal((await this.chef.pendingSake(1, bob)).valueOf(), '166');
        });

        // it('should stop giving bonus SAKEs after the bonus period ends', async () => {
        //     // 100 per block farming rate starting at block 500 with bonus until block 600
        //     this.chef = await SakeMaster.new(this.sake.address, dev, '100', '500', { from: alice });
        //     await this.sake.transferOwnership(this.chef.address, { from: alice });
        //     await this.lp.approve(this.chef.address, '1000', { from: alice });
        //     await this.chef.add('1', this.lp.address, true);
        //     // Alice deposits 10 LPs at block 590
        //     await time.advanceBlockTo('589');
        //     await this.chef.deposit(0, '10', { from: alice });
        //     // At block 605, she should have 50*15 = 750 pending.
        //     await time.advanceBlockTo('135505');
        //     assert.equal((await this.chef.pendingSake(0, alice)).valueOf(), '10500');
        //     // At block 606, Alice withdraws all pending rewards and should get 10600.
        //     await this.chef.deposit(0, '0', { from: alice });
        //     assert.equal((await this.chef.pendingSake(0, alice)).valueOf(), '0');
        //     assert.equal((await this.sake.balanceOf(alice)).valueOf(), '10600');
        // });

        it('getMultiplier', async () => {
            this.sake = await SakeMaster.new(this.sake.address, dev, '50', '0', { from: alice });
            assert.equal((await this.sake.getMultiplier(0, 35000)).valueOf(), '35000');
            assert.equal((await this.sake.getMultiplier(10000, 135000)).valueOf(), '2025000');
            assert.equal((await this.sake.getMultiplier(35000, 135000)).valueOf(), '2000000');
            assert.equal((await this.sake.getMultiplier(10000, 235000)).valueOf(), '2225000');
            assert.equal((await this.sake.getMultiplier(45000, 235000)).valueOf(), '2000000');
            assert.equal((await this.sake.getMultiplier(145000, 235000)).valueOf(), '180000');
            assert.equal((await this.sake.getMultiplier(145000, 235001)).valueOf(), '180000');
            assert.equal((await this.sake.getMultiplier(235001, 235002)).valueOf(), '0');
        });

        it('add lp token', async () => {
            this.sake = await SakeMaster.new(this.sake.address, dev, '50', '0', { from: alice });
            await this.sake.add('10', this.lp.address, false);
            await expectRevert(
                this.sake.add('10', this.lp.address, false),
                'SakeMaster:duplicate add.',
            );
            await this.sake.add('10', this.lp2.address, false);
            assert.equal(await this.sake.lpTokenPID(this.lp.address), 1);
            assert.equal(await this.sake.lpTokenPID(this.lp2.address), 2);
            assert.equal(await this.sake.poolLength(), 2);
        });

        it('handover the saketoken mintage right', async () => {
            this.master = await SakeMaster.new(this.sake.address, dev, '50', '0', { from: alice });
            assert.equal(await this.sake.owner(), alice);
            await this.sake.transferOwnership(this.master.address, { from: alice });
            assert.equal(await this.sake.owner(), this.master.address);
            await this.master.handoverSakeMintage(bob);
            assert.equal(await this.sake.owner(), bob);
        });

    });
});
