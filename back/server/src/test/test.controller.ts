import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('hello')
  getHello(@Request() req): string {
    return this.testService.getHello(req.user.username);
  }
}
