import { Module } from '@nestjs/common';
import { StoreItemImageService } from './store-item-image.service';
import { StoreItemImageController } from './store-item-image.controller';

@Module({
  controllers: [StoreItemImageController],
  providers: [StoreItemImageService],
})
export class StoreItemImageModule {}
