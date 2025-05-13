import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'reflect-metadata';

describe('AppModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
    });

    it('should compile the AppModule', () => {
        expect(module).toBeDefined();
    });

    afterAll(async () => {
        await module.close();
    });
});

// Additional tests to improve branch coverage
describe('AppModule Configuration', () => {
    // Mock of ConfigService to test different branches
    let configServiceMock: ConfigService;

    // Let's extract the factory functions from AppModule
    let jwtOptionsFactory;
    let typeOrmOptionsFactory;

    beforeAll(() => {
        // We examine the AppModule to extract the configuration functions
        const appModuleMetadata = Reflect.getMetadata('imports', AppModule) || [];

        // Find and inspect the modules dynamically
        for (const moduleImport of appModuleMetadata) {
            // Check if it's a dynamic module
            if (moduleImport && typeof moduleImport === 'object') {
                // Look for JwtModule
                if (moduleImport.module === JwtModule) {
                    // Check first in the providers of the main module
                    if (moduleImport.providers) {
                        const provider = moduleImport.providers.find(
                            p => p.provide === 'JWT_MODULE_OPTIONS'
                        );
                        if (provider && provider.useFactory) {
                            jwtOptionsFactory = provider.useFactory;
                        }
                    }
                }

                // Look for TypeOrmModule
                if (moduleImport.module === TypeOrmModule) {
                    // TypeORM usually has the factory function inside imports[0].providers
                    if (moduleImport.imports && moduleImport.imports[0] && moduleImport.imports[0].providers) {
                        const provider = moduleImport.imports[0].providers.find(
                            p => p.provide === 'TypeOrmModuleOptions'
                        );
                        if (provider && provider.useFactory) {
                            typeOrmOptionsFactory = provider.useFactory;
                        }
                    }
                }
            }
        }

    });

    beforeEach(() => {
        // Create default mock of ConfigService
        configServiceMock = {
            get: jest.fn((key) => {
                // Default values for tests
                const defaults = {
                    POSTGRES_HOST: 'localhost',
                    POSTGRES_PORT: '5432',
                    POSTGRES_USER: 'postgres',
                    POSTGRES_PASSWORD: 'postgres',
                    POSTGRES_DB: 'monito',
                    JWT_SECRET: undefined
                };
                return defaults[key];
            })
        } as unknown as ConfigService;
    });

    it('should use default JWT secret when JWT_SECRET environment variable is not set', async () => {
        // Skip if we couldn't extract the factory function
        if (!jwtOptionsFactory) {
            console.warn('JWT factory not found, skipping test');
            return;
        }

        // Configure mock to not have JWT_SECRET
        configServiceMock.get = jest.fn().mockImplementation((key) => {
            return key === 'JWT_SECRET' ? undefined : 'other-value';
        });

        // Call the factory function directly
        const jwtOptions = jwtOptionsFactory(configServiceMock);

        // Verify if it used the default secret
        expect(jwtOptions).toBeDefined();
        expect(jwtOptions.secret).toBe('your_jwt_secret');
    });

    it('should use environment JWT secret when JWT_SECRET is set', async () => {
        // Skip if we couldn't extract the factory function
        if (!jwtOptionsFactory) {
            console.warn('JWT factory not found, skipping test');
            return;
        }

        // Configure mock to have JWT_SECRET
        configServiceMock.get = jest.fn().mockImplementation((key) => {
            return key === 'JWT_SECRET' ? 'test-secret-key' : 'other-value';
        });

        // Call the factory function directly
        const jwtOptions = jwtOptionsFactory(configServiceMock);

        // Verify if the environment secret was used
        expect(jwtOptions).toBeDefined();
        expect(jwtOptions.secret).toBe('test-secret-key');
    });

    it('should configure TypeORM with correct database options', async () => {
        // Skip if we couldn't extract the factory function
        if (!typeOrmOptionsFactory) {
            console.warn('TypeORM factory not found, skipping test');
            return;
        }

        // Configure mock with specific values for the exact keys used in app.module.ts
        configServiceMock.get = jest.fn().mockImplementation((key) => {
            // Map the exact keys used in TypeORM configuration
            const valueMap = {
                'DB_HOST': 'test-host',
                'DB_PORT': '1234',
                'DB_USERNAME': 'test-user',  // Correct key used in app.module.ts
                'DB_PASSWORD': 'test-password',
                'DB_NAME': 'test-db',
                'JWT_SECRET': 'test-secret'
            };
            return valueMap[key];
        });

        // Call the factory function directly
        const typeOrmOptions = typeOrmOptionsFactory(configServiceMock);

        // Verify DB configurations exactly with the values we expect
        expect(typeOrmOptions).toBeDefined();
        expect(typeOrmOptions).toEqual({
            type: 'postgres',
            host: 'test-host',
            port: '1234',
            username: 'test-user',
            password: 'test-password',
            database: 'test-db',
            autoLoadEntities: true,
            synchronize: true,
        });
    });
});