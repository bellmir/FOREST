import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { localhost } from 'viem/chains';
import * as dotenv from 'dotenv';

// 스마트 계약의 ABI와 Bytecode를 가져옵니다.
import * as LogisticsABI from '../artifacts/contracts/Logistics.sol/Logistics.json';

dotenv.config();

async function main() {
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

    // Hardhat 로컬 노드에 연결
    const client = createWalletClient({
        chain: {
            ...localhost,
            id: 31337,
        },
        transport: http('http://localhost:8545'),
        account: account,
    });

    const abi = LogisticsABI.abi;
    const bytecode = LogisticsABI.bytecode as `0x${string}`;

    // 계약 배포
    const tx = await client.deployContract({
        abi,
        bytecode,
        account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        args: [], // 필요한 경우 계약 생성자에 전달할 인수
        gasPrice: parseEther('0.00000001'), // 가스 가격 설정 (옵션)
    });

    console.log('Logistics contract deployed to:', tx);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
