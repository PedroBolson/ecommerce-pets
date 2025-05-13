import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

describe('main.ts bootstrap', () => {
    let createSpy: jest.SpyInstance;
    let mockApp: any;
    let originalNodeEnv: string | undefined;

    beforeEach(() => {
        // Save original NODE_ENV
        originalNodeEnv = process.env.NODE_ENV;

        // Set up mock app
        mockApp = {
            enableCors: jest.fn(),
            listen: jest.fn().mockResolvedValue(undefined),
            getHttpAdapter: jest.fn(),
        };

        createSpy = jest.spyOn(NestFactory, 'create').mockResolvedValue(mockApp);

        // Clear ENV between tests
        delete process.env.FRONTEND_URL;
        delete process.env.PORT;

        // Mock console.log to avoid cluttering test output
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restore original NODE_ENV and mocks
        process.env.NODE_ENV = originalNodeEnv;
        jest.restoreAllMocks();
        jest.resetModules();
    });

    it('uses default values for FRONTEND_URL and PORT in test environment', async () => {
        process.env.NODE_ENV = 'test';

        await bootstrap();

        expect(createSpy).toHaveBeenCalledWith(AppModule);
        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'http://localhost:5173',
            credentials: true,
        });
        expect(mockApp.listen).toHaveBeenCalledWith(3000);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/🚀 Backend running in http:\/\/localhost:3000/)
        );
    });

    it('respects FRONTEND_URL and PORT defined in ENV in test environment', async () => {
        process.env.NODE_ENV = 'test';
        process.env.FRONTEND_URL = 'https://meu-front.com';
        process.env.PORT = '4242';

        await bootstrap();

        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'https://meu-front.com',
            credentials: true,
        });
        expect(mockApp.listen).toHaveBeenCalledWith(4242);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/🚀 Backend running in http:\/\/localhost:4242/)
        );
    });

    it('configures Swagger and default CORS in development environment', async () => {
        process.env.NODE_ENV = 'development';

        // Mock Swagger methods
        const mockConfig = {
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            setVersion: jest.fn().mockReturnThis(),
            addBearerAuth: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue('mockConfig'),
        };

        jest.spyOn(DocumentBuilder.prototype, 'setTitle').mockImplementation(mockConfig.setTitle);
        jest.spyOn(DocumentBuilder.prototype, 'setDescription').mockImplementation(mockConfig.setDescription);
        jest.spyOn(DocumentBuilder.prototype, 'setVersion').mockImplementation(mockConfig.setVersion);
        jest.spyOn(DocumentBuilder.prototype, 'addBearerAuth').mockImplementation(mockConfig.addBearerAuth);
        jest.spyOn(DocumentBuilder.prototype, 'build').mockImplementation(mockConfig.build);

        const createDocumentSpy = jest.spyOn(SwaggerModule, 'createDocument').mockReturnValue({} as any);
        const setupSpy = jest.spyOn(SwaggerModule, 'setup').mockImplementation(() => { });

        await bootstrap();

        // CORS default
        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'http://localhost:5173',
            credentials: true,
        });
        // Swagger
        expect(createDocumentSpy).toHaveBeenCalledWith(mockApp, 'mockConfig');
        expect(setupSpy).toHaveBeenCalledWith('api', mockApp, {});
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/📚 Swagger documentation available at http:\/\/localhost:3000\/api/)
        );
        // Listen
        expect(mockApp.listen).toHaveBeenCalledWith(3000);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/🚀 Backend running in http:\/\/localhost:3000/)
        );
    });

    it('respects FRONTEND_URL and PORT in development environment', async () => {
        process.env.NODE_ENV = 'development';
        process.env.FRONTEND_URL = 'https://custom.com';
        process.env.PORT = '1337';

        // Spy Swagger to avoid duplicate setup
        jest.spyOn(SwaggerModule, 'createDocument').mockReturnValue({} as any);
        jest.spyOn(SwaggerModule, 'setup').mockImplementation(() => { });

        await bootstrap();

        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'https://custom.com',
            credentials: true,
        });
        expect(mockApp.listen).toHaveBeenCalledWith(1337);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/📚 Swagger documentation available at http:\/\/localhost:1337\/api/)
        );
        expect(console.log).toHaveBeenCalledWith(
            expect.stringMatching(/🚀 Backend running in http:\/\/localhost:1337/)
        );
    });
});
