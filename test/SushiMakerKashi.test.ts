import { expect } from "chai";
import { prepare, deploy, getBigNumber, createSLP } from "./utilities"

describe("KashiSushiMaker", function () {
  before(async function () {
    await prepare(this, ["SushiMakerKashi", "SushiBar", "ERC20Mock", "UniswapV2Factory", "UniswapV2Pair", "BentoBoxV1", "KashiPairMediumRiskV1"])
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
    await deploy(this, [["bento", this.BentoBoxV1, [this.weth.address]]])
    await deploy(this, [["kashi", this.KashiPairMediumRiskV1, [this.bento.address]]])
    await deploy(this, [["kashiMaker", this.SushiMakerKashi, [this.factory.address, this.bar.address, this.bento.address, this.sushi.address, this.weth.address, this.factory.pairCodeHash()]]])
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
      await expect(this.kashiMaker.setBridge(this.sushi.address, this.weth.address)).to.be.revertedWith("Maker: Invalid bridge")
    })

    it("does not allow to set bridge for WETH", async function () {
      await expect(this.kashiMaker.setBridge(this.weth.address, this.sushi.address)).to.be.revertedWith("Maker: Invalid bridge")
    })

    it("does not allow to set bridge to itself", async function () {
      await expect(this.kashiMaker.setBridge(this.dai.address, this.dai.address)).to.be.revertedWith("Maker: Invalid bridge")
    })

    it("emits correct event on bridge", async function () {
      await expect(this.kashiMaker.setBridge(this.dai.address, this.sushi.address))
        .to.emit(this.kashiMaker, "LogBridgeSet")
        .withArgs(this.dai.address, this.sushi.address)
    })
  })
})
