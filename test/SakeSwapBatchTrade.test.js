const MockERC20 = artifacts.require('MockERC20');
const SakeSwapRouter = artifacts.require('SakeSwapRouter');
const SakeSwapFactory = artifacts.require('SakeSwapFactory');
const SakeSwapPair = artifacts.require('SakeSwapPair');
const Weth = artifacts.require('WETH9');
const SakeSwapBatchTrade = artifacts.require('SakeSwapBatchTrade');
const SakeSwapSlippageToken = artifacts.require('SakeSwapSlippageToken');
const { BN } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

contract('SakeSwapBatchTrade', ([alice, bob, minter]) => {
    beforeEach(async () => {
        this.weth = await Weth.new();
        this.factory = await SakeSwapFactory.new(alice);
        this.router = await SakeSwapRouter.new(this.factory.address, this.weth.address)
        this.tokenA = await MockERC20.new('TOKENA', 'TOKENA', '10000000000000000000000000000');
        this.tokenB = await MockERC20.new('TOKENB', 'TOKENB', '10000000000000000000000000000');
        this.sakeSwapBatchTrade = await SakeSwapBatchTrade.new(this.router.address, this.weth.address, this.factory.address);
        this.tokenABPair = await SakeSwapPair.at((await this.factory.createPair(this.tokenA.address, this.tokenB.address)).logs[0].args.pair);
        this.stokenAB = await SakeSwapSlippageToken.at((await this.tokenABPair.stoken()));
        await this.tokenA.approve(this.router.address, '1000000000000000000000');
        this.tokenAETHPair = await SakeSwapPair.at((await this.factory.createPair(this.tokenA.address, this.weth.address)).logs[0].args.pair);
        this.stokenAETH = await SakeSwapSlippageToken.at((await this.tokenAETHPair.stoken()));
        await this.router.addLiquidityETH(this.tokenA.address, '1000000000000000000000', '0', '0', alice, '10000000000000', { value:'50000000000000000000' });
    });

    it('should swap from tokenA to tokenB 10 times successfully', async () => {
        await this.tokenA.approve(this.router.address, '1000000');
        await this.tokenB.approve(this.router.address, '1000000');
        await this.router.addLiquidity(this.tokenA.address, this.tokenB.address, '1000000', '1000000', '0', '0', alice, '10000000000000');
        await this.tokenA.transfer(bob, 10000);
        await this.tokenA.approve(this.sakeSwapBatchTrade.address, 10000, { from:bob });
        const tx = await this.sakeSwapBatchTrade.swapExactTokensForTokens(this.tokenA.address, this.tokenB.address, 10000, 10, { from:bob });
        console.log("gas used when swap token 10 times:" + tx.receipt.gasUsed);
        const bal = await this.stokenAB.balanceOf(bob);
        console.log("stoken amount when swap token 10 times:" + bal.toString())
    });

    it('should swap from tokenA to tokenB 20 time successfully', async () => {
        await this.tokenA.approve(this.router.address, '1000000');
        await this.tokenB.approve(this.router.address, '1000000');
        await this.router.addLiquidity(this.tokenA.address, this.tokenB.address, '1000000', '1000000', '0', '0', alice, '10000000000000');
        await this.tokenA.transfer(bob, 10000);
        await this.tokenA.approve(this.router.address, 10000, { from:bob });
        await this.router.swapExactTokensForTokens(10000, 0, [this.tokenA.address, this.tokenB.address], bob, 100000000000, true, { from:bob });

        await this.tokenA.transfer(bob, 10000);
        await this.tokenA.approve(this.sakeSwapBatchTrade.address, 10000, { from:bob });
        const tx = await this.sakeSwapBatchTrade.swapExactTokensForTokens(this.tokenA.address, this.tokenB.address, 10000, 20, { from:bob });
        console.log("gas used when swap token 20 times:" + tx.receipt.gasUsed);
        const bal = await this.stokenAB.balanceOf(bob);
        console.log("stoken amount when swap token 20 times:" + bal.toString())
    });

    it('should swap from ETH to other tokens 10 times successfully', async () => {
        const ethBefore = await web3.eth.getBalance(alice);
        const tx = await this.sakeSwapBatchTrade.swapExactETHForTokens(this.tokenA.address, 10, { value:'5000000000000000000' });
        console.log("gas used when swap eth 10 times:" + tx.receipt.gasUsed);
        const bal = await this.stokenAETH.balanceOf(alice);
        console.log("stoken amount when swap eth 10 times:" + bal.toString())
        const ethAfter = await web3.eth.getBalance(alice);
        console.log("eth diff: " + new BN(ethBefore).sub(new BN(ethAfter)).toString());
    });

    it('should swap from ETH to other tokens 20 times successfully', async () => {
        const tx = await this.sakeSwapBatchTrade.swapExactETHForTokens(this.tokenA.address, 20, { value:'5000000000000000000' });
        console.log("gas used when swap eth 20 times:" + tx.receipt.gasUsed);
        const bal = await this.stokenAETH.balanceOf(alice);
        console.log("stoken amount when swap eth 20 times:" + bal.toString())
    });

    it('simulate ETH/SAKE', async () => {
        await this.tokenA.approve(this.router.address, '626040003377443802568');
        await this.tokenB.approve(this.router.address, '3640731189940203812597030');
        await this.router.addLiquidity(this.tokenA.address, this.tokenB.address, '626040003377443802568', '3640731189940203812597030', '0', '0', alice, '10000000000000');
        await this.tokenA.transfer(bob, '10000000000000000000');
        await this.tokenA.approve(this.sakeSwapBatchTrade.address, '10000000000000000000', { from:bob });
        const tx = await this.sakeSwapBatchTrade.swapExactTokensForTokens(this.tokenA.address, this.tokenB.address, '10000000000000000000', 20, { from:bob });
        console.log("gas used when swap token 20 times:" + tx.receipt.gasUsed);
        const bal = await this.stokenAB.balanceOf(bob);
        console.log("stoken amount when swap token 20 times:" + bal.toString())
        const amountBefore = new BN('10000000000000000000');
        const amountAfter = await this.tokenA.balanceOf(bob);
        console.log("token consumed:" + amountBefore.sub(amountAfter).toString());
    });

    it('simulate USDT/SAKE', async () => {
        await this.tokenA.approve(this.router.address, '134540036859');
        await this.tokenB.approve(this.router.address, '2224606362139919175367190');
        await this.router.addLiquidity(this.tokenA.address, this.tokenB.address, '134540036859', '2224606362139919175367190', '0', '0', alice, '10000000000000');
        await this.tokenA.transfer(bob, '1000000000');
        await this.tokenA.approve(this.sakeSwapBatchTrade.address, '1000000000', { from:bob });
        const tx = await this.sakeSwapBatchTrade.swapExactTokensForTokens(this.tokenA.address, this.tokenB.address, '1000000000', 20, { from:bob });
        console.log("gas used when swap token 20 times:" + tx.receipt.gasUsed);
        const bal = await this.stokenAB.balanceOf(bob);
        console.log("stoken amount when swap token 20 times:" + bal.toString())
        const amountBefore = new BN('1000000000');
        const amountAfter = await this.tokenA.balanceOf(bob);
        console.log("token consumed:" + amountBefore.sub(amountAfter).toString());
    });

    it('simulate DAI/SAKE', async () => {
        await this.tokenA.approve(this.router.address, '122128487545352375034784');
        await this.tokenB.approve(this.router.address, '2049948337074231388356097');
        await this.router.addLiquidity(this.tokenA.address, this.tokenB.address, '122128487545352375034784', '2049948337074231388356097', '0', '0', alice, '10000000000000');
        await this.tokenA.transfer(bob, '1000000000000000000000');
        await this.tokenA.approve(this.sakeSwapBatchTrade.address, '1000000000000000000000', { from:bob });
        const tx = await this.sakeSwapBatchTrade.swapExactTokensForTokens(this.tokenA.address, this.tokenB.address, '1000000000000000000000', 20, { from:bob });
        console.log("gas used when swap token 20 times:" + tx.receipt.gasUsed);
        const bal = await this.stokenAB.balanceOf(bob);
        console.log("stoken amount when swap token 20 times:" + bal.toString())
        const amountBefore = new BN('1000000000000000000000');
        const amountAfter = await this.tokenA.balanceOf(bob);
        console.log("token consumed:" + amountBefore.sub(amountAfter).toString());
    });
});