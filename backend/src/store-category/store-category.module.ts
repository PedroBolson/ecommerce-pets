import { Module } from '@nestjs/common';
import { StoreCategoryService } from './store-category.service';
import { StoreCategoryController } from './store-category.controller';

@Module({
  controllers: [StoreCategoryController],
  providers: [StoreCategoryService],
})
export class StoreCategoryModule {}
