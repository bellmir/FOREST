import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import { LocationService } from './locations.service';
import { Location } from '../schema/schema';
import { ApiBody, ApiParam, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('list')
  async listLocation(): Promise<Location[]> {
    try {
      return await this.locationService.listLocation();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create location' })
  @ApiResponse({ status: 201, description: 'location successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: Location, description: 'location details' })
  async createLocation(@Body() body: Partial<Location>): Promise<Location> {
    return this.locationService.createLocation(body);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Delete location' })
  @ApiResponse({ status: 200, description: 'location successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'id', type: String, description: 'location ID' })
  async deleteLocation(@Param('id') id: string): Promise<Location> {
    return this.locationService.deleteLocation(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get locations by user ID' })
  @ApiResponse({ status: 200, description: 'location successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiParam({ name: 'id', type: String, description: 'user ID', example: '66d0491df81db6bd337be4a2' })
  async getLocation(@Param('id') id: string): Promise<Location[]> {
    return this.locationService.getLocationsByUserId(id);
  }
}
