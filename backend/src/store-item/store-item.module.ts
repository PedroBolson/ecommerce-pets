import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreItemService } from './store-item.service';
import { StoreItemController } from './store-item.controller';
import { StoreItem } from './entities/store-item.entity';
import { StoreCategory } from '../store-category/entities/store-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreItem, StoreCategory])],
  controllers: [StoreItemController],
  providers: [StoreItemService],
})
export class StoreItemModule { }
