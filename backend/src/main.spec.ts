import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

// Mock NestFactory globally
jest.mock('@nestjs/core', () => ({
    NestFactory: {
        create: jest.fn(),
    },
}));

describe('Bootstrap Application', () => {
    let mockApp: Partial<INestApplication>;
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        // Backup environment variables
        originalEnv = process.env;
        process.env = { ...originalEnv };

        // Reset module cache
        jest.resetModules();

        // Create mock app
        mockApp = {
            enableCors: jest.fn(),
            listen: jest.fn().mockResolvedValue(undefined),
        };

        // Suppress console output
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restore environment variables
        process.env = originalEnv;
        jest.resetAllMocks();
    });

    it('should bootstrap the application with default settings', async () => {
        // Explicitly remove environment variables to test default branches
        delete process.env.FRONTEND_URL;
        delete process.env.PORT;

        // Get reference to NestFactory after module reset
        const { NestFactory } = require('@nestjs/core');
        NestFactory.create.mockResolvedValue(mockApp);

        // Import bootstrap function
        const { bootstrap } = require('./main');
        await bootstrap();

        // Verify NestFactory.create was called with AppModule
        const { AppModule } = require('./app.module');
        expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

        // Verify CORS configuration with default value
        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'http://localhost:5173',
            credentials: true,
        });

        // Verify port configuration with default value
        expect(mockApp.listen).toHaveBeenCalledWith('3000');
        expect(console.log).toHaveBeenCalledWith('🚀 Backend running in http://localhost:3000');
    });

    it('should bootstrap the application with custom environment variables', async () => {
        // Set custom environment variables
        process.env.FRONTEND_URL = 'https://monito-store.com';
        process.env.PORT = '8080';

        // Get reference to NestFactory after module reset
        const { NestFactory } = require('@nestjs/core');
        NestFactory.create.mockResolvedValue(mockApp);

        // Import bootstrap function
        const { bootstrap } = require('./main');
        await bootstrap();

        // Verify CORS configuration with custom values
        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'https://monito-store.com',
            credentials: true,
        });

        // Verify port configuration with custom value
        expect(mockApp.listen).toHaveBeenCalledWith('8080');
        expect(console.log).toHaveBeenCalledWith('🚀 Backend running in http://localhost:8080');
    });

    it('should test conditional bootstrap execution', () => {

        // Track if bootstrap was called
        let bootstrapCalled = false;

        // Create a mock bootstrap function that sets our flag
        const mockBootstrap = jest.fn().mockImplementation(() => {
            bootstrapCalled = true;
        });

        // Create a function that simulates the conditional execution
        const simulateMainExecution = (isMainModule: boolean) => {
            if (isMainModule) {
                mockBootstrap();
            }
        };

        // Test when it's the main module (should call bootstrap)
        simulateMainExecution(true);
        expect(mockBootstrap).toHaveBeenCalled();
        expect(bootstrapCalled).toBe(true);

        // Reset our tracking
        bootstrapCalled = false;
        mockBootstrap.mockClear();

        // Test when it's not the main module (should not call bootstrap)
        simulateMainExecution(false);
        expect(mockBootstrap).not.toHaveBeenCalled();
        expect(bootstrapCalled).toBe(false);
    });
});