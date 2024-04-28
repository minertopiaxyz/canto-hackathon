import { useEffect, useState, useReducer, createContext } from "react";
import Dapp from './Dapp';
import { dappReducer, dappInitialState } from './reducer/DappReducer';
import PopupTx from "./PopupTx";
import Lib from "./Lib";
import Config from "./Config";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

export const DappContext = createContext();

const LOGO = 'https://res.cloudinary.com/dmyum8dv5/image/upload/f_auto,q_auto/pcsga6bvppeqqyviks4d';
const LIST_CHAIN_ID = Config.LIST_CHAIN_ID;

function Staking({
  stakeTokenSymbol, rewardTokenSymbol, apr, ownedStakeToken, stakedToken, unclaimedRewardToken,
  stakeNeedApprove,
  onClaimReward, onApprove, onStake, onUnstake
}) {
  const [tab, setTab] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const enableStake = !stakeNeedApprove && Number(stakeAmount) > 0 && Number(stakeAmount) <= Number(ownedStakeToken);
  const enableUnstake = Number(unstakeAmount) > 0 && Number(unstakeAmount) <= Number(stakedToken);
  return (
    <div className="w-full grid grid-cols-1 gap-2">
      <div className="grid grid-cols-1 gap-1">
        <div>
          Stake {stakeTokenSymbol} to earn {rewardTokenSymbol}<br />
          <span className="font-bold text-xl">APR {apr}%</span><br />
          Owned: {ownedStakeToken} {stakeTokenSymbol}<br />
          Staked: {stakedToken} {stakeTokenSymbol}<br />
          Reward: {unclaimedRewardToken} {rewardTokenSymbol}<br />
          <div className="flex flex-row gap-2">
            <button className="btn btn-neutral btn-outline btn-sm" onClick={() => onClaimReward()}
              disabled={!(Number(unclaimedRewardToken) > 0)}
            >Claim Reward</button>
          </div>
        </div>
      </div>
      <div role="tablist" className="tabs tabs-bordered">
        <input type="radio" value="tab-0" className="tab" aria-label="Stake"
          checked={tab === 0} onChange={e => e.currentTarget.value === "tab-0" ? setTab(0) : setTab(1)} />
        <div role="tabpanel" className="tab-content">
          <div className="grid grid-cols-1 gap-2 py-2">
            <div className="">
              {/* <input type="number" placeholder={"Stake " + stakeTokenSymbol} className="input input-bordered w-full"
                value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)}
              /> */}
              <label className="flex input input-bordered items-center flex-1">
                <input
                  className='w-3/4 md:w-full grow'
                  value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)}
                  type="number" placeholder={"Stake " + stakeTokenSymbol} />
                <button onClick={() => setStakeAmount(ownedStakeToken)} className="btn btn-ghost btn-sm">MAX</button>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <button className="btn btn-neutral btn-outline w-full" onClick={() => onApprove()}
                  disabled={!stakeNeedApprove}
                >Approve</button>
              </div>
              <div>
                <button
                  disabled={!enableStake}
                  className="btn btn-neutral btn-outline w-full" onClick={() => onStake(stakeAmount)}>Stake</button>
              </div>
            </div>
          </div>
        </div>
        <input type="radio" value="tab-1" className="tab" aria-label="Unstake"
          checked={tab === 1} onChange={e => e.currentTarget.value === "tab-1" ? setTab(1) : setTab(0)} />
        <div role="tabpanel" className="tab-content">
          <div className="grid grid-cols-1 gap-2 py-2">
            <div className="">
              {/* <input type="text" placeholder={"Unstake " + stakeTokenSymbol} className="input input-bordered w-full"
                value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)}
              /> */}
              <label className="flex input input-bordered items-center flex-1">
                <input
                  className='w-3/4 md:w-full grow'
                  value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)}
                  type="number" placeholder={"Unstake " + stakeTokenSymbol} />
                <button onClick={() => setUnstakeAmount(stakedToken)} className="btn btn-ghost btn-sm">MAX</button>
              </label>
            </div>
            <div className="">
              <button
                disabled={!enableUnstake}
                className="btn btn-neutral btn-outline w-full" onClick={() => onUnstake(unstakeAmount)}>Unstake</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pumpMsg1 = 'DOGF got hustle! Registered with CSR (Contract Secured Revenue) and holding its own Turnstile NFT, it taps into the shared transaction fee stream. DOGF then uses that sweet cash to buy itself back on Canto DEX, burn it, permanently yanking the tokens out of circulation. Deflationary drip, anyone?';
const pumpMsg2 = 'Stake NOTE to earn sweet DOGF rewards. Unstake anytime for maximum flexibility. Here`s the twist: Staked NOTE goes on a double duty mission. It generates interest in the Canto Lending Market, and gets used to buy back and incinerate DOGF from the Canto DEX. Talk about burning bright!';
const description = 'DOGF ain`t your average meme coin. It uses cool features from Canto Network: CSR, NOTE, Canto Dex, and Canto Lending Market to "hack" itself to the moon!';
function TheApp() {
  const { chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const connected = (isConnected && LIST_CHAIN_ID.indexOf(chainId + '') >= 0 && walletProvider);

  const [config, setConfig] = useState(Config.NOT_SET);
  const { GAS, TOKEN_ADDRESS, TOKEN_SYMBOL, STAKE_TOKEN, REWARD_TOKEN,
    STAKE_TOKEN2, REWARD_TOKEN2, EXPLORER_URL, GITHUB_URL, CONTRACT_URL,
    LP_URL, NOTE_URL, TOKEN_URL
  } = config;

  // console.log(config);

  const [state, dispatch] = useReducer(dappReducer, dappInitialState);
  const [connection, setConnection] = useState('busy');
  const [dapp, setDapp] = useState(null);
  // const [chainName, setChainName] = useState('');
  const [userData, setUserData] = useState({});
  const [chainData, setChainData] = useState({});

  let { apr1, apr2, interest, csrRevenue, burned1, burned2 } = chainData;

  let {
    ownedStakeToken, stakedToken, unclaimedRewardToken, stakeNeedApprove,
    ownedStakeToken2, stakedToken2, unclaimedRewardToken2, stakeNeedApprove2,
  } = userData;

  const pumpPriceEnable1 = Number(burned1) > 0;
  const pumpPriceEnable2 = Number(burned2) > 0;

  if (connection === 'busy') {
  }

  const refreshData = async () => {
    try {
      const userData = await dapp.getUserData();
      const chainData = await dapp.getChainData();
      setUserData(userData);
      setChainData(chainData);
    } catch (err) {
      console.error(err);
    }
  }

  const onPumpPrice1 = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.pumpPrice1();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onPumpPrice2 = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.pumpPrice2();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onApprove = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.psApprove();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onStake = async (stakeAmount) => {
    const amount = stakeAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.psStake(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onUnstake = async (unstakeAmount) => {
    const amount = unstakeAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.psUnstake(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onClaimReward = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.psClaim();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onApprove2 = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.tpApprove();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onStake2 = async (stakeAmount) => {
    const amount = stakeAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.tpStake(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onUnstake2 = async (unstakeAmount) => {
    const amount = unstakeAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.tpUnstake(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onClaimReward2 = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.tpClaim();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onGetLP = () => {
    Lib.openUrl(LP_URL, true);
  }

  const onGetNOTE = () => {
    Lib.openUrl(NOTE_URL, true);
  }

  const onTrade = () => {
    Lib.openUrl(TOKEN_URL, true);
  }

  const onClickTokenAddress = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);
    toast('DOGF address copied !!');
    // Lib.openUrl(EXPLORER_URL + '/token/' + TOKEN_ADDRESS, true);
  }

  const onClickGithub = () => {
    Lib.openUrl(GITHUB_URL, true);
  }

  const onClickContractCode = () => {
    Lib.openUrl(CONTRACT_URL, true);
  }

  let PanelConnected = null;
  let PanelPump1 = null;
  let PanelPump2 = null;

  const PanelStake1 = <Staking
    stakeTokenSymbol={STAKE_TOKEN}
    rewardTokenSymbol={REWARD_TOKEN}
    apr={apr1}
    ownedStakeToken={ownedStakeToken}
    stakedToken={stakedToken}
    unclaimedRewardToken={unclaimedRewardToken}
    stakeNeedApprove={stakeNeedApprove}
    onClaimReward={onClaimReward}
    onApprove={onApprove}
    onStake={onStake}
    onUnstake={onUnstake}
  />;

  const PanelStake2 = <Staking
    stakeTokenSymbol={STAKE_TOKEN2}
    rewardTokenSymbol={REWARD_TOKEN2}
    apr={apr2}
    ownedStakeToken={ownedStakeToken2}
    stakedToken={stakedToken2}
    unclaimedRewardToken={unclaimedRewardToken2}
    stakeNeedApprove={stakeNeedApprove2}
    onClaimReward={onClaimReward2}
    onApprove={onApprove2}
    onStake={onStake2}
    onUnstake={onUnstake2}
  />;


  PanelConnected = (
    <div className="bg-secondary text-secondary-content p-4 grid grid-cols-1 gap-2">
      <div className="text-center">
        {TOKEN_SYMBOL} Address:<br />
        <span className="btn btn-xs" onClick={onClickTokenAddress}>
          <p className="max-w-[80vw] truncate">{TOKEN_ADDRESS}</p>
        </span>
      </div>
      <div className="text-center">
        Source Code:<br />
        <span className="btn btn-xs" onClick={onClickGithub}>
          <p className="max-w-[80vw] truncate">Github</p>
        </span>
        <span className="ml-2 btn btn-xs" onClick={onClickContractCode}>
          <p className="max-w-[80vw] truncate">Contracts Code</p>
        </span>
      </div>
    </div>
  );

  PanelPump1 = (
    <div className="w-full grid grid-cols-1 gap-2">
      <div>
        CSR Revenue: {csrRevenue} {GAS}<br />
        Est. bought & burned: {burned1} {TOKEN_SYMBOL}
      </div>
      <div>
        <button className="btn btn-neutral btn-outline w-full" disabled={!pumpPriceEnable1} onClick={onPumpPrice1}>Buy & Burn</button>
      </div>
    </div>
  );

  PanelPump2 = (
    <div className="w-full grid grid-cols-1 gap-2">
      <div>
        NOTE Interest: {interest}$<br />
        Est. bought & burned: {burned2} {TOKEN_SYMBOL}
      </div>
      <div>
        <button className="btn btn-neutral btn-outline w-full" disabled={!pumpPriceEnable2} onClick={onPumpPrice2}>Buy & Burn</button>
      </div>
    </div>
  );

  useEffect(() => {
    let busy = false;
    const itv = setInterval(async () => {
      if (!busy) {
        busy = true;
        // do something here
        busy = false;
      }
    }, 60000);

    return () => {
      clearInterval(itv);
    }
  }, []);

  const init = async (_walletProvider) => {
    const ethersProvider = new ethers.providers.Web3Provider(_walletProvider);
    const signer = await ethersProvider.getSigner();
    setConfig(Config.getByChainId('' + chainId));

    const DAPP = new Dapp();
    setDapp(DAPP);

    try {
      await DAPP.loadSigner(signer);
      await DAPP.initContracts();
      const userData = await DAPP.getUserData();
      const chainData = await DAPP.getChainData();
      setUserData(userData);
      setChainData(chainData);
      // setChainName(DAPP.getChainName());
      setConnection('connected');
    } catch (err) {
      console.log(err);
      console.log('metamask error');
      setConnection('error');
    }
  }

  useEffect(() => {
    if (connected) {
      init(walletProvider);
    }
  }, [connected, walletProvider]);

  return (
    <DappContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen flex justify-center bg-gray-500 font-mono text-sm">

        <div className="flex-1 max-w-3xl min-h-screen bg-base-100 flex flex-col">
          <div className="bg-neutral text-neutral-content flex justify-end p-4">
            <w3m-button />
          </div>
          <div className="grid grid-cols-1">
            <div className="p-4 py-8 bg-primary text-primary-content flex flex-col justify-between items-center text-center">

              <div className="avatar flex justify-center items-center">
                <div className="rounded-full w-full md:w-1/4">
                  <img src={LOGO} alt="DOGF LOGO" />
                </div>
              </div>
              <h1 className="text-3xl font-bold">Free Public DOGE?? {TOKEN_SYMBOL}</h1>
              <p>{description}</p>
              <div className="mt-4">
                <button className="btn btn-neutral btn-outline" onClick={onTrade}>
                  Buy/Sell {TOKEN_SYMBOL} On Canto Dex
                </button>
              </div>
            </div>
            <div className="">
              {PanelConnected}
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div className="min-h-fit md:min-h-[50vh] bg-base-100 grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 flex items-center">
                {pumpMsg1}
              </div>
              <div className="p-4 flex items-center">
                {PanelPump1}
              </div>
            </div>
            <div className="min-h-fit md:min-h-[50vh] bg-base-200 grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 flex items-center">
                {pumpMsg2}
              </div>
              <div className="p-4 flex items-center">
                {PanelPump2}
              </div>
            </div>
            <div className="min-h-fit md:min-h-[50vh] bg-base-300 grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 flex flex-col justify-center items-start">
                <p>Prove you're a Canto loyal user! You must have NOTE right?! Stake your NOTE to earn DOGF for free!</p>
                <button className="btn btn-neutral btn-outline btn-sm" onClick={onGetNOTE}>Get NOTE</button>
              </div>
              <div className="p-4 flex items-center">
                {PanelStake1}
              </div>
            </div>
            <div className="min-h-fit md:min-h-[50vh] bg-base-100 grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 flex flex-col justify-center items-start">
                <p>
                  Give DOGF a hand on Canto DEX! They need help with liquidity. Get those {STAKE_TOKEN2}, stake and earn DOGF in return. Boom!
                </p>
                <button className="btn btn-neutral btn-outline btn-sm" onClick={onGetLP}>Get {STAKE_TOKEN2}</button>
              </div>
              <div className="p-4 flex items-center">
                {PanelStake2}
              </div>
            </div>
          </div>
          <div className="flex-1 bg-base-200">
          </div>
          <div className="p-4 bg-neutral text-neutral-content">
            <div>Developed by Raijin for Canto Hackathon S2</div>
          </div>
        </div>
        <PopupTx eurl={EXPLORER_URL + '/tx/'} />
        <Toaster />
      </div >
    </DappContext.Provider>
  );
}

export default TheApp;
