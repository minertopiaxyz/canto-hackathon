const ethers = require('ethers').ethers;
const maxUINT = ethers.constants.MaxUint256;
const Config = require('./Config');

const CH_ABI = require('./abis/CantoHackathon.json');
const ERC20_ABI = require('./abis/ERC20.json');
const DOGTOKEN_ABI = require('./abis/DogToken.json');
const PETSHOP_ABI = require('./abis/PetShop.json');
const THEPARK_ABI = require('./abis/ThePark.json');

const zero18 = '000000000000000000';

function wei2eth(wei) {
  return ethers.utils.formatUnits(wei, "ether");
}

function eth2wei(eth) {
  return ethers.utils.parseEther(eth);
}

module.exports = class Dapp {
  constructor() {
    this.OPTS = {};
    this.PROVIDER = null;
    this.SIGNER = null;
    this.USER_ADDRESS = null;
    this.RANDOM_WALLET = false;
  }

  async initContracts() {
    console.log('initContracts..');
    const signer = this.SIGNER;
    if (!signer) throw new Error('SIGNER not loaded.');

    const master = this.CONFIG.MASTER;
    console.log(master);
    this.ch = new ethers.Contract(master, CH_ABI, signer);
    const addressToken = await this.ch.addressToken();
    this.token = new ethers.Contract(addressToken, DOGTOKEN_ABI, signer);
    const addressNote = await this.ch.addressNote();
    this.note = new ethers.Contract(addressNote, ERC20_ABI, signer);
    const addressLP = await this.ch.addressLP();
    this.lp = new ethers.Contract(addressLP, ERC20_ABI, signer);
    const addressPetShop = await this.ch.addressPetShop();
    this.petShop = new ethers.Contract(addressPetShop, PETSHOP_ABI, signer);
    const addressThePark = await this.ch.addressThePark();
    this.thePark = new ethers.Contract(addressThePark, THEPARK_ABI, signer);
    console.log('initContracts done..');
    console.log({ addressToken, addressPetShop, addressThePark, addressLP });
  }

  async loadSigner(signer) {
    this.CHAIN_ID = await signer.getChainId() + '';
    console.log(this.CHAIN_ID);
    this.CONFIG = Config.getByChainId(this.CHAIN_ID);
    console.log(this.CONFIG);
    this.PROVIDER = signer.provider;
    this.SIGNER = signer;
    this.USER_ADDRESS = await this.SIGNER.getAddress();
    return this.USER_ADDRESS;
  }

  async loadPrivateKey(pk, chainId, rpc) {
    console.log('** read only wallet **');
    if (!pk) {
      const tmp = ethers.Wallet.createRandom();
      pk = tmp.privateKey;
      this.RANDOM_WALLET = true;
    }
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const signer = new ethers.Wallet(pk, provider);
    return await this.loadSigner(signer);
  }

  isReadOnly() {
    return this.RANDOM_WALLET;
  }

  getSigner() {
    return this.SIGNER;
  }

  getUserAddress() {
    return this.USER_ADDRESS;
  }

  async getBlockTS() {
    return (await this.PROVIDER.getBlock('latest')).timestamp;
  }

  getChainName() {
    return this.CONFIG.CHAIN_NAME;
  }

  async getChainData() {
    try {
      console.log('getChainData..');
      const multiplier = '1' + zero18;
      const oneYear = (365 * 24 * 3600) + '';
      const oneDay = (24 * 3600) + '';
      const balanceTokenInLP = await this.token.balanceOf(this.lp.address);
      const balanceNoteInLP = await this.note.balanceOf(this.lp.address);
      const supplyLP = await this.lp.totalSupply();

      let apr1 = 0;
      let reward1 = 0;
      let apr2 = 0;
      let a;
      let b;

      a = await this.petShop.rewardRate();
      b = await this.petShop.totalSupply();
      if (b.gt('0')) {
        let r = (a.mul(multiplier).mul(oneYear)).div(b);
        const reward = Number(wei2eth(r)) * 100;
        const x = Number(wei2eth(balanceTokenInLP));
        const y = Number(wei2eth(balanceNoteInLP));

        apr1 = Math.floor((reward * y) / x);

        reward1 = wei2eth((a.mul(multiplier).mul(oneDay)).div(b));
      }

      a = await this.thePark.rewardRate();
      b = await this.thePark.totalSupply();
      if (b.gt('0')) {
        let r = (a.mul(multiplier).mul(oneYear)).div(b);
        const reward = Number(wei2eth(r)) * 100;
        // convert reward value to staked value
        const x = Number(wei2eth(balanceTokenInLP));
        const y = Number(wei2eth(supplyLP));
        const z = (2 * x) / y; // z: 1 LP = z token

        apr2 = Math.floor(reward / z);
        console.log({ x, y, z, apr1, apr2, reward1 });
      }

      let interest = 0;
      let burned1 = 0;
      let csrRevenue = 0;
      let burned2 = 0;

      try {
        console.log('simulate petshop pumpprice..');
        const res = await this.petShop.callStatic.pumpPrice();
        if (res[0].gt('0')) {
          interest = Number(wei2eth(res[0]));
          burned2 = Number(wei2eth(res[1]));
        }
        console.log(res);
      } catch (err) {
        console.error('err!!');
      }

      try {
        console.log('simulate dogtoken pumpprice..');
        const res = await this.token.callStatic.pumpPrice();
        if (res[0].gt('0')) {
          csrRevenue = Number(wei2eth(res[0]));
          burned1 = Number(wei2eth(res[1]));
        }
        console.log(res);
      } catch (err) {
        console.error('err!!');
      }
      // interest
      // apr1
      // apr2

      const ret = {
        tokenAddress: this.token.address,
        apr1,
        apr2,
        interest,
        csrRevenue,
        burned1,
        burned2
      }
      console.log(ret);
      return ret;
    } catch (err) {
      console.error('getChainData error..');
      // console.error(err);
    }
    return {};
  }

  async getUserData() {
    try {
      console.log('getUserData..');
      const userAddress = this.USER_ADDRESS;
      const userETH = await this.PROVIDER.getBalance(userAddress);
      const userToken = await this.token.balanceOf(userAddress);
      const userNote = await this.note.balanceOf(userAddress);
      const userLP = await this.lp.balanceOf(userAddress);
      const stakedNote = await this.petShop.balanceOf(userAddress);
      const stakedLP = await this.thePark.balanceOf(userAddress);
      const petShopNeedApprove = await this.needApprove(this.note, this.petShop.address);
      const theParkNeedApprove = await this.needApprove(this.lp, this.thePark.address);
      const petShopUnclaimedReward = await this.petShop.earned(userAddress);
      const theParkUnclaimedReward = await this.thePark.earned(userAddress);

      const ret = {
        userAddress,
        userETH: wei2eth(userETH),
        userToken: wei2eth(userToken),
        userNote: wei2eth(userNote),
        userLP: wei2eth(userLP),

        ownedStakeToken: wei2eth(userNote),
        stakedToken: wei2eth(stakedNote),
        unclaimedRewardToken: wei2eth(petShopUnclaimedReward),
        stakeNeedApprove: petShopNeedApprove,

        ownedStakeToken2: wei2eth(userLP),
        stakedToken2: wei2eth(stakedLP),
        unclaimedRewardToken2: wei2eth(theParkUnclaimedReward),
        stakeNeedApprove2: theParkNeedApprove,
      }
      console.log(ret);
      return ret;
    } catch (err) {
      console.error('getUserData error');
      // console.error(err);
    }
    return {};
  }

  async needApprove(tokenSC, spenderAddress) {
    const userAddress = this.getUserAddress();
    const token = tokenSC;
    const allowance = await token.allowance(userAddress, spenderAddress);
    const owned = await token.balanceOf(userAddress);
    const ok = allowance.gte(owned) && allowance.gt('0');
    return !ok;
  }

  async approve(tokenSC, spenderAddress) {
    const opts = Object.assign({}, this.OPTS);
    const tx = await tokenSC.approve(spenderAddress, maxUINT, opts);
    return tx;
  }

  async pumpPrice1() {
    const tx = await this.token.pumpPrice();
    return tx;
  }

  async pumpPrice2() {
    const tx = await this.petShop.pumpPrice();
    return tx;
  }

  async psApprove() {
    return await this.approve(this.note, this.petShop.address);
  }

  async psStake(amount) {
    const amountWei = eth2wei('' + amount);
    const tx = await this.petShop.stake(amountWei);
    return tx;
  }

  async psUnstake(amount) {
    const amountWei = eth2wei('' + amount);
    const tx = await this.petShop.unstake(amountWei);
    return tx;
  }

  async psClaim() {
    const tx = await this.petShop.getReward();
    return tx;
  }

  async tpApprove() {
    return await this.approve(this.lp, this.thePark.address);
  }

  async tpStake(amount) {
    const amountWei = eth2wei('' + amount);
    const tx = await this.thePark.stake(amountWei);
    return tx;
  }

  async tpUnstake(amount) {
    const amountWei = eth2wei('' + amount);
    const tx = await this.thePark.unstake(amountWei);
    return tx;
  }

  async tpClaim() {
    const tx = await this.thePark.getReward();
    return tx;
  }


}
