const { ethers } = require("hardhat")
const { prepare, deploy, getBigNumber, createSLP } = require("./utilities")
const { expect } = require("chai")

describe("SwipeMaker", function () {
    before(async function () {
        await prepare(this, ["SwipeMaker", 'SwipeBar', 'SwipeMakerExploitMock', 'RevertingERC20Mock', 'SwipeswapV2Factory', 'SwipeswapV2Pair'])
      })
    
      beforeEach(async function () {
        await deploy(this, 
            [['swipe', this.RevertingERC20Mock,  ["SWIPE", "SWIPE", getBigNumber("10000000")]], 
            ['dai', this.RevertingERC20Mock, ["DAI", "DAI", getBigNumber("10000000")]],
            ['mic', this.RevertingERC20Mock, ["MIC", "MIC", getBigNumber("10000000")]],
            ['usdc', this.RevertingERC20Mock, ["USDC", "USDC", getBigNumber("10000000")]],
            ['weth', this.RevertingERC20Mock, ["WETH", "ETH", getBigNumber("10000000")]],
            ['strudel', this.RevertingERC20Mock, ["$TRDL", "$TRDL", getBigNumber("10000000")]],
            ['factory', this.SwipeswapV2Factory, [this.alice.address]]
            ])
        await deploy(this, [['bar', this.SwipeBar, [this.swipe.address]]])
        await deploy(this, [['swipeMaker', this.SwipeMaker, [this.factory.address, this.bar.address, this.swipe.address, this.weth.address]]])
        await deploy(this, [['exploiter', this.SwipeMakerExploitMock, [this.swipeMaker.address]]])
        await createSLP(this, 'swipeEth', this.swipe, this.weth, getBigNumber(10))
        await createSLP(this, 'strudelEth', this.strudel, this.weth, getBigNumber(10))
        await createSLP(this, 'daiEth', this.dai, this.weth, getBigNumber(10))
        await createSLP(this, 'usdcEth', this.usdc, this.weth, getBigNumber(10))
        await createSLP(this, 'micUSDC', this.mic, this.usdc, getBigNumber(10))
        await createSLP(this, 'swipeUSDC', this.swipe, this.usdc, getBigNumber(10))
        await createSLP(this, 'daiUSDC', this.dai, this.usdc, getBigNumber(10))
        await createSLP(this, 'daiMIC', this.dai, this.mic, getBigNumber(10))
      })
    describe('setBridge', function(){
        it('does not allow to set bridge for Swipe', async function(){
            await expect(this.swipeMaker.setBridge(this.swipe.address, this.weth.address)).to.be.revertedWith(
                "SwipeMaker: Invalid bridge"
            )
        })

        it('does not allow to set bridge for WETH', async function(){
            await expect(this.swipeMaker.setBridge(this.weth.address, this.swipe.address)).to.be.revertedWith(
                "SwipeMaker: Invalid bridge"
            )
        })

        it('does not allow to set bridge to itself', async function(){
            await expect(this.swipeMaker.setBridge(this.dai.address, this.dai.address)).to.be.revertedWith(
                "SwipeMaker: Invalid bridge"
            )
        })

        it('emits correct event on bridge', async function(){
            await expect(this.swipeMaker.setBridge(this.dai.address, this.swipe.address)).to.emit(
                this.swipeMaker, "LogBridgeSet"
            ).withArgs(this.dai.address, this.swipe.address)
        })
    })
    describe("convert", function () {
        it("should convert SWIPE - ETH", async function () {
            await this.swipeEth.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.convert(this.swipe.address, this.weth.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipeEth.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1897569270781234370')
        })

        it("should convert USDC - ETH", async function () {
            await this.usdcEth.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.convert(this.usdc.address, this.weth.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.usdcEth.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1590898251382934275')
        })

        it("should convert $TRDL - ETH", async function () {
            await this.strudelEth.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.convert(this.strudel.address, this.weth.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.strudelEth.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1590898251382934275')
        })

        it("should convert USDC - SWIPE", async function () {
            await this.swipeUSDC.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.convert(this.usdc.address, this.swipe.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipeUSDC.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1897569270781234370')
        })

        it('should convert using standard ETH path', async function (){
            await this.daiEth.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.convert(this.dai.address, this.weth.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.daiEth.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1590898251382934275')
        })

        it('converts MIC/USDC using more complex path', async function (){
            await this.micUSDC.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.setBridge(this.usdc.address, this.swipe.address)
            await this.swipeMaker.setBridge(this.mic.address, this.usdc.address)
            await this.swipeMaker.convert(this.mic.address, this.usdc.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.micUSDC.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1590898251382934275')
        })

        it('converts DAI/USDC using more complex path', async function (){
            await this.daiUSDC.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.setBridge(this.usdc.address, this.swipe.address)
            await this.swipeMaker.setBridge(this.dai.address, this.usdc.address)
            await this.swipeMaker.convert(this.dai.address, this.usdc.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.daiUSDC.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1590898251382934275')
        })

        it('converts DAI/MIC using two step path', async function (){
            await this.daiMIC.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.setBridge(this.dai.address, this.usdc.address)
            await this.swipeMaker.setBridge(this.mic.address, this.dai.address)
            await this.swipeMaker.convert(this.dai.address, this.mic.address)
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.daiMIC.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('1200963016721363748')
        })

        it('reverts if it loops back', async function (){
            await this.daiMIC.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.setBridge(this.dai.address, this.mic.address)
            await this.swipeMaker.setBridge(this.mic.address, this.dai.address)
            await expect(this.swipeMaker.convert(this.dai.address, this.mic.address)).to.be.reverted
        })

        it("reverts if caller is not EOA", async function () {
            await this.swipeEth.transfer(this.swipeMaker.address, getBigNumber(1))
            await expect(this.exploiter.convert(this.swipe.address, this.weth.address)).to.be.revertedWith(
                "SwipeMaker: must use EOA"
            )
        })

        it('reverts if pair does not exist', async function (){
            await expect(this.swipeMaker.convert(this.mic.address, this.micUSDC.address)).to.be.revertedWith(
                "SwipeMaker: Invalid pair"
            )
        })

        it('reverts if no path is available', async function (){
            await this.micUSDC.transfer(this.swipeMaker.address, getBigNumber(1))
            await expect(this.swipeMaker.convert(this.mic.address, this.usdc.address)).to.be.revertedWith(
                'SwipeMaker: Cannot convert'
            )
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.micUSDC.balanceOf(this.swipeMaker.address)).to.equal(getBigNumber(1))
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal(0)
        })
    })

    describe('convertMultiple', function (){
        it('should allow to convert multiple', async function() {
            await this.daiEth.transfer(this.swipeMaker.address, getBigNumber(1)) 
            await this.swipeEth.transfer(this.swipeMaker.address, getBigNumber(1))
            await this.swipeMaker.convertMultiple([this.dai.address, this.swipe.address], [this.weth.address, this.weth.address])
            expect(await this.swipe.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.daiEth.balanceOf(this.swipeMaker.address)).to.equal(0)
            expect(await this.swipe.balanceOf(this.bar.address)).to.equal('3186583558687783097')
        })
    })

})