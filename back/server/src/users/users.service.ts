import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/schema';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.mockingUser();
  }

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

  async listUser(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async mockingUser() {
    const users = [];

    for (let i = 1; i <= 100; i++) {
      const email = `test${i}@test.com`;
      const password = 'password123';
      const name = faker.person.fullName();
      const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];
      const brand = faker.helpers.arrayElement(brands); // 브랜드를 무작위로 선택
      const address = faker.finance.ethereumAddress(); // EVM 스타일 주소 생성
      const charged_locations: [] = []; // 초기에는 비어 있음

      const user: Partial<User> = {
        email,
        password,
        name,
        brand,
        address,
        charged_locations,
      };

      try {
        const existingUser = await this.userModel
          .findOne({ email: user.email })
          .exec();

        if (existingUser) {
          continue;
        }
        const createdUser = await this.userModel.create(user); // 유저 생성
        users.push(createdUser);
      } catch (error) {
        console.error(`Error creating user ${email}: ${error.message}`);
      }
    }

    console.log('100개의 사용자 데이터가 생성되었습니다.');
    return users;
  }
}
