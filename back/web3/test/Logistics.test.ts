import { expect } from 'chai';
import { time, loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import hre from 'hardhat';
import { erc20Abi, getAddress, parseGwei } from 'viem';
import { Contract } from 'ethers';

describe('Logistics Contract', function () {
    // Define a fixture to reuse the same setup for every test
    async function deployLogisticsFixture() {
        const [proxyAccount] = await hre.viem.getWalletClients();

        const logistics = await hre.viem.deployContract('Logistics', []);

        const publicClient = await hre.viem.getPublicClient();

        return { logistics, proxyAccount, publicClient };
    }

    describe('Deployment', function () {
        it('should create a location with specified details', async function () {
            const { logistics } = await loadFixture(deployLogisticsFixture);

            const tx = await logistics.write.createLocation(['Warehouse', 'Location A', '100', '200', ['uuid-1234']]);

            const publicClient = await hre.viem.getPublicClient();
            const logs = await publicClient.getContractEvents({
                abi: logistics.abi,
                address: logistics.address,
                eventName: 'LocationCreated',
            });

            // console.log(logs);
            expect(logs.length).to.equal(1);

            const [locationType, name, xCor, yCor, chargedUserUUIDs] = await logistics.read.getLocation([BigInt(0)]);
            // console.log([locationType, name, xCor, yCor]);

            expect([locationType, name, xCor, yCor]).to.deep.equal(['Warehouse', 'Location A', '100', '200']); // 깊은 비교 사용
            expect(chargedUserUUIDs).to.deep.equal(['uuid-1234']); // UUID 배열도 깊은 비교
        });
    });

    describe('Deposit Management', function () {
        it('should allow a charged user to create a deposit', async function () {
            const { logistics } = await loadFixture(deployLogisticsFixture);

            await logistics.write.createLocation(['Warehouse', 'Location A', '100', '200', ['uuid-1234']]);
            await logistics.write.createLocation(['Warehouse', 'Location B', '300', '400', ['uuid-5678']]);

            // 출발 창고 A에 물품 추가
            await logistics.write.updateItemQuantity([BigInt(0), 'item1', BigInt(10)]); // item1 10개 추가
            await logistics.write.updateItemQuantity([BigInt(0), 'item2', BigInt(20)]); // item2 20개 추가

            const itemNames: string[] = ['item1', 'item2'];
            const itemQuantities: bigint[] = [BigInt(10), BigInt(20)];

            const tx = await logistics.write.createDeposit([
                BigInt(0),
                BigInt(1),
                'uuid-1234',
                itemNames,
                itemQuantities,
            ]);

            const publicClient = await hre.viem.getPublicClient();
            const logs = await publicClient.getContractEvents({
                abi: logistics.abi,
                address: logistics.address,
                eventName: 'DepositCreated',
            });

            // console.log(logs);
            expect(logs.length).to.equal(1);

            const depositData = await logistics.read.getDeposit([BigInt(0)]);
            // console.log(depositData);

            expect(depositData).to.deep.equal([
                'uuid-1234', // chargedUserUUID
                '', // confirmUserUUID (아직 승인되지 않음)
                BigInt(0), // sourceLocationId
                BigInt(1), // destLocationId
                itemNames, // itemNamesResult
                depositData[5], // timestamp (변경되지 않음)
                'Pending', // status
            ]);
        });
    });

    describe('Deposit Management', function () {
        it('should allow an authorized user to approve a deposit', async function () {
            const { logistics } = await loadFixture(deployLogisticsFixture);

            await logistics.write.createLocation(['Warehouse', 'Location A', '100', '200', ['uuid-1234']]);
            await logistics.write.createLocation(['Warehouse', 'Location B', '300', '400', ['uuid-5678']]);

            // 출발 창고 A에 물품 추가
            await logistics.write.updateItemQuantity([BigInt(0), 'item1', BigInt(10)]); // item1 10개 추가
            await logistics.write.updateItemQuantity([BigInt(0), 'item2', BigInt(20)]); // item2 20개 추가

            const itemNames: string[] = ['item1', 'item2'];
            const itemQuantities: bigint[] = [BigInt(10), BigInt(20)];

            await logistics.write.createDeposit([BigInt(0), BigInt(1), 'uuid-1234', itemNames, itemQuantities]);

            const tx = await logistics.write.approveDeposit([BigInt(0), 'uuid-5678']);

            const publicClient = await hre.viem.getPublicClient();
            const logs = await publicClient.getContractEvents({
                abi: logistics.abi,
                address: logistics.address,
                eventName: 'DepositApproved',
            });

            // 이벤트가 하나 생성되었는지 확인
            expect(logs.length).to.equal(1);

            const depositData = await logistics.read.getDeposit([BigInt(0)]);
            expect(depositData[6]).to.equal('Approved'); // 상태가 'Approved'인지 확인
        });

        it('should allow an authorized user to reject a deposit', async function () {
            const { logistics } = await loadFixture(deployLogisticsFixture);

            await logistics.write.createLocation(['Warehouse', 'Location A', '100', '200', ['uuid-1234']]);
            await logistics.write.createLocation(['Warehouse', 'Location B', '300', '400', ['uuid-5678']]);

            // 출발 창고 A에 물품 추가
            await logistics.write.updateItemQuantity([BigInt(0), 'item1', BigInt(10)]); // item1 10개 추가
            await logistics.write.updateItemQuantity([BigInt(0), 'item2', BigInt(20)]); // item2 20개 추가

            const itemNames: string[] = ['item1', 'item2'];
            const itemQuantities: bigint[] = [BigInt(10), BigInt(20)];

            await logistics.write.createDeposit([BigInt(0), BigInt(1), 'uuid-1234', itemNames, itemQuantities]);

            const tx = await logistics.write.rejectDeposit([BigInt(0), 'uuid-5678']);

            const publicClient = await hre.viem.getPublicClient();
            const logs = await publicClient.getContractEvents({
                abi: logistics.abi,
                address: logistics.address,
                eventName: 'DepositRejected',
            });

            // 이벤트가 하나 생성되었는지 확인
            expect(logs.length).to.equal(1);

            const depositData = await logistics.read.getDeposit([BigInt(0)]);
            expect(depositData[6]).to.equal('Rejected'); // 상태가 'Rejected'인지 확인
        });
    });
});
