import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDocument } from 'src/schema/schema';

@Injectable()
export class LocationService implements OnModuleInit {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async onModuleInit() {
    await this.mockingLocations();
  }

  async mockingLocations() {}
}
