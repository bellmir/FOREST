import { Injectable, OnModuleInit } from '@nestjs/common';
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
}
