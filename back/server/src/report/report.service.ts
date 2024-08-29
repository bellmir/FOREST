import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report, ReportDocument } from '../schema/schema';
import { Model } from 'mongoose';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async listReport(): Promise<Report[]> {
    try {
      return await this.reportModel.find().exec();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createReport(Report: Partial<Report>): Promise<Report> {
    const newUser = new this.reportModel(Report);
    return newUser.save();
  }

  async deleteReport(id: string): Promise<Report> {
    return this.reportModel.findByIdAndDelete(id);
  }

  async getReport(id: string): Promise<Report> {
    return this.reportModel.findById(id);
  }

  async resetCollection(): Promise<void> {
    await this.reportModel.deleteMany({});
  }
}
