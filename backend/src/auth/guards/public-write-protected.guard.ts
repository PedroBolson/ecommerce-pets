import { Injectable, ExecutionContext, CanActivate, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class PublicWriteProtectedGuard implements CanActivate {
    private readonly logger = new Logger(PublicWriteProtectedGuard.name);
    private readonly isTest = process.env.NODE_ENV === 'test';

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const path = request.path;
        const baseUrl = path.split('?')[0]; // Remove query parameters

        // If it's a GET method, allow public access EXCEPT for contacts and users endpoints
        if (request.method === 'GET') {
            // Special cases that require authentication even for GET
            if (baseUrl === '/contacts' ||
                baseUrl.startsWith('/contacts/') ||
                baseUrl === '/users' ||
                baseUrl.startsWith('/users/')) {
                return this.authenticateRequest(request);
            }
            return true;
        }

        // Allow access to login route
        if (path === '/auth/login' && request.method === 'POST') {
            return true;
        }

        // Allow access to user reset password route
        if (path === '/users/reset-password' && request.method === 'PATCH') {
            return true;
        }

        // Allow public access to POST contacts (contact form submissions)
        if (baseUrl === '/contacts' && request.method === 'POST') {
            return true;
        }

        // For all other methods (POST, PATCH, DELETE), verify authentication
        return this.authenticateRequest(request);
    }

    private authenticateRequest(request: Request): boolean {
        try {
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                this.logger.warn(`No token provided for ${request.method} ${request.path}`);
                return false;
            }

            this.logger.debug(`Verifying token for ${request.method} ${request.path}: ${token.substring(0, 20)}...`);

            const secret = this.configService.get<string>('JWT_SECRET');
            if (!secret) {
                if (!this.isTest) this.logger.error('JWT_SECRET is not defined in environment variables');
                return false;
            }

            try {
                const payload = this.jwtService.verify(token, { secret });

                // Attach user to request for later use
                request['user'] = payload;
                this.logger.debug(`Authentication successful for user: ${payload.email}`);

                return true;
            } catch (tokenError) {
                if (!this.isTest) this.logger.error(`Token validation failed: ${tokenError.message}`);
                return false;
            }
        } catch (error) {
            if (!this.isTest) this.logger.error(`Authentication error: ${error.message}`);
            return false;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return undefined;
        }

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}