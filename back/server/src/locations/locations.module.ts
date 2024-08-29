import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from '../schema/schema';
import { LocationService } from './locations.service';
import { Location } from '../schema/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
    ]),
  ],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
