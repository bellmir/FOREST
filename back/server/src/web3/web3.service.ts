import { Injectable, OnModuleInit } from '@nestjs/common';
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
import { InjectModel } from '@nestjs/mongoose';
import { Location, LocationDocument } from 'src/schema/schema';
import { Model } from 'mongoose';

const rawAbi = fs.readFileSync('src/contracts/Logistics.json', 'utf8');
const LogisticsABI = JSON.parse(rawAbi);

@Injectable()
export class Web3Service implements OnModuleInit {
  private publicClient: any;
  private walletClient: any;
  private contractAddress: Address;
  private contractAbi: Abi;

  async onModuleInit() {
    // await this.mockLocationsToSmartContract();
  }

  constructor(
    private configService: ConfigService,
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {
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
    let locationDatas = [];

    for (let i = 0; i < 50; i++) {
      try {
        const locationData = await this.publicClient.readContract({
          address: this.contractAddress,
          abi: this.contractAbi,
          functionName: 'getLocation',
          args: [BigInt(i)],
        });

        const itemList = locationData[5].map((item, index) => {
          return {
            name: item,
            amount: Number(locationData[6][index].toString()),
          };
        });

        locationDatas.push({
          index: i,
          data: {
            locationType: locationData[0],
            name: locationData[1],
            xCor: locationData[2],
            yCor: locationData[3],
            userList: locationData[4],
            itemList: itemList,
          },
        });
      } catch (e) {
        console.error(i, e);
      }
    }

    // console.log(locationData);

    return locationDatas;
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

  async mockLocationsToSmartContract() {
    // 위치 데이터에 있는 정보를 스마트 계약에 추가
    const mockLocations = await this.locationModel.find().exec();

    console.log(`Found ${mockLocations.length} locations to mock.`);

    let i = 0;
    for (const location of mockLocations) {
      // Prepare arguments for the smart contract function
      const locationType = location.type;
      const name = location.name;
      const xCor = location.x_cor;
      const yCor = location.y_cor;

      // Convert the charged_users to an array of UUIDs (assuming you have them stored as ObjectIds)
      const chargedUserUUIDs = location.charged_users.map((userId) =>
        userId.toString(),
      );

      // Extract item names and amounts from item_list
      const itemNames = location.item_list.map((item) => item.name);
      const itemAmounts = location.item_list.map((item) => item.amount);

      try {
        // Call the createLocation function in the smart contract
        const createLocationTx = await this.walletClient.writeContract({
          address: this.contractAddress,
          abi: this.contractAbi,
          functionName: 'createLocation',
          args: [
            locationType,
            name,
            xCor,
            yCor,
            chargedUserUUIDs,
            itemNames,
            itemAmounts,
          ],
        });

        // Verify the location was correctly added
        await this.verifyLocationInContract(i, location);

        console.log(
          `Location ${name} added to the smart contract with transaction: ${createLocationTx.hash}`,
        );
      } catch (error) {
        console.error(
          `Error adding location ${name} to the smart contract: ${error.message}`,
        );
      } finally {
        i++;
      }
    }
  }

  // Function to verify if the location was added correctly
  async verifyLocationInContract(
    locationId: number,
    location: LocationDocument,
  ) {
    try {
      // Call the getLocation function in the smart contract
      const locationData = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: this.contractAbi,
        functionName: 'getLocation',
        args: [BigInt(locationId)],
      });

      // Extract the returned values
      const [locationType, name, xCor, yCor, userList] = locationData;

      // Verify the data matches the original location data
      if (
        locationType === location.type &&
        name === location.name &&
        xCor === location.x_cor &&
        yCor === location.y_cor &&
        JSON.stringify(userList) ===
          JSON.stringify(
            location.charged_users.map((userId) => userId.toString()),
          )
      ) {
        console.log(
          `Location ${name} verified successfully in the smart contract.`,
        );
      } else {
        console.error(
          `Mismatch in data for location ${name}. Verification failed.`,
        );
      }
    } catch (error) {
      console.error(
        `Error verifying location ${location.name} in the smart contract: ${error.message}`,
      );
    }
  }
}
