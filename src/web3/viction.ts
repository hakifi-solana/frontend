import { defineChain } from "viem";

export const victionTestnet = /*#__PURE__*/ defineChain({
    id: 89,
    name: 'Viction Testnet Chain',
    network: 'viction-testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'VIC',
      symbol: 'VIC',
    },
    rpcUrls: {
      default: { http: ['https://rpc-testnet.viction.xyz'] },
      public: { http: ['https://rpc-testnet.viction.xyz'] },
    },
    blockExplorers: {
      etherscan: { name: 'VictionScan', url: 'https://scan-ui-testnet.viction.xyz/' },
      default: { name: 'VictionScan', url: 'https://scan-ui-testnet.viction.xyz/' },
    },
    testnet: true,
})
  