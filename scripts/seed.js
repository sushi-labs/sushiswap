async function main() {

  const { alice, bob, carol } = await getNamedAccounts()
  
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const lp = await ERC20Mock.deploy("LPToken", "LP", "10000000000")
  
  console.log("LP deployed to:", lp.address);

  await lp.transfer(alice, "1000")

  await lp.transfer(bob, "1000")

  await lp.transfer(carol, "1000")

  const lp2 = await ERC20Mock.deploy("LPToken2", "LP2", "10000000000")
  
  console.log("LP2 deployed to:", lp2.address);

  await lp2.transfer(alice, "1000")

  await lp2.transfer(bob, "1000")

  await lp2.transfer(carol, "1000")

  const chef = await ethers.getContract("MasterChef");

  await lp.connect().approve(chef.address, "1000")

  await chef.connect(deployments.bob).deposit(0, "100")

  console.log(await lp.balanceOf(bob))

  await chef.connect(deployments.bob).deposit(0, "0")

  console.log(await lp.balanceOf(bob))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });