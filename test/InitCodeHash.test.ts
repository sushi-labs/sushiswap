import { ethers } from "hardhat";
import { expect } from "chai";

describe("InitCodeHash", function () {
  before(async function () {
    this.InitCodeHash = await ethers.getContractFactory("InitCodeHash")
  })

  beforeEach(async function () {
    this.initcodehash = await this.InitCodeHash.deploy()
  })

  it("Should generate initCodeHash", async function() {
    const data = await this.initcodehash.getInitHash();
    console.log(data);
  })
})

