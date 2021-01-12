const { ethers } = require("hardhat")

const { BigNumber } = ethers

async function advanceBlock() {
  return ethers.provider.send("evm_mine", [])
}

async function advanceBlockTo(blockNumber) {
  for (let i = await ethers.provider.getBlockNumber(); i < blockNumber; i++) {
    await advanceBlock()
  }
}

async function increase(value) {
  await ethers.provider.send("evm_increaseTime", [value.toNumber()])
  await advanceBlock()
}

async function latest() {
  const block = await ethers.provider.getBlock("latest")
  return BigNumber.from(block.timestamp)
}

const duration = {
  seconds: function (val) {
    return BigNumber.from(val)
  },
  minutes: function (val) {
    return BigNumber.from(val).mul(this.seconds("60"))
  },
  hours: function (val) {
    return BigNumber.from(val).mul(this.minutes("60"))
  },
  days: function (val) {
    return BigNumber.from(val).mul(this.hours("24"))
  },
  weeks: function (val) {
    return BigNumber.from(val).mul(this.days("7"))
  },
  years: function (val) {
    return BigNumber.from(val).mul(this.days("365"))
  },
}

module.exports = {
  advanceBlock,
  advanceBlockTo,
  duration,
  latest,
  increase,
}
