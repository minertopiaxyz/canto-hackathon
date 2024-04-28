import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import Config from './Config';
import App from './App';

// 1. Get projectId
const projectId = 'de1337b51d9e5820befc1a6f6c282cdf';

const c1 = Config.getByChainId('7700');
// const c2 = Config.getByChainId('7701');
const cs = [c1];
const chains = [];
for (let i = 0; i < cs.length; i++) {
  const c = cs[i];
  chains.push(
    {
      chainId: Number(c.CHAIN_ID),
      name: c.CHAIN_NAME,
      currency: c.GAS,
      explorerUrl: c.EXPLORER_URL,
      rpcUrl: c.RPC
    }
  );
}

// 2. Set chains
// const mainnet = {
//   chainId: Number(CHAIN_ID),
//   name: CHAIN_NAME,
//   currency: GAS,
//   explorerUrl: EXPLORER_URL,
//   rpcUrl: RPC
// }

// 3. Create a metadata object
const metadata = {
  name: 'Hackathon Project',
  description: 'Hackathon Project',
  url: 'https://xtz-elastic-dollar.vercel.app', // origin must match your domain & subdomain
  icons: ['https://assets.coingecko.com/coins/images/26959/standard/canto-network.png']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: chains,
  projectId,
  themeVariables: {
    '--w3m-accent': '#FF9D00'
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
  ],
  chainImages: {
    7700: 'https://assets.coingecko.com/coins/images/26959/standard/canto-network.png',
    7701: 'https://assets.coingecko.com/coins/images/26959/standard/canto-network.png'
  }
})

export default function WMApp() {
  return (
    <App />
  )
}