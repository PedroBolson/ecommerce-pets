import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let service: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getHealth', () => {
        it('should return status ok', () => {
            // Arrange & Act
            const result = service.getHealth();

            // Assert
            expect(result).toEqual({ status: 'ok' });
        });

        it('should have the expected shape', () => {
            // Arrange & Act
            const result = service.getHealth();

            // Assert
            expect(result).toHaveProperty('status');
            expect(typeof result.status).toBe('string');
        });

        it('should not return undefined or null', () => {
            // Arrange & Act
            const result = service.getHealth();

            // Assert
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
        });
    });
});