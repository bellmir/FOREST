import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose, Schema } from 'mongoose';
import {
  Location,
  LocationDocument,
  User,
  UserDocument,
} from 'src/schema/schema';

@Injectable()
export class LocationService implements OnModuleInit {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    await this.mockingLocations();
  }

  async mockingLocations() {
    const isExist = await this.locationModel.find().exec();
    if (isExist.length) {
      return;
    }

    const locations = [];
    const users = await this.userModel.find().exec(); // Fetch all users from UserModel
    const userIds = users.map((user) => user._id.toString());

    for (let i = 0; i < 20; i++) {
      const type = faker.helpers.arrayElement(['Warehouse', 'Hub', 'Store']); // Randomly select type
      const name = faker.commerce.productName(); // Generate a random product name for location name

      // Generate random coordinates within the range of South Korea's latitudes and longitudes
      const x_cor = faker.location.latitude({ min: 33, max: 38 }).toString();
      const y_cor = faker.location.longitude({ min: 124, max: 131 }).toString();

      // Select 1 to 3 random user IDs from the user IDs array
      const randomUserIds = faker.helpers.arrayElements(userIds, 1)[0];

      const location: Partial<Location> = {
        type,
        name,
        x_cor,
        y_cor,
        item_list: {}, // Initialize as an empty map
        charged_users: randomUserIds as unknown as Schema.Types.ObjectId, // Assign random user IDs
      };

      try {
        const createdLocation = await this.locationModel.create(location); // Create location
        locations.push(createdLocation);
      } catch (error) {
        console.error(`Error creating location ${name}: ${error.message}`);
      }
    }

    console.log('20개의 위치 데이터가 생성되었습니다.');
    return locations;
  }
}
