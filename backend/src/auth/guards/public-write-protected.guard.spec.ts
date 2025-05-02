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

        it('should reject when authorization header exists but token is not Bearer type', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        method: 'POST',
                        path: '/breeds',
                        headers: { authorization: 'Basic dXNlcjpwYXNz' },
                        user: null,
                    }),
                    getResponse: () => ({}),
                }),
            } as ExecutionContext;

            expect(guard.canActivate(context)).toBe(false);
        });

        it('should reject when authorization header is malformed', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        method: 'POST',
                        path: '/breeds',
                        headers: { authorization: 'Bearertoken123' }, // No space between Bearer and token
                        user: null,
                    }),
                    getResponse: () => ({}),
                }),
            } as ExecutionContext;

            expect(guard.canActivate(context)).toBe(false);
        });

        it('should handle general exceptions during authentication', () => {
            // Create a spy on extractTokenFromHeader that throws an error
            jest.spyOn(guard as any, 'extractTokenFromHeader').mockImplementationOnce(() => {
                throw new Error('Unexpected error');
            });

            const context = createMockExecutionContext('POST', '/breeds', 'some-token');
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should handle empty authorization header', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        method: 'POST',
                        path: '/breeds',
                        headers: { authorization: '' },
                        user: null,
                    }),
                    getResponse: () => ({}),
                }),
            } as ExecutionContext;

            expect(guard.canActivate(context)).toBe(false);
        });

        it('should handle test environment correctly', () => {
            // Save the original value
            const originalNodeEnv = process.env.NODE_ENV;

            // Force test environment
            process.env.NODE_ENV = 'test';

            // Mock to make jwtService.verify throw an error
            mockJwtService.verify.mockImplementationOnce(() => {
                throw new Error('Token error in test environment');
            });

            const context = createMockExecutionContext('POST', '/breeds', 'invalid-token');
            expect(guard.canActivate(context)).toBe(false);

            // Restore the original value
            process.env.NODE_ENV = originalNodeEnv;
        });

        // Test different HTTP methods (PUT, PATCH, DELETE)
        it('should reject PUT requests without a valid token', () => {
            const context = createMockExecutionContext('PUT', '/breeds');
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should reject PATCH requests without a valid token', () => {
            const context = createMockExecutionContext('PATCH', '/breeds/1');
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should reject DELETE requests without a valid token', () => {
            const context = createMockExecutionContext('DELETE', '/breeds/1');
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should allow PUT requests with a valid token', () => {
            const mockToken = 'valid.jwt.token';
            const mockPayload = { sub: 'user-id', email: 'test@example.com', role: 'admin' };
            mockJwtService.verify.mockReturnValueOnce(mockPayload);

            const context = createMockExecutionContext('PUT', '/breeds/1', mockToken);
            expect(guard.canActivate(context)).toBe(true);
        });

        // Test different path scenarios
        it('should allow POST requests to other auth endpoints with valid token', () => {
            const mockToken = 'valid.jwt.token';
            const mockPayload = { sub: 'user-id', email: 'test@example.com', role: 'admin' };
            mockJwtService.verify.mockReturnValueOnce(mockPayload);

            const context = createMockExecutionContext('POST', '/auth/register', mockToken);
            expect(guard.canActivate(context)).toBe(true);
        });

        // Test null/undefined headers scenarios
        it('should handle undefined authorization header', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        method: 'POST',
                        path: '/breeds',
                        headers: { /* no authorization header */ },
                        user: null,
                    }),
                    getResponse: () => ({}),
                }),
            } as ExecutionContext;

            expect(guard.canActivate(context)).toBe(false);
        });

        it('should handle null headers object', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        method: 'POST',
                        path: '/breeds',
                        headers: null,
                        user: null,
                    }),
                    getResponse: () => ({}),
                }),
            } as ExecutionContext;

            expect(guard.canActivate(context)).toBe(false);
        });

        // Test specific JWT error types
        it('should handle TokenExpiredError from JWT verification', () => {
            const mockToken = 'expired.jwt.token';

            // Create a specific JWT TokenExpiredError
            const tokenExpiredError = new Error('jwt expired');
            tokenExpiredError.name = 'TokenExpiredError';
            mockJwtService.verify.mockImplementationOnce(() => {
                throw tokenExpiredError;
            });

            const context = createMockExecutionContext('POST', '/breeds', mockToken);
            expect(guard.canActivate(context)).toBe(false);
        });

        it('should handle JsonWebTokenError from JWT verification', () => {
            const mockToken = 'malformed.jwt.token';

            // Create a specific JWT JsonWebTokenError
            const jsonWebTokenError = new Error('invalid token');
            jsonWebTokenError.name = 'JsonWebTokenError';
            mockJwtService.verify.mockImplementationOnce(() => {
                throw jsonWebTokenError;
            });

            const context = createMockExecutionContext('POST', '/breeds', mockToken);
            expect(guard.canActivate(context)).toBe(false);
        });

        // Test non-test environment logging
        it('should log errors in non-test environment', () => {
            // Create a fresh spy that we can verify directly
            const errorSpy = jest.fn();

            // Override the isTest flag and logger
            (guard as any).isTest = false;
            (guard as any).logger = {
                warn: jest.fn(),
                debug: jest.fn(),
                error: errorSpy
            };

            // Make sure mockConfigService.get returns null for this specific call
            mockConfigService.get = jest.fn().mockReturnValue(null);

            const context = createMockExecutionContext('POST', '/breeds', 'token');
            expect(guard.canActivate(context)).toBe(false);

            // Verify our spy was called
            expect(errorSpy).toHaveBeenCalledWith('JWT_SECRET is not defined in environment variables');
        });

        // Test with invalid JWT_SECRET type
        it('should handle non-string JWT_SECRET', () => {
            // Mock ConfigService to return a non-string value
            mockConfigService.get.mockReturnValueOnce(123); // Number instead of string

            const context = createMockExecutionContext('POST', '/breeds', 'token');
            expect(guard.canActivate(context)).toBe(false);
        });

        // Test for line 43 - token verification with different secrets
        it('should use the provided JWT_SECRET for verification', () => {
            const mockToken = 'special.test.token';
            const mockPayload = { sub: 'user-id', email: 'test@example.com', role: 'admin' };

            // Mock a specific JWT_SECRET
            mockConfigService.get.mockReturnValueOnce('special-secret');

            // Mock the verify method to check if it's called with the right secret
            mockJwtService.verify.mockImplementationOnce((token, options) => {
                expect(options.secret).toBe('special-secret');
                return mockPayload;
            });

            const context = createMockExecutionContext('POST', '/breeds', mockToken);
            expect(guard.canActivate(context)).toBe(true);
        });

        // Test for line 60 - empty authorization header parts
        it('should handle malformed authorization header with empty parts', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        method: 'POST',
                        path: '/breeds',
                        headers: { authorization: ' ' }, // Space only, splits to empty strings
                        user: null,
                    }),
                    getResponse: () => ({}),
                }),
            } as ExecutionContext;

            expect(guard.canActivate(context)).toBe(false);
        });

        // Test edge case for authorization header with Bearer prefix but no token
        it('should handle authorization header with Bearer prefix but no token', () => {
            const context = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        method: 'POST',
                        path: '/breeds',
                        headers: { authorization: 'Bearer' }, // Just "Bearer" with no token part
                        user: null,
                    }),
                    getResponse: () => ({}),
                }),
            } as ExecutionContext;

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