import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox-viem';

const config: HardhatUserConfig = {
    solidity: '0.8.24',
    networks: {
        hardhat: {
            chainId: 31337,
            // chainId: 1337,
        },
    },
    paths: {
        sources: './contracts',
        tests: './test',
    },
};

export default config;
