// src/auth/auth.module.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User as UserEntity } from '../users/entities/user.entity';

describe('AuthModule', () => {
    let module: TestingModule;

    const mockConfigService = { get: jest.fn() };
    const userRepoMock = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                // needed to make ConfigService available to JwtStrategy
                ConfigModule.forRoot({ isGlobal: true }),
                AuthModule,
            ],
        })
            // forces the use of mock wherever ConfigService is requested
            .overrideProvider(ConfigService)
            .useValue(mockConfigService)
            // mock of the user repository
            .overrideProvider(getRepositoryToken(UserEntity))
            .useValue(userRepoMock)
            // mock of DataSource, used internally by TypeORM
            .overrideProvider(DataSource)
            .useValue({})
            .compile();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should register all required providers', () => {
        const authService = module.get<AuthService>(AuthService);
        const jwtService = module.get<JwtService>(JwtService);
        const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);

        expect(authService).toBeInstanceOf(AuthService);
        expect(jwtService).toBeInstanceOf(JwtService);
        expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
    });

    it('should register the auth controller', () => {
        const controller = module.get<AuthController>(AuthController);
        expect(controller).toBeInstanceOf(AuthController);
    });

    describe('JwtModule Configuration', () => {
        let jwtTestModule: TestingModule;

        it('should use environment JWT_SECRET when available', async () => {
            mockConfigService.get.mockReturnValue('env-secret');

            jwtTestModule = await Test.createTestingModule({
                imports: [
                    JwtModule.registerAsync({
                        imports: [ConfigModule],
                        inject: [ConfigService],
                        useFactory: (cfg: ConfigService) => ({
                            secret: cfg.get<string>('JWT_SECRET') || 'default-secret',
                            signOptions: { expiresIn: '24h' },
                        }),
                    }),
                ],
                providers: [{ provide: ConfigService, useValue: mockConfigService }],
            }).compile();

            expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
            const jwt = jwtTestModule.get<JwtService>(JwtService);
            const token = jwt.sign({ foo: 'bar' });
            expect(typeof token).toBe('string');
        });

        it('should use default secret when JWT_SECRET is not available', async () => {
            mockConfigService.get.mockReturnValue(undefined);

            jwtTestModule = await Test.createTestingModule({
                imports: [
                    JwtModule.registerAsync({
                        imports: [ConfigModule],
                        inject: [ConfigService],
                        useFactory: (cfg: ConfigService) => ({
                            secret: cfg.get<string>('JWT_SECRET') || 'default-secret',
                            signOptions: { expiresIn: '24h' },
                        }),
                    }),
                ],
                providers: [{ provide: ConfigService, useValue: mockConfigService }],
            }).compile();

            expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
            const jwt = jwtTestModule.get<JwtService>(JwtService);
            const token = jwt.sign({ foo: 'bar' });
            expect(typeof token).toBe('string');
        });
    });

    describe('Module Structure', () => {
        it('should export AuthService', () => {
            const authService = module.get<AuthService>(AuthService);
            expect(authService).toBeInstanceOf(AuthService);
        });

        it('should make JwtService available', () => {
            const jwtService = module.get<JwtService>(JwtService);
            expect(jwtService).toBeInstanceOf(JwtService);
        });
    });
});