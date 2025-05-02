import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

describe('main.ts bootstrap', () => {
    let createSpy: jest.SpyInstance;
    let mockApp: any;

    beforeEach(() => {
        mockApp = {
            enableCors: jest.fn(),
            listen: jest.fn().mockResolvedValue(undefined),
        };
        createSpy = jest.spyOn(NestFactory, 'create').mockResolvedValue(mockApp);
        // limpa ENV entre testes
        delete process.env.FRONTEND_URL;
        delete process.env.PORT;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('usa valores padrão de FRONTEND_URL e PORT', async () => {
        await bootstrap();

        // NestFactory.create deve ser chamado com AppModule
        expect(createSpy).toHaveBeenCalledWith(AppModule);

        // enableCors com http://localhost:5173 e credentials: true
        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'http://localhost:5173',
            credentials: true,
        });

        // listen na porta 3000
        expect(mockApp.listen).toHaveBeenCalledWith(3000);
    });

    it('respeita FRONTEND_URL e PORT definidos no ENV', async () => {
        process.env.FRONTEND_URL = 'https://meu-front.com';
        process.env.PORT = '4242';

        await bootstrap();

        expect(mockApp.enableCors).toHaveBeenCalledWith({
            origin: 'https://meu-front.com',
            credentials: true,
        });
        expect(mockApp.listen).toHaveBeenCalledWith(4242);
    });
});