import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicWriteProtectedGuard } from './auth/guards/public-write-protected.guard';

import { BreedModule } from './breed/breed.module';
import { BreedImageModule } from './breed-image/breed-image.module';
import { DogModule } from './dog/dog.module';
import { AdoptionPhotoModule } from './adoption-photo/adoption-photo.module';
import { StoreCategoryModule } from './store-category/store-category.module';
import { StoreItemModule } from './store-item/store-item.module';
import { StoreItemImageModule } from './store-item-image/store-item-image.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

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

    // Add JwtModule globally to guard
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your_jwt_secret',
        signOptions: { expiresIn: '1h' },
      }),
      global: true,
    }),


    BreedModule,
    BreedImageModule,
    DogModule,
    AdoptionPhotoModule,
    StoreCategoryModule,
    StoreItemModule,
    StoreItemImageModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Register guard globally
    {
      provide: APP_GUARD,
      useClass: PublicWriteProtectedGuard,
    },
  ],
})
export class AppModule { }