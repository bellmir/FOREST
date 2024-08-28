import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme', // 평문 비밀번호
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess', // 평문 비밀번호
    },
  ];
  // DB 전 임의로 사용.

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
