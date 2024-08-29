import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposit, DepositSchema } from '../schema/schema';
import { DepositsService } from './deposits.service';
import { DepositsController } from './deposits.controller';

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
  controllers: [DepositsController],
})
export class DepositsModule {}
