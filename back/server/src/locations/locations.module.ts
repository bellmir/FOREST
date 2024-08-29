import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationController } from './locations.controller';
import { Location, LocationSchema, User, UserSchema } from '../schema/schema';
import { LocationService } from './locations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
