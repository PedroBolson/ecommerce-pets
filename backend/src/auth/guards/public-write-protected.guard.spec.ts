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

        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should allow GET requests to public endpoints', () => {
            const context = createMockExecutionContext('GET', '/dogs');
            expect(guard.canActivate(context)).toBe(true);
        });

        it('should require authentication for GET requests to /contacts', () => {
            // Without token - should fail
            const context = createMockExecutionContext('GET', '/contacts');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('GET', '/contacts', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should require authentication for GET requests to specific contact records', () => {
            // Without token - should fail
            const context = createMockExecutionContext('GET', '/contacts/123');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('GET', '/contacts/123', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should allow POST requests to /contacts without authentication (public form submission)', () => {
            const context = createMockExecutionContext('POST', '/contacts');
            expect(guard.canActivate(context)).toBe(true);
            expect(mockJwtService.verify).not.toHaveBeenCalled();
        });

        it('should require authentication for PATCH requests to /contacts/:id', () => {
            // Without token - should fail
            const context = createMockExecutionContext('PATCH', '/contacts/123');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('PATCH', '/contacts/123', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should require authentication for DELETE requests to /contacts/:id', () => {
            // Without token - should fail
            const context = createMockExecutionContext('DELETE', '/contacts/123');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('DELETE', '/contacts/123', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should handle paths with query parameters correctly', () => {
            // Public GET with query params - should remain public
            const publicContext = createMockExecutionContext('GET', '/dogs?page=1&limit=10');
            expect(guard.canActivate(publicContext)).toBe(true);

            // Protected GET with query params - should require auth
            const protectedContext = createMockExecutionContext('GET', '/contacts?page=1&limit=10');
            expect(guard.canActivate(protectedContext)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('GET', '/contacts?page=1&limit=10', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
        });

        it('should handle invalid tokens correctly', () => {
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockImplementationOnce(() => {
                throw new Error('Invalid token');
            });

            const context = createMockExecutionContext('POST', '/breeds', 'invalid.token');
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should handle missing JWT secret', () => {
            // Simulate missing secret
            mockConfigService.get.mockReturnValueOnce(null);

            const context = createMockExecutionContext('POST', '/breeds', 'valid.token');
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should allow access to login route', () => {
            const context = createMockExecutionContext('POST', '/auth/login');
            expect(guard.canActivate(context)).toBe(true);
        });

        it('should allow access to reset password route', () => {
            const context = createMockExecutionContext('PATCH', '/users/reset-password');
            expect(guard.canActivate(context)).toBe(true);
        });

        it('should require authentication for GET requests to /users', () => {
            // Without token - should fail
            const context = createMockExecutionContext('GET', '/users');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('GET', '/users', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should require authentication for GET requests to specific user records', () => {
            // Without token - should fail
            const context = createMockExecutionContext('GET', '/users/abc-123');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('GET', '/users/abc-123', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should require authentication for POST requests to /users', () => {
            // Without token - should fail
            const context = createMockExecutionContext('POST', '/users');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('POST', '/users', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should require authentication for DELETE requests to /users/:id', () => {
            // Without token - should fail
            const context = createMockExecutionContext('DELETE', '/users/abc-123');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('DELETE', '/users/abc-123', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
        });

        it('should allow public access to PATCH /users/reset-password', () => {
            const context = createMockExecutionContext('PATCH', '/users/reset-password');
            expect(guard.canActivate(context)).toBe(true);
            expect(mockJwtService.verify).not.toHaveBeenCalled();
        });

        it('should require authentication for normal PATCH to /users/:id', () => {
            // Without token - should fail
            const context = createMockExecutionContext('PATCH', '/users/abc-123');
            expect(guard.canActivate(context)).toBe(false);

            // With valid token - should pass
            mockJwtService.verify.mockReset();
            mockJwtService.verify.mockReturnValueOnce({ email: 'test@example.com' });

            const contextWithToken = createMockExecutionContext('PATCH', '/users/abc-123', 'valid.token');
            expect(guard.canActivate(contextWithToken)).toBe(true);
            expect(mockJwtService.verify).toHaveBeenCalled();
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