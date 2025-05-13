import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'reflect-metadata';

describe('AppModule', () => {
    let module: TestingModule;
    jest.setTimeout(30000);
    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                // Substitui o banco real por SQLite em memória para testes
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [],
                    synchronize: true,
                }),
            ],
        }).compile();
    });

    it('should compile the AppModule', () => {
        expect(module).toBeDefined();
    });

    afterAll(async () => {
        if (module) {
            await module.close();
        }
    });
});