import '@nomicfoundation/hardhat-toolbox'; // Includes ethers.js v6
import '@nomicfoundation/hardhat-verify';
import { config as dotEnvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotEnvConfig();

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 31337,
    },
    alfajores: {
      accounts: [process.env.PRIVATE_KEY ?? '0x0'], // Use environment variable for private key
      url: 'https://alfajores-forno.celo-testnet.org',
    },
    celo: {
      accounts: [process.env.PRIVATE_KEY ?? '0x0'], // Use environment variable for private key
      url: 'https://forno.celo.org',
    },
  },
  etherscan: {
    apiKey: {
      alfajores: process.env.CELOSCAN_API_KEY ?? '', // Use environment variable for API key
      celo: process.env.CELOSCAN_API_KEY ?? '', // Use environment variable for API key
    },
    customChains: [
      {
        chainId: 44_787,
        network: 'alfajores',
        urls: {
          apiURL: 'https://api-alfajores.celoscan.io/api',
          browserURL: 'https://alfajores.celoscan.io',
        },
      },
      {
        chainId: 42_220,
        network: 'celo',
        urls: {
          apiURL: 'https://api.celoscan.io/api',
          browserURL: 'https://celoscan.io/',
        },
      },
    ],
  },
  sourcify: {
    enabled: false, // Disable Sourcify verification
  },
  solidity: {
    version: '0.8.24', // Specify Solidity version
    settings: {
      optimizer: {
        enabled: true, // Enable Solidity optimizer
        runs: 200, // Optimize for 200 runs
      },
    },
  },
  typechain: {
    outDir: 'typechain-types', // Output directory for TypeChain types
    target: 'ethers-v6', // Use ethers.js v6 as the target
  },
};

export default config;