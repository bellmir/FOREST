import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Web3Service } from './web3/web3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용 설정
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // NODE_ENV에 따라 다른 env 파일 사용 가능
    }),
    MongooseModule.forRoot('mongodb://localhost/forest', {
      retryAttempts: 3,
      retryDelay: 1000,
    }),
    AuthModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService, Web3Service],
})
export class AppModule {}
