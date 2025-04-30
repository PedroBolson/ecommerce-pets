import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

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