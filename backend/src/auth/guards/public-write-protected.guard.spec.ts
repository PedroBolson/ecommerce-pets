import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PublicWriteProtectedGuard } from './public-write-protected.guard';

describe('PublicWriteProtectedGuard', () => {
    let guard: PublicWriteProtectedGuard;
    let jwtService: JwtService;
    let configService: ConfigService;

    const mockJwtService = {
        verify: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockReturnValue('test-secret'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PublicWriteProtectedGuard,
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        guard = module.get<PublicWriteProtectedGuard>(PublicWriteProtectedGuard);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should allow GET requests without authentication', () => {
            const context = createMockExecutionContext('GET', '/breeds');
            expect(guard.canActivate(context)).toBe(true);
        });

        it('should allow POST requests to /auth/login without authentication', () => {
            const context = createMockExecutionContext('POST', '/auth/login');
            expect(guard.canActivate(context)).toBe(true);
        });

        it('should reject POST requests without a valid token', () => {
            const context = createMockExecutionContext('POST', '/breeds');
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should allow POST requests with a valid token', () => {
            const mockToken = 'valid.jwt.token';
            const mockPayload = { sub: 'user-id', email: 'test@example.com', role: 'admin' };

            mockJwtService.verify.mockReturnValueOnce(mockPayload);

            const context = createMockExecutionContext('POST', '/breeds', mockToken);
            expect(guard.canActivate(context)).toBe(true);

            // Verify user was attached to request
            expect(context.switchToHttp().getRequest().user).toEqual(mockPayload);
        });

        it('should reject requests with an invalid token', () => {
            const mockToken = 'invalid.jwt.token';

            mockJwtService.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });

            const context = createMockExecutionContext('POST', '/breeds', mockToken);
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should reject requests when JWT_SECRET is not defined', () => {
            mockConfigService.get.mockReturnValueOnce(null);

            const context = createMockExecutionContext('POST', '/breeds', 'token');
            expect(guard.canActivate(context)).toBe(false);
        });
    });

    // Helper function to create mock execution context
    function createMockExecutionContext(method: string, path: string, token?: string) {
        const mockRequest = {
            method,
            path,
            headers: {} as { authorization?: string },
            user: null,
        };

        if (token) {
            mockRequest.headers.authorization = `Bearer ${token}`;
        }

        const mockResponse = {};

        return {
            switchToHttp: () => ({
                getRequest: () => mockRequest,
                getResponse: () => mockResponse,
            }),
        } as ExecutionContext;
    }
});