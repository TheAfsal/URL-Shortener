import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  healthCheck(): string {
    return 'Server is up and running';
  }
}
