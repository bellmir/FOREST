import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { Deposit } from '../schema/schema';
import {
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('deposits')
@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Get('list')
  async listdeposits(): Promise<Deposit[]> {
    try {
      return await this.depositsService.listDeposits();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create deposits' })
  @ApiResponse({ status: 201, description: 'deposits successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: Deposit, description: 'deposits details' })
  async createdeposits(@Body() body: Partial<Deposit>): Promise<Deposit> {
    return this.depositsService.createDeposits(body);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete deposits' })
  @ApiResponse({ status: 200, description: 'deposits successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'id', type: String, description: 'deposits ID' })
  async deletedeposits(@Param('id') id: string): Promise<Deposit> {
    return this.depositsService.deleteDeposits(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get depositss by user ID' })
  @ApiResponse({ status: 200, description: 'deposits successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'location ID',
    example: '66d046a2d034db15cf415dbc',
  })
  async getDeposits(@Param('id') id: string): Promise<Deposit[]> {
    return this.depositsService.getDepositssByLocationId(id);
  }
}
