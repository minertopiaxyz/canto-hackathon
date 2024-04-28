require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');

const PRIVATEKEY_DEV = process.env.PRIVATEKEY_DEV;

// example: npx hardhat flatten contracts/Token.sol > flattened.sol
task("flat", "Flattens and prints contracts and their dependencies (Resolves licenses)")
  .addOptionalVariadicPositionalParam("files", "The files to flatten", undefined, types.inputFile)
  .setAction(async ({ files }, hre) => {
    let flattened = await hre.run("flatten:get-flattened-sources", { files });

    // Remove every line started with "// SPDX-License-Identifier:"
    flattened = flattened.replace(/SPDX-License-Identifier:/gm, "License-Identifier:");
    flattened = `// SPDX-License-Identifier: MIXED\n\n${flattened}`;

    // Remove every line started with "pragma experimental ABIEncoderV2;" except the first one
    flattened = flattened.replace(/pragma experimental ABIEncoderV2;\n/gm, ((i) => (m) => (!i++ ? m : ""))(0));
    console.log(flattened);
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  settings: {
  },
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: "https://canto-testnet.plexnode.wtf",
      chainId: 7701,
      accounts: [PRIVATEKEY_DEV],
    }
  },
  sourcify: {
    enabled: true,
    // Optional: specify a different Sourcify server
    apiUrl: "https://sourcify.dev/server",
    // Optional: specify a different Sourcify repository
    browserUrl: "https://repo.sourcify.dev",
  }
};

