import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Web3Service } from './web3.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('web3')
@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get('test/get')
  @ApiOperation({ summary: 'Get contract data' })
  async getContract(@Request() req) {
    return await this.web3Service.getContractDataTest();
  }

  @Get('test/call')
  @ApiOperation({ summary: 'Call contract' })
  async callContract(@Request() req) {
    return await this.web3Service.callSmartContractFunction();
  }
}
