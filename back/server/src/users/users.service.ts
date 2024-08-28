import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(user: Partial<User>): Promise<User> {
    const isExist = await this.findOneByEmail(user.email);
    if (isExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}
