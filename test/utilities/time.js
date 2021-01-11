const {
  ethers: { BigNumber },
} = require("hardhat")

async function advanceBlockTo(blockNumber) {
  for (let i = await ethers.provider.getBlockNumber(); i < blockNumber; i++) {
    await ethers.provider.send("evm_mine", [])
  }
}

const duration = {
  seconds: function (val) {
    return new BigNumber(val)
  },
  minutes: function (val) {
    return new BigNumber(val).mul(this.seconds("60"))
  },
  hours: function (val) {
    return new BigNumber(val).mul(this.minutes("60"))
  },
  days: function (val) {
    return new BigNumber(val).mul(this.hours("24"))
  },
  weeks: function (val) {
    return new BigNumber(val).mul(this.days("7"))
  },
  years: function (val) {
    return new BigNumber(val).mul(this.days("365"))
  },
}

module.exports = {
  advanceBlockTo,
  duration,
}
