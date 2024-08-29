import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from './web3/web3.module';
import { UsersModule } from './users/users.module';
import { TestModule } from './test/test.module';
import { DepositsModule } from './deposits/deposits.module';
import { LocationModule } from './locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용 설정
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // NODE_ENV에 따라 다른 env 파일 사용 가능
    }),
    MongooseModule.forRoot('mongodb://192.168.0.5:27017/forest', {
      retryAttempts: 3,
      retryDelay: 1000,
    }),
    UsersModule,
    LocationModule,
    DepositsModule,
    AuthModule,
    Web3Module,
    TestModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
