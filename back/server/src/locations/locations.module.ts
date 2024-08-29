import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Location, LocationSchema, User, UserSchema } from '../schema/schema';
import { LocationService } from './locations.service';
import { Location } from '../schema/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
