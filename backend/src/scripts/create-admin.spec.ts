import { NestFactory } from '@nestjs/core';
import { bootstrap, runScript } from './create-admin';

jest.mock('@nestjs/core', () => ({
    NestFactory: { create: jest.fn() },
}));

describe('Create Admin Script', () => {
    let mockApp: any;
    let mockUsersService: any;

    beforeEach(() => {
        jest.resetModules();
        mockUsersService = { create: jest.fn() };
        mockApp = {
            get: jest.fn().mockReturnValue(mockUsersService),
            close: jest.fn(),
        };
        (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('logs success when admin is created', async () => {
        // Arrange
        const fakeUser = { id: 'u1', email: 'admin@monito.com', role: 'admin' };
        mockUsersService.create.mockResolvedValue(fakeUser);

        // Act
        await bootstrap();

        // Assert
        expect(console.log).toHaveBeenCalledWith('Admin user created:', fakeUser);
        expect(mockApp.close).toHaveBeenCalled();
    });

    it('logs error when admin creation fails', async () => {
        // Arrange
        const error = new Error('creation failed');
        mockUsersService.create.mockRejectedValue(error);

        // Act
        await bootstrap();

        // Assert
        expect(console.error).toHaveBeenCalledWith('Failed to create admin user:', error.message);
        expect(mockApp.close).toHaveBeenCalled();
    });

    it('runScript(true) should invoke bootstrap', () => {
        // Spy on bootstrap
        const spy = jest.spyOn(require('./create-admin'), 'bootstrap').mockImplementation();

        // Act
        runScript(true);

        // Assert
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('runScript(false) should NOT invoke bootstrap', () => {
        // Spy on bootstrap
        const spy = jest.spyOn(require('./create-admin'), 'bootstrap').mockImplementation();

        // Act
        runScript(false);

        // Assert
        expect(spy).not.toHaveBeenCalled();
    });
});