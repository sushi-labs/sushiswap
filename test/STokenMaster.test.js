const { expectRevert, time, BN, expectEvent } = require('@openzeppelin/test-helpers');
const SakeToken = artifacts.require('SakeToken');
const STokenMaster = artifacts.require('STokenMaster');
const MockERC20 = artifacts.require('MockERC20');

contract('STokenMaster', ([alice, bob, carol, jim, minter]) => {
    beforeEach(async () => {
        this.sake = await SakeToken.new({ from: alice });
        this.sTokenMaster = await STokenMaster.new(this.sake.address, bob, carol, '200', '10', '0', '300000', { from: alice });
    });

    it('should set correct state variables', async () => {
        assert.equal(await this.sTokenMaster.sake().valueOf(), this.sake.address);
        assert.equal(await this.sTokenMaster.owner().valueOf(), alice);
        assert.equal(await this.sTokenMaster.admin().valueOf(), bob);
        assert.equal(await this.sTokenMaster.tokenFeeReceiver().valueOf(), carol);
        assert.equal(await this.sTokenMaster.multiplierSToken().valueOf(), "200");
        assert.equal(await this.sTokenMaster.sakePerBlock().valueOf(), "10");
        assert.equal(await this.sTokenMaster.startBlock().valueOf(), "0");
        assert.equal(await this.sTokenMaster.endBlock().valueOf(), "300000");
        assert.equal(await this.sTokenMaster.bonusEndBlock().valueOf(), "192000");
    });

    it('pool info', async () => {
        const lpToken = await MockERC20.new("SakeSwap LP Token", "SLP", "1000000000", { from: alice });
        const sToken = await MockERC20.new("SakeSwap Slippage Token", "SST", "1000000000", { from: alice });

        await expectRevert(this.sTokenMaster.add('100', lpToken.address, sToken.address, false, { from: alice }), 'add:Call must come from admin.');
        await this.sTokenMaster.add('100', lpToken.address, sToken.address, false, { from: bob });
        await expectRevert(this.sTokenMaster.add('100', lpToken.address, sToken.address, false, { from: bob }), 'pool exist');
        assert.equal((await this.sTokenMaster.poolLength()).valueOf(), '1');
        assert.equal((await this.sTokenMaster.poolInfo('0')).allocPoint, '100');
        assert.equal((await this.sTokenMaster.poolInfo('0')).withdrawSwitch, false);

        await expectRevert(this.sTokenMaster.set('0', '200', false, { from: alice }), 'set:Call must come from admin.');
        await this.sTokenMaster.set('0', '200', false, { from: bob });
        assert.equal((await this.sTokenMaster.poolInfo('0')).allocPoint, '200');

        await expectRevert(this.sTokenMaster.setWithdrawSwitch('0', true, false, { from: alice }), 's:Call must come from admin.');
        await this.sTokenMaster.setWithdrawSwitch('0', true, false, { from: bob });
        assert.equal((await this.sTokenMaster.poolInfo('0')).withdrawSwitch, true);
    });

    it('getMultiplier', async () => {
        assert.equal((await this.sTokenMaster.getMultiplier(0, 192000)).valueOf(), '384000');
        assert.equal((await this.sTokenMaster.getMultiplier(2000, 192000)).valueOf(), '380000');
        assert.equal((await this.sTokenMaster.getMultiplier(2000, 202000)).valueOf(), '390000');
        assert.equal((await this.sTokenMaster.getMultiplier(193000, 300000)).valueOf(), '107000');
        assert.equal((await this.sTokenMaster.getMultiplier(193000, 310000)).valueOf(), '107000');
        assert.equal((await this.sTokenMaster.getMultiplier(300000, 310000)).valueOf(), '0');
    });

    context('With ERC/LP token added to the field', () => {
        beforeEach(async () => {
            this.lpToken = await MockERC20.new("SakeSwap LP Token", "SLP", "1000000000", { from: minter });
            this.sToken = await MockERC20.new("SakeSwap Slippage Token", "SST", "1000000000", { from: minter });
            await this.sToken.transfer(alice, '1000', { from: minter });
            await this.sToken.transfer(bob, '1000', { from: minter });
            await this.sToken.transfer(carol, '1000', { from: minter });
            await this.lpToken.transfer(alice, '1000', { from: minter });
            await this.lpToken.transfer(bob, '1000', { from: minter });
            await this.lpToken.transfer(carol, '1000', { from: minter });
            this.lpToken2 = await MockERC20.new("SakeSwap LP Token", "SLP", "1000000000", { from: minter });
            this.sToken2 = await MockERC20.new("SakeSwap Slippage Token", "SST", "1000000000", { from: minter });
            await this.sToken2.transfer(alice, '1000', { from: minter });
            await this.sToken2.transfer(bob, '1000', { from: minter });
            await this.sToken2.transfer(carol, '1000', { from: minter });
            await this.lpToken2.transfer(alice, '1000', { from: minter });
            await this.lpToken2.transfer(bob, '1000', { from: minter });
            await this.lpToken2.transfer(carol, '1000', { from: minter });
        });

        it('should give out SAKEs only after farming time', async () => {
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, carol, '10', '10', '100', '150', { from: alice });
            this.sake.mint(sTokenMaster.address, '10000');
            await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: bob });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: bob });
            await sTokenMaster.deposit(0, '100', '10', { from: bob });
            await time.advanceBlockTo('89');
            await sTokenMaster.deposit(0, '0', '0', { from: bob }); // block 90
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('94');
            await sTokenMaster.deposit(0, '0', '0', { from: bob }); // block 95
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('99');
            await sTokenMaster.deposit(0, '0', '0', { from: bob }); // block 100
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('100');
            await sTokenMaster.deposit(0, '0', '0', { from: bob }); // block 101
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '20');
            await time.advanceBlockTo('104');
            await sTokenMaster.deposit(0, '0', '0', { from: bob }); // block 105
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '100');
        });

        it('should not distribute SAKEs if no one deposit', async () => {
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, carol, '10', '50', '200', '300', { from: alice });
            this.sake.mint(sTokenMaster.address, '1000');
            await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: bob });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: bob });
            await time.advanceBlockTo('199');
            assert.equal((await this.sake.balanceOf(sTokenMaster.address)).valueOf(), '1000');
            await time.advanceBlockTo('204');
            assert.equal((await this.sake.balanceOf(sTokenMaster.address)).valueOf(), '1000');
            await time.advanceBlockTo('209');
            await sTokenMaster.deposit(0, '10', '1', { from: bob }); // block 210
            assert.equal((await this.sake.balanceOf(sTokenMaster.address)).valueOf(), '1000');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.lpToken.balanceOf(bob)).valueOf(), '990');
            assert.equal((await this.sToken.balanceOf(bob)).valueOf(), '999');
            await time.advanceBlockTo('219');
            await sTokenMaster.deposit(0, '10', '1', { from: bob }); // block 220
            assert.equal((await this.sake.balanceOf(sTokenMaster.address)).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '1000');
            assert.equal((await this.lpToken.balanceOf(bob)).valueOf(), '980');
            assert.equal((await this.sToken.balanceOf(bob)).valueOf(), '998');
        });

        it('should distribute SAKEs properly for each staker', async () => {
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, carol, '10', '50', '300', '400', { from: alice });
            this.sake.mint(sTokenMaster.address, '10000');
            await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: bob });
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: carol });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: bob });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: carol });
            // Alice deposits 10 sTokens at block 310
            await time.advanceBlockTo('309');
            await sTokenMaster.deposit(0, '10', '2', { from: alice });
            await time.advanceBlockTo('313');
            // Bob deposits 20 sTokens at block 314
            await sTokenMaster.deposit(0, '20', '3', { from: bob });
            await time.advanceBlockTo('317');
            // Carol deposits 30 sTokens at block 318
            await sTokenMaster.deposit(0, '30', '4', { from: carol });
            await time.advanceBlockTo('319')
            // Alice deposits 10 more sTokens at block 320. At this point:
            // Alice should have: 4*100 + 4*30/80*100 + 2*30/150*100 = 590
            // SakeMaster should have the remaining: 10000 - 589 = 9411
            await sTokenMaster.deposit(0, '10', '1', { from: alice });
            assert.equal((await this.sake.totalSupply()).valueOf(), '10000');
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '589');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(carol)).valueOf(), '0');
            assert.equal((await this.sake.balanceOf(sTokenMaster.address)).valueOf(), '9411');
        });

        it('should give proper SAKEs allocation to each pool', async () => {
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, carol, '10', '50', '400', '500', { from: alice });
            this.sake.mint(sTokenMaster.address, '10000');
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.lpToken2.approve(sTokenMaster.address, '1000', { from: bob });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.sToken2.approve(sTokenMaster.address, '1000', { from: bob });
            // Add first stoken to the pool with allocation 10
            await sTokenMaster.add('10', this.lpToken.address, this.sToken.address, true, { from: bob });
            // Alice deposits 10 lp and 2 stoken at block 410
            await time.advanceBlockTo('409');
            await sTokenMaster.deposit(0, '10', '1', { from: alice });
            // Add sToken2 to the pool with allocation 20 at block 420
            await time.advanceBlockTo('419');
            await sTokenMaster.add('20', this.lpToken2.address, this.sToken2.address, true, { from: bob });
            // Alice should have 10*50 pending reward
            assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '1000');
            // Bob deposits 10 sToken2 at block 425
            await time.advanceBlockTo('424');
            await sTokenMaster.deposit(1, '10', '1', { from: bob });
            // Alice should have 1000 + 5*1/3*100 = 1166 pending reward
            assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '1166');
            await time.advanceBlockTo('430');
            // At block 430. Bob should get 5*2/3*100 = 333. Alice should get ~166 more.
            assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '1333');
            assert.equal((await sTokenMaster.pendingSake(1, bob)).valueOf(), '333');
            assert.equal((await this.sake.balanceOf(sTokenMaster.address)).valueOf(), '10000');
            await sTokenMaster.deposit(0, '0', '0', { from: alice });
            await sTokenMaster.deposit(1, '0', '0', { from: bob });
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '1366');
            assert.equal((await this.sake.balanceOf(bob)).valueOf(), '466');
            assert.equal((await this.sake.balanceOf(sTokenMaster.address)).valueOf(), '8168');
        });

        it('should stop giving SAKEs after the stoken mining is end', async () => {
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, carol, '10', '50', '500', '600', { from: alice });
            this.sake.mint(sTokenMaster.address, '10000');
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: alice });
            await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            // Alice deposits 10 stokens at block 590
            await time.advanceBlockTo('588');
            await expectRevert(sTokenMaster.deposit(0, '0', '1', { from: alice }), 'deposit:invalid');
            await sTokenMaster.deposit(0, '10', '1', { from: alice });
            await sTokenMaster.deposit(0, '0', '1', { from: alice });
            assert.equal((await sTokenMaster.userInfo(0, alice)).amount, '30');
            // At block 605, she should have 50*10*2 = 1000 pending.
            await time.advanceBlockTo('605');
            assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '900');
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '100');
        });

        it('sake owner is sTokenMaster', async () => {
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, carol, '10', '50', '700', '800', { from: alice });
            await this.sake.transferOwnership(sTokenMaster.address, { from: alice });
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: alice });
            // Add first stoken to the pool with allocation 100
            await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            // Alice deposits 10 stokens at block 710
            await time.advanceBlockTo('709');
            await sTokenMaster.deposit(0, '10', '1', { from: alice });
            assert.equal((await this.sake.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('720');
            assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '1000');
            assert.equal((await this.sake.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('729');
            await sTokenMaster.deposit(0, '0', '0', { from: alice });
            assert.equal((await this.sake.totalSupply()).valueOf(), '2000');
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '2000');
        });

        it('with draw', async () => {
            //change STokenMaster WITHDRAW_INTERVAL = 100,save time
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, jim, '10', '50', '800', '900', { from: alice });
            this.sake.mint(sTokenMaster.address, '20000');
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: alice });
            await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            await sTokenMaster.deposit(0, '1000', '1000', { from: alice });
            await time.advanceBlockTo('819');
            await expectRevert(sTokenMaster.withdraw(0, '500','500', { from: alice }), 'withdraw: not allow');
            await sTokenMaster.setWithdrawSwitch('0', true, false, { from: bob });
            await time.advanceBlockTo('948');
            await expectRevert(sTokenMaster.withdraw(0, '1100','500', { from: alice }), 'withdraw: amount not enough');
            await sTokenMaster.withdraw(0, '500','500', { from: alice })
            // alice have sake = 100*100
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '9999');
            assert.equal((await this.lpToken.balanceOf(alice)).valueOf(), '495');
            assert.equal((await this.sToken.balanceOf(alice)).valueOf(), '495');
            assert.equal((await this.lpToken.balanceOf(jim)).valueOf(), '5');
            assert.equal((await this.sToken.balanceOf(jim)).valueOf(), '5');
            assert.equal((await sTokenMaster.userInfo(0, alice)).amountStoken, '500');
            assert.equal((await sTokenMaster.userInfo(0, alice)).amountLPtoken, '500');
            assert.equal((await sTokenMaster.userInfo(0, alice)).amount, '5500');
        });

        it('emergency with draw', async () => {
            const sTokenMaster = await STokenMaster.new(this.sake.address, bob, jim, '10', '50', '950', '1050', { from: alice });
            this.sake.mint(sTokenMaster.address, '20000');
            await this.lpToken.approve(sTokenMaster.address, '1000', { from: alice });
            await this.sToken.approve(sTokenMaster.address, '1000', { from: alice });
            await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            await expectRevert(sTokenMaster.emergencyWithdraw(0, { from: alice }), 'withdraw: not allow');
            await sTokenMaster.setWithdrawSwitch('0', true, false, { from: bob });
            await expectRevert(sTokenMaster.emergencyWithdraw(0, { from: alice }), 'withdraw: amount not enough');
            await sTokenMaster.deposit(0, '1000', '1000', { from: alice });
            await time.advanceBlockTo('1060');
            await sTokenMaster.emergencyWithdraw(0, { from: alice })
            assert.equal((await this.sake.balanceOf(alice)).valueOf(), '0');
            assert.equal((await this.lpToken.balanceOf(alice)).valueOf(), '990');
            assert.equal((await this.sToken.balanceOf(alice)).valueOf(), '990');
            assert.equal((await this.lpToken.balanceOf(jim)).valueOf(), '10');
            assert.equal((await this.sToken.balanceOf(jim)).valueOf(), '10');
            assert.equal((await sTokenMaster.userInfo(0, alice)).amount, '0');
            assert.equal((await sTokenMaster.userInfo(0, alice)).amountStoken, '0');
            assert.equal((await sTokenMaster.userInfo(0, alice)).amountLPtoken, '0');
        });

        // it('set sake per block', async () => {
        //     // set BONUS_BLOCKNUM=100,save time
        //     const sTokenMaster = await STokenMaster.new(this.sake.address, bob, jim, '10', '50', '1100', '1300', { from: alice });
        //     this.sake.mint(sTokenMaster.address, '20000');
        //     await this.lpToken.approve(sTokenMaster.address, '1000', { from: alice });
        //     await this.sToken.approve(sTokenMaster.address, '1000', { from: alice });
        //     await this.lpToken.approve(sTokenMaster.address, '1000', { from: bob });
        //     await this.sToken.approve(sTokenMaster.address, '1000', { from: bob });
        //     await sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
        //     await time.advanceBlockTo('1099');
        //     await sTokenMaster.deposit(0, '1000', '100', { from: alice });
        //     await time.advanceBlockTo('1110');
        //     assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '1000');
        //     await sTokenMaster.setSakePerBlock('100', { from: bob });
        //     assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '2200');
        //     await sTokenMaster.deposit(0, '0', '0', { from: alice });
        //     assert.equal((await this.sake.balanceOf(alice)).valueOf(), '2400');
        //     await time.advanceBlockTo('1119');
        //     await sTokenMaster.setSakePerBlock('150', { from: bob });
        //     assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '2400');
        //     await sTokenMaster.setSakePerBlock('60', { from: bob });
        //     assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '1080');
        //     await time.advanceBlockTo('1210');
        //     //88*120+10*60 = 9300 pending
        //     assert.equal((await sTokenMaster.pendingSake(0, alice)).valueOf(), '11160');
        // });

        it('Burn sake for pool', async () => {
            await this.sTokenMaster.add('100', this.lpToken.address, this.sToken.address, true, { from: bob });
            await this.sTokenMaster.add('100', this.lpToken2.address, this.sToken2.address, true, { from: bob });
            await this.sake.mint(alice, '10000');
            await this.sake.approve(this.sTokenMaster.address, '10000', { from: alice });

            const receipt = await this.sTokenMaster.burnSakeForPool(0, '1000');
            assert.equal((await this.sTokenMaster.poolInfo('0')).burnSakeAmount, '1000');
            expectEvent(receipt, 'BurnSakeForPool', {
                user: alice,
                pid: '0',
                amount: '1000'
            });
            const receipt1 = await this.sTokenMaster.burnSakeForPool(0, '2000');
            assert.equal((await this.sTokenMaster.poolInfo('0')).burnSakeAmount, '3000');
            expectEvent(receipt1, 'BurnSakeForPool', {
                user: alice,
                pid: '0',
                amount: '2000'
            });
        });

        it('set admin', async () => {
            assert.equal(await this.sTokenMaster.admin().valueOf(), bob);
            await expectRevert(this.sTokenMaster.setAdmin(alice, { from: bob }), 'Ownable: caller is not the owner');
            await this.sTokenMaster.setAdmin(alice);
            assert.equal(await this.sTokenMaster.admin().valueOf(), alice);
        });

        it('set endBlock', async () => {
            assert.equal(await this.sTokenMaster.endBlock().valueOf(), '300000');
            await expectRevert(this.sTokenMaster.setEndBlock('500000', { from: alice }), 'end:Call must come from admin.');
            await this.sTokenMaster.setEndBlock('500000', { from: bob });
            assert.equal(await this.sTokenMaster.endBlock().valueOf(), '500000');
        });

        it('set Multiplier', async () => {
            assert.equal(await this.sTokenMaster.multiplierSToken().valueOf(), '200');
            await expectRevert(this.sTokenMaster.setMultiplierSToken('100', { from: alice }), 'm:Call must come from admin.');
            await this.sTokenMaster.setMultiplierSToken('100', { from: bob });
            assert.equal(await this.sTokenMaster.multiplierSToken().valueOf(), '100');
        });

        it('set sake per block', async () => {
            assert.equal(await this.sTokenMaster.sakePerBlock().valueOf(), '10');
            await expectRevert(this.sTokenMaster.setSakePerBlock('20', { from: alice }), 'p:Call must come from admin.');
            await this.sTokenMaster.setSakePerBlock('20', { from: bob });
            assert.equal(await this.sTokenMaster.sakePerBlock().valueOf(), '20');
        });
    });
});