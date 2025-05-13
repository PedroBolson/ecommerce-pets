import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('System')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns the health status of the API'
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    schema: {
      properties: {
        status: { type: 'string', example: 'ok' }
      }
    }
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
