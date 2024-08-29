import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Abi,
  Address,
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
} from 'viem';
import { localhost, sepolia } from 'viem/chains';
import * as fs from 'fs';
import { privateKeyToAccount } from 'viem/accounts';

const rawAbi = fs.readFileSync('src/contracts/Logistics.json', 'utf8');
const LogisticsABI = JSON.parse(rawAbi);

@Injectable()
export class Web3Service {
  private publicClient: any;
  private walletClient: any;
  private contractAddress: Address;
  private contractAbi: Abi;

  constructor(private configService: ConfigService) {
    const isLocal =
      this.configService.get<string>('NODE_ENV') === 'development';
    console.log('[Web3Service] isLocal:', isLocal);

    const transportUrl = isLocal
      ? 'http://localhost:8545'
      : `https://sepolia.infura.io/v3/${this.configService.get<string>('INFURA_PROJECT_ID')}`;

    const hardhatLocalhost = {
      ...localhost,
      id: 31337,
    };

    this.publicClient = createPublicClient({
      chain: isLocal ? hardhatLocalhost : sepolia,
      transport: http(transportUrl),
    });
    const privateKey = this.configService.get<string>(
      'PRIVATE_KEY',
    ) as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    this.walletClient = createWalletClient({
      chain: isLocal ? hardhatLocalhost : sepolia,
      transport: http(transportUrl),
      account: account,
    });

    this.contractAddress = this.configService.get<string>(
      'CONTRACT_ADDRESS',
    ) as Address;
    this.contractAbi = LogisticsABI.abi as Abi;
  }

  async getContractDataTest() {
    const locationData = await this.publicClient.readContract({
      address: this.contractAddress,
      abi: this.contractAbi,
      functionName: 'getLocation',
      args: [BigInt(0)],
    });

    console.log(locationData);

    return locationData;
  }

  async callSmartContractFunction() {
    // 예: createLocation 함수를 호출하여 새 위치 생성하기
    const createLocationTx = await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: this.contractAbi,
      functionName: 'createLocation',
      args: ['Warehouse', 'Location A', '100', '200', ['uuid-1234']],
      // 필요에 따라 signer 및 기타 설정 추가
    });

    return createLocationTx;
  }
}
