import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreCategoryService } from './store-category.service';
import { StoreCategoryController } from './store-category.controller';
import { StoreCategory } from './entities/store-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreCategory])],
  controllers: [StoreCategoryController],
  providers: [StoreCategoryService],
})
export class StoreCategoryModule { }
