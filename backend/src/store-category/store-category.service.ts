import { Injectable } from '@nestjs/common';
import { CreateStoreCategoryDto } from './dto/create-store-category.dto';
import { UpdateStoreCategoryDto } from './dto/update-store-category.dto';

@Injectable()
export class StoreCategoryService {
  create(createStoreCategoryDto: CreateStoreCategoryDto) {
    return 'This action adds a new storeCategory';
  }

  findAll() {
    return `This action returns all storeCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeCategory`;
  }

  update(id: number, updateStoreCategoryDto: UpdateStoreCategoryDto) {
    return `This action updates a #${id} storeCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeCategory`;
  }
}
