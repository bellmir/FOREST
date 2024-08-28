import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http, PublicClient } from 'viem';
import { localhost, sepolia } from 'viem/chains';

@Injectable()
export class Web3Service {
  private client: any;
  constructor(private configService: ConfigService) {
    const isLocal =
      this.configService.get<string>('NODE_ENV') === 'development';
    console.log('[Web3Service] isLocal:', isLocal);
    const transportUrl = isLocal
      ? 'http://localhost:8545'
      : `https://sepolia.infura.io/v3/${this.configService.get<string>('INFURA_PROJECT_ID')}`;

    this.client = createPublicClient({
      chain: isLocal ? localhost : sepolia,
      transport: http(transportUrl),
    });
  }

  async getContractData() {
    // 스마트 계약과 상호작용하는 코드
  }

  async callSmartContractFunction() {}
}
