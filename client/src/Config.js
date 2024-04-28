const LIST_CHAIN_ID = ['7701'];

const config = {
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
    GITHUB_URL: 'https://github.com/RaijinDotTech/canto-hackathon-hot',
    CONTRACT_URL: 'https://testnet.tuber.build/address/0x8De16f9E86de402F3dBC910dAe30A70940806014/contracts#address-tabs',
    LP_URL: 'https://pools.canto.io/pools?pair=0x652b71f544c863d0e83a015aec3a2f0236e93887',
    NOTE_URL: 'https://app.slingshot.finance/swap/Canto/0x4e71a2e537b7f9d9413d3991d37958c0b5e1e503',
    TOKEN_URL: 'https://app.slingshot.finance/swap/Canto/0xB086A1C764A8da36c266D3b340F1eb4D6843144C'
  }
}

const NOT_SET = config['7701'];

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