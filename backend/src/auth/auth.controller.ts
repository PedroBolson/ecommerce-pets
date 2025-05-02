import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login', description: 'Authenticates a user and returns an access token' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Returns the JWT access token',
        schema: {
            properties: {
                access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
