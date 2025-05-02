import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

// filepath: /Volumes/KINGSTON/Projects/ecommerce-pets/backend/src/auth/jwt.strategy.spec.ts

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;
    let configService: ConfigService;

    // Mock setup
    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        // Reset mocks between tests
        jest.clearAllMocks();

        // Default mock implementation
        mockConfigService.get.mockReturnValue('test-secret');

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('constructor', () => {
        it('should use JWT_SECRET from configService when available', () => {
            // Since we instantiate through the testing module, verify the constructor called configService.get
            expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
        });

        it('should use default secret when JWT_SECRET is not available', () => {
            // Reset mocks
            jest.clearAllMocks();
            mockConfigService.get.mockReturnValue(undefined);

            // Create a new instance to test constructor with undefined config
            new JwtStrategy(mockConfigService as unknown as ConfigService);

            // Verify the config was requested
            expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
        });
    });

    describe('validate', () => {
        it('should return user object with userId, email, and role from payload', async () => {
            // Arrange
            const payload = { sub: '123', email: 'test@example.com', role: 'user' };

            // Act
            const result = await strategy.validate(payload);

            // Assert
            expect(result).toEqual({
                userId: '123',
                email: 'test@example.com',
                role: 'user',
            });
        });

        it('should handle payloads with missing fields', async () => {
            // Arrange
            const payload = { sub: '123' }; // Missing email and role

            // Act
            const result = await strategy.validate(payload);

            // Assert
            expect(result).toEqual({
                userId: '123',
                email: undefined,
                role: undefined,
            });
        });

        it('should handle empty payload gracefully', async () => {
            // Arrange
            const payload = {};

            // Act
            const result = await strategy.validate(payload);

            // Assert
            expect(result).toEqual({
                userId: undefined,
                email: undefined,
                role: undefined,
            });
        });
    });
});