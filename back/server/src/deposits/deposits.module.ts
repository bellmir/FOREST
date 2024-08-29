import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposit, DepositSchema } from '../schema/schema';
import { DepositsService } from './deposits.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Deposit.name,
        schema: DepositSchema,
      },
    ]),
  ],
  providers: [DepositsService],
  exports: [DepositsService],
})
export class DepositsModule {}
