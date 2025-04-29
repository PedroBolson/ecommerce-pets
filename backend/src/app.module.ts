// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BreedModule } from './breed/breed.module';
import { BreedImageModule } from './breed-image/breed-image.module';
import { DogModule } from './dog/dog.module';
import { AdoptionPhotoModule } from './adoption-photo/adoption-photo.module';
import { StoreCategoryModule } from './store-category/store-category.module';
import { StoreItemModule } from './store-item/store-item.module';
import { StoreItemImageModule } from './store-item-image/store-item-image.module';

@Module({
  imports: [
    // 1) Carrega o .env (na pasta backend/) e torna ConfigService global
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // 2) Configura o TypeORM via useFactory, lendo cada variável
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,   // DEV only!
      }),
    }),

    // 3) Seus módulos de domínio
    BreedModule,
    BreedImageModule,
    DogModule,
    AdoptionPhotoModule,
    StoreCategoryModule,
    StoreItemModule,
    StoreItemImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }