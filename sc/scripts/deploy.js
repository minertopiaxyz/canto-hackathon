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
  // const noteAddress = '0x03F734Bd9847575fDbE9bEaDDf9C166F880B5E5f'; // testnet
  const noteAddress = '0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503'; // mainnet or fork
  const note = await getSC('ERC20', noteAddress);
  const noteName = await note.name();
  console.log(noteName);

  console.log('deploy DogToken');
  let SC = await ethers.getContractFactory("DogToken");
  const dogtoken = await SC.deploy();
  console.log('dogtoken deployed! ' + dogtoken.address);

  console.log('deploy PetShop');
  SC = await ethers.getContractFactory("PetShop");
  const petshop = await SC.deploy();
  console.log('petshop deployed! ' + petshop.address);

  console.log('deploy ThePark');
  SC = await ethers.getContractFactory("ThePark");
  const thepark = await SC.deploy();
  console.log('thepark deployed! ' + thepark.address);

  console.log('deploy CantoHackathon');
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
// npx hardhat run --network fork scripts/deploy.js
// npx hardhat run --network canto scripts/deploy.js

// npx hardhat verify --network testnet [sc address]

// cantohackathon: 0xc87F388e0edcc27Fd240f71E094C44CE72EE8a46 testnet

// canto:
// deploy DogToken
// dogtoken deployed! 0x3ba72F90e56e5f02C0D00663D286f65a626d01B1
// deploy PetShop
// petshop deployed! 0x04Eae49AbE82e9b2012575067646fc1A6B8840Db
// deploy ThePark
// thepark deployed! 0x51BE38d8e2B98a0B7338FF647e833A154B5b02a8
// deploy CantoHackathon
// cantohackathon address: 0x44B020D79494dd3984eef098e53eC00c521282bE
// 0x2e67f9edc2dd13470a7a63ffedbf8b252cb231434dac1446e8918694435403c5
// done!
// 0xc2a942e4d08984cfee7d3efe6f44667412827679f4d5e0b1c717ab4d9651ffbe
// done!
// 0x7d4f645517b4e0d7e1e66ee2095d5c42a51a06458109ac8dbcfe864d411d7eb7
// done!
// 0xd3e2dbcfdc8fae6a0547968764568fe36a0a8fcefd88399ee72d02080c9c699a
// done!

// npx hardhat verify --network canto 0x3ba72F90e56e5f02C0D00663D286f65a626d01B1
// npx hardhat verify --network canto 0x51BE38d8e2B98a0B7338FF647e833A154B5b02a8
// npx hardhat verify --network canto 0x04Eae49AbE82e9b2012575067646fc1A6B8840Db
// npx hardhat verify --network canto 0x44B020D79494dd3984eef098e53eC00c521282bE "0x3ba72F90e56e5f02C0D00663D286f65a626d01B1" "0x04Eae49AbE82e9b2012575067646fc1A6B8840Db" "0x51BE38d8e2B98a0B7338FF647e833A154B5b02a8"













