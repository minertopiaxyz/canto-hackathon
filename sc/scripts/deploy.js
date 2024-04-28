// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require('dotenv').config();
const { ethers, upgrades } = require("hardhat");
const maxUINT = ethers.constants.MaxUint256;

const zero18 = '000000000000000000';

async function getSC(scName, scAddr) {
  const SC = await ethers.getContractFactory(scName);
  const sc = await SC.attach(scAddr);
  return sc;
}

async function main() {
  const noteAddress = '0x03F734Bd9847575fDbE9bEaDDf9C166F880B5E5f'; // testnet
  // const noteAddress = '0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503'; // mainnet
  const note = await getSC('ERC20', noteAddress);
  const noteName = await note.name();
  console.log(noteName);

  console.log('deploy DogToken');
  let SC = await ethers.getContractFactory("DogToken");
  const dogtoken = await SC.deploy();
  console.log('done!');

  console.log('deploy PetShop');
  SC = await ethers.getContractFactory("PetShop");
  const petshop = await SC.deploy();
  console.log('done!');

  console.log('deploy ThePark');
  SC = await ethers.getContractFactory("ThePark");
  const thepark = await SC.deploy();
  console.log('done!');

  SC = await ethers.getContractFactory("CantoHackathon");
  const cantohackathon = await SC.deploy(dogtoken.address, petshop.address, thepark.address);
  console.log('cantohackathon address: ' + cantohackathon.address);

  let tx = await dogtoken.approve(cantohackathon.address, maxUINT);
  console.log(tx.hash);
  await tx.wait();
  console.log('done!');

  tx = await cantohackathon.setupStep1();
  console.log(tx.hash);
  await tx.wait();
  console.log('done!');

  tx = await note.transfer(cantohackathon.address, '10' + zero18);
  console.log(tx.hash);
  await tx.wait();
  console.log('done!');

  tx = await cantohackathon.setupStep2();
  console.log(tx.hash);
  await tx.wait();
  console.log('done!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// reset steps:
// 0. rm -rf cache
// 1. rm -rf .openzeppelin
// 2. rm -rf artifacts

// deploy:
// use nodejs v18
// npx hardhat compile
// npx hardhat run --network testnet scripts/deploy.js

// npx hardhat verify --network testnet [sc address]

// cantohackathon: 0xc87F388e0edcc27Fd240f71E094C44CE72EE8a46 testnet















