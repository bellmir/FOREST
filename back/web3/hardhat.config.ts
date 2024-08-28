import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';

const config: HardhatUserConfig = {
    solidity: '0.8.24',
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
            chainId: 31337,
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
        artifacts: './artifacts',
    },
};

export default config;
