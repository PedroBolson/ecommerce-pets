import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreItemImageService } from './store-item-image.service';
import { StoreItemImageController } from './store-item-image.controller';
import { StoreItemImage } from './entities/store-item-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreItemImage])],
  controllers: [StoreItemImageController],
  providers: [StoreItemImageService],
})
export class StoreItemImageModule { }
