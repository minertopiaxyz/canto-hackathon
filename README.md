# Free Public Doge $DOGF

## Submission for Canto Hackathon S2
![enter image description here](https://raw.githubusercontent.com/minertopiaxyz/canto-hackathon/main/public/DOGF_DAPP.png)

The project now live on [CANTO](https://canto.io/) !!

Check the dapp here: [dogf.raijin.tech](https://dogf.raijin.tech) or [canto-hackathon.vercel.app](https://canto-hackathon.vercel.app/)

Check the video walkthrough here: [loom video link](https://www.loom.com/share/f6c47018688f444388ec55d1a9664dbb?sid=b2674a96-020f-4556-baa1-0d2bcd0b20d6)

## Problem Statement

Canto is a public EVM blockchain that offers the advantages of [Free Public Infrastructure](https://docs.canto.io/free-public-infrastructure) primitives such as Canto DEX, Canto Lending Market, NOTE, and CSR. However, due to a lack of a user-friendly interface and weak community engagement, these advantages are not widely known.

## Idea To Solve This Problem
Our idea is to build a meme token that integrates with all of Canto's free public infrastructure and creates interesting mechanisms using them.

**Why a meme token?**
Meme tokens are an effective and fun way to engage the community for a purpose. Our purpose is to foster a vibrant community within Canto while simultaneously showcasing Canto's advantages.

  

## About Free Public Doge DOGF
**DOGF** is a meme token that integrates [CSR (Contract Shared Revenue)](https://docs.canto.io/evm-development/contract-secured-revenue), NOTE (Canto Stable Token), Canto Lending Market, and Canto DEX to "hack" itself and inflate its price.

DOGF consists of four contracts:

**cantohackathon.sol**: This contract handles initialization and registers all other contract addresses. Initially, it holds the entire DOGF supply and then distributes it to initial liquidity in Canto DEX, the NOTE staking contract, and the LP staking contract. [Verify the contract.](https://www.oklink.com/canto/address/0x44b020d79494dd3984eef098e53ec00c521282be/contract)

**dogtoken.sol**: This is a unique ERC-20 token registered with Canto CSR. It holds its own Turnstile NFT and can withdraw shared revenue from CSR. The token then uses the revenue to buy itself from Canto DEX and burns the purchased tokens. [Verify the contract.](https://www.oklink.com/canto/address/0x3ba72f90e56e5f02c0d00663d286f65a626d01b1/contract)

**petshop.sol**: This contract acts as a vault for NOTE staking, allowing users to earn DOGF rewards. Unstake anytime. Staked NOTE is sent to Canto Lending Market as CNOTE to generate interest. The interest is then used to buy DOGF from Canto DEX and then burned. [Verify the contract.](https://www.oklink.com/canto/address/0x04eae49abe82e9b2012575067646fc1a6b8840db/contract)

**thepark.sol**: This is a vault for LP tokens staking, where users can earn DOGF rewards. Unstake anytime. LP tokens are received when users provide liquidity for the DOGF/NOTE pair on Canto DEX. [Verify the contract.](https://www.oklink.com/canto/address/0x51be38d8e2b98a0b7338ff647e833a154b5b02a8/contract)

## Build Step
### Contracts

1. Enter folder sc
2. Ensure nodejs version is 18
3. Run: npm install
4. Copy .env-example to .env, and set value for PRIVATEKEY_DEV
5. Run: npx hardhat compile
6. Run: npx hardhat run --network canto scripts/deploy.js
7. Take notes for contracts address on console out

  

### Frontend

1. Enter folder client
2. Ensure nodejs version is 18
3. Run: npm install
4. Modify src/Config.js: Set MASTER: "address of cantohackathon contract deployed"
5. Modify src/Config.js: Set TOKEN_ADDRESS: "address of dogtoken contract deployed"
6. Modify src/Config.js: May set CH_URL, DT_URL, PS_URL, TP_URL as explorer url for contract: cantohackathon, dogtoken, petshop, thepark.
7. Run: npm run start
8. Open page http://localhost:3000