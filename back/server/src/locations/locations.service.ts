import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDocument } from 'src/schema/schema';
import { Location } from 'src/schema/schema';

@Injectable()
export class LocationService implements OnModuleInit {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async onModuleInit() {
    await this.mockingLocations();
  }

  async mockingLocations() {}

  async listLocation(): Promise<Location[]> {
    try {
      return await this.locationModel.find().exec();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createLocation(Location: Partial<Location>): Promise<Location> {
    const newLocation = new this.locationModel(Location);
    return newLocation.save();
  }

  async deleteLocation(id: string): Promise<Location> {
    return this.locationModel.findByIdAndDelete(id);
  }

  async getLocationsById(id: string): Promise<Location[]> {
    return this.locationModel.find({ _id: id }).exec();
  }
}
