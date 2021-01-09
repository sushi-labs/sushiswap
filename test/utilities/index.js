const { ethers } = require("hardhat")

function encodeParameters(types, values) {
  const abi = new ethers.utils.AbiCoder()
  return abi.encode(types, values)
}
module.exports = {
  encodeParameters,
  time: require("./time"),
}
