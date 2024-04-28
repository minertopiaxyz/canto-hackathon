const LIST_CHAIN_ID = ['7700'];

const config = {
  '7700': {
    GAS: 'CANTO',
    COIN_SYMBOL: 'CANTO',
    TOKEN_SYMBOL: 'DOGF',
    CHAIN_NAME: 'CANTO',
    STAKE_TOKEN: 'NOTE',
    REWARD_TOKEN: 'DOGF',
    STAKE_TOKEN2: 'vAMM-NOTE/DOGF',
    REWARD_TOKEN2: 'DOGF',
    TOKEN_ADDRESS: '0x3ba72F90e56e5f02C0D00663D286f65a626d01B1',
    MASTER: '0x44B020D79494dd3984eef098e53eC00c521282bE',
    RPC: 'http://localhost:8545', // https://canto.slingshot.finance/
    CHAIN_ID: '7700',
    EXPLORER_URL: 'https://oklink.com/canto',
    GITHUB_URL: 'https://github.com/minertopiaxyz/canto-hackathon',
    CONTRACT_URL: 'https://oklink.com/canto/address/CH_ADDRESS/contracts#address-tabs',
    LP_URL: 'https://pools.canto.io/pools?pair=LP_ADDRESS',
    NOTE_URL: 'https://app.slingshot.finance/swap/Canto/0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503',
    TOKEN_URL: 'https://app.slingshot.finance/swap/Canto/TOKEN_ADDRESS'
  },
  '7701': {
    GAS: 'CANTO',
    COIN_SYMBOL: 'CANTO',
    TOKEN_SYMBOL: 'DOGF',
    CHAIN_NAME: 'CANTO TESTNET',
    STAKE_TOKEN: 'NOTE',
    REWARD_TOKEN: 'DOGF',
    STAKE_TOKEN2: 'vAMM-NOTE/DOGF',
    REWARD_TOKEN2: 'DOGF',
    TOKEN_ADDRESS: '0xB086A1C764A8da36c266D3b340F1eb4D6843144C',
    MASTER: '0xc87F388e0edcc27Fd240f71E094C44CE72EE8a46',
    RPC: 'https://canto-testnet.plexnode.wtf',
    CHAIN_ID: '7701',
    EXPLORER_URL: 'https://testnet.tuber.build',
    GITHUB_URL: 'https://github.com/minertopiaxyz/canto-hackathon',
    CONTRACT_URL: 'https://testnet.tuber.build/address/0xc87F388e0edcc27Fd240f71E094C44CE72EE8a46/contracts#address-tabs',
    LP_URL: 'https://pools.canto.io/pools?pair=LP_ADDRESS',
    NOTE_URL: 'https://app.slingshot.finance/swap/Canto/NOTE_ADDRESS',
    TOKEN_URL: 'https://app.slingshot.finance/swap/Canto/0xB086A1C764A8da36c266D3b340F1eb4D6843144C'
  }
}

const NOT_SET = config['7700'];

function getByChainId(chainId) {
  const ret = config[chainId];
  if (!ret) throw new Error('invalid config');
  return ret;
}

module.exports = {
  NOT_SET,
  LIST_CHAIN_ID,
  getByChainId
}