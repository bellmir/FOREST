import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { Web3Controller } from './web3.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema } from 'src/schema/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
    ]),
  ],
  providers: [Web3Service],
  exports: [Web3Service],
  controllers: [Web3Controller],
})
export class Web3Module {}
