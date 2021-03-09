import { expect } from "chai";
import { prepare, deploy, getBigNumber, createSLP } from "./utilities"

describe("SushiMaker", function () {
  before(async function () {
    await prepare(this, ["SushiMaker", "SushiBar", "SushiMakerExploitMock", "ERC20Mock", "UniswapV2Factory", "UniswapV2Pair"])
  })

  beforeEach(async function () {
    await deploy(this, [
      ["sushi", this.ERC20Mock, ["SUSHI", "SUSHI", getBigNumber("10000000")]],
      ["dai", this.ERC20Mock, ["DAI", "DAI", getBigNumber("10000000")]],
      ["mic", this.ERC20Mock, ["MIC", "MIC", getBigNumber("10000000")]],
      ["usdc", this.ERC20Mock, ["USDC", "USDC", getBigNumber("10000000")]],
      ["weth", this.ERC20Mock, ["WETH", "ETH", getBigNumber("10000000")]],
      ["strudel", this.ERC20Mock, ["$TRDL", "$TRDL", getBigNumber("10000000")]],
      ["factory", this.UniswapV2Factory, [this.alice.address]],
    ])
    await deploy(this, [["bar", this.SushiBar, [this.sushi.address]]])
    await deploy(this, [["sushiMaker", this.SushiMaker, [this.factory.address, this.bar.address, this.sushi.address, this.weth.address]]])
    await deploy(this, [["exploiter", this.SushiMakerExploitMock, [this.sushiMaker.address]]])
    await createSLP(this, "sushiEth", this.sushi, this.weth, getBigNumber(10))
    await createSLP(this, "strudelEth", this.strudel, this.weth, getBigNumber(10))
    await createSLP(this, "daiEth", this.dai, this.weth, getBigNumber(10))
    await createSLP(this, "usdcEth", this.usdc, this.weth, getBigNumber(10))
    await createSLP(this, "micUSDC", this.mic, this.usdc, getBigNumber(10))
    await createSLP(this, "sushiUSDC", this.sushi, this.usdc, getBigNumber(10))
    await createSLP(this, "daiUSDC", this.dai, this.usdc, getBigNumber(10))
    await createSLP(this, "daiMIC", this.dai, this.mic, getBigNumber(10))
  })
  describe("setBridge", function () {
    it("does not allow to set bridge for Sushi", async function () {
      await expect(this.sushiMaker.setBridge(this.sushi.address, this.weth.address)).to.be.revertedWith("SushiMaker: Invalid bridge")
    })

    it("does not allow to set bridge for WETH", async function () {
      await expect(this.sushiMaker.setBridge(this.weth.address, this.sushi.address)).to.be.revertedWith("SushiMaker: Invalid bridge")
    })

    it("does not allow to set bridge to itself", async function () {
      await expect(this.sushiMaker.setBridge(this.dai.address, this.dai.address)).to.be.revertedWith("SushiMaker: Invalid bridge")
    })

    it("emits correct event on bridge", async function () {
      await expect(this.sushiMaker.setBridge(this.dai.address, this.sushi.address))
        .to.emit(this.sushiMaker, "LogBridgeSet")
        .withArgs(this.dai.address, this.sushi.address)
    })
  })
  describe("convert", function () {
    it("should convert SUSHI - ETH", async function () {
      await this.sushiEth.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.convert(this.sushi.address, this.weth.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushiEth.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1897569270781234370")
    })

    it("should convert USDC - ETH", async function () {
      await this.usdcEth.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.convert(this.usdc.address, this.weth.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.usdcEth.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("should convert $TRDL - ETH", async function () {
      await this.strudelEth.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.convert(this.strudel.address, this.weth.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.strudelEth.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("should convert USDC - SUSHI", async function () {
      await this.sushiUSDC.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.convert(this.usdc.address, this.sushi.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushiUSDC.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1897569270781234370")
    })

    it("should convert using standard ETH path", async function () {
      await this.daiEth.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.convert(this.dai.address, this.weth.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.daiEth.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts MIC/USDC using more complex path", async function () {
      await this.micUSDC.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.setBridge(this.usdc.address, this.sushi.address)
      await this.sushiMaker.setBridge(this.mic.address, this.usdc.address)
      await this.sushiMaker.convert(this.mic.address, this.usdc.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.micUSDC.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts DAI/USDC using more complex path", async function () {
      await this.daiUSDC.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.setBridge(this.usdc.address, this.sushi.address)
      await this.sushiMaker.setBridge(this.dai.address, this.usdc.address)
      await this.sushiMaker.convert(this.dai.address, this.usdc.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.daiUSDC.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1590898251382934275")
    })

    it("converts DAI/MIC using two step path", async function () {
      await this.daiMIC.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.setBridge(this.dai.address, this.usdc.address)
      await this.sushiMaker.setBridge(this.mic.address, this.dai.address)
      await this.sushiMaker.convert(this.dai.address, this.mic.address)
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.daiMIC.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("1200963016721363748")
    })

    it("reverts if it loops back", async function () {
      await this.daiMIC.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.setBridge(this.dai.address, this.mic.address)
      await this.sushiMaker.setBridge(this.mic.address, this.dai.address)
      await expect(this.sushiMaker.convert(this.dai.address, this.mic.address)).to.be.reverted
    })

    it("reverts if caller is not EOA", async function () {
      await this.sushiEth.transfer(this.sushiMaker.address, getBigNumber(1))
      await expect(this.exploiter.convert(this.sushi.address, this.weth.address)).to.be.revertedWith("SushiMaker: must use EOA")
    })

    it("reverts if pair does not exist", async function () {
      await expect(this.sushiMaker.convert(this.mic.address, this.micUSDC.address)).to.be.revertedWith("SushiMaker: Invalid pair")
    })

    it("reverts if no path is available", async function () {
      await this.micUSDC.transfer(this.sushiMaker.address, getBigNumber(1))
      await expect(this.sushiMaker.convert(this.mic.address, this.usdc.address)).to.be.revertedWith("SushiMaker: Cannot convert")
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.micUSDC.balanceOf(this.sushiMaker.address)).to.equal(getBigNumber(1))
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal(0)
    })
  })

  describe("convertMultiple", function () {
    it("should allow to convert multiple", async function () {
      await this.daiEth.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiEth.transfer(this.sushiMaker.address, getBigNumber(1))
      await this.sushiMaker.convertMultiple([this.dai.address, this.sushi.address], [this.weth.address, this.weth.address])
      expect(await this.sushi.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.daiEth.balanceOf(this.sushiMaker.address)).to.equal(0)
      expect(await this.sushi.balanceOf(this.bar.address)).to.equal("3186583558687783097")
    })
  })
})
