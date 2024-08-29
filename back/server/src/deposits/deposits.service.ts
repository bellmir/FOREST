import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deposit, DepositDocument } from 'src/schema/schema';

@Injectable()
export class DepositsService implements OnModuleInit {
  constructor(
    @InjectModel(Deposit.name) private depositModel: Model<DepositDocument>,
  ) {}

  async onModuleInit() {
    await this.mockingDeposits();
  }

  async mockingDeposits() {}

  public async listDeposits(): Promise<Deposit[]> {
    try {
      return await this.depositModel.find().exec();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createDeposits(Deposit: Partial<Deposit>): Promise<Deposit> {
    const newDeposit = new this.depositModel(Deposit);
    return newDeposit.save();
  }

  async deleteDeposits(id: string): Promise<Deposit> {
    return this.depositModel.findByIdAndDelete(id);
  }

  async getDepositssByLocationId(locationId: string): Promise<Deposit[]> {
    const Deposits = await this.depositModel
      .find({
        charged_users: locationId,
      })
      .exec();

    return Deposits;
  }
}
