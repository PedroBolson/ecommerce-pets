import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreItemImageService } from './store-item-image.service';
import { StoreItemImageController } from './store-item-image.controller';
import { StoreItemImage } from './entities/store-item-image.entity';
import { StoreItem } from '../store-item/entities/store-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreItemImage, StoreItem])],
  controllers: [StoreItemImageController],
  providers: [StoreItemImageService],
})
export class StoreItemImageModule { }
