import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from '../schema/schema';
import { ApiBody, ApiParam, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('list')
  async listReport(): Promise<Report[]> {
    try {
      return await this.reportService.listReport();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create report' })
  @ApiResponse({ status: 201, description: 'Report successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: Report, description: 'Report details' })
  async createReport(@Body() body: Partial<Report>): Promise<Report> {
    return this.reportService.createReport(body);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete report' })
  @ApiResponse({ status: 200, description: 'Report successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'id', type: String, description: 'Report ID' })
  async deleteReport(@Param('id') id: string): Promise<Report> {
    return this.reportService.deleteReport(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report' })
  @ApiResponse({ status: 200, description: 'Report successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'id', type: String, description: 'Report ID' })
  async getReport(@Param('id') id: string): Promise<Report> {
    return this.reportService.getReport(id);
  }
}
