import { Injectable } from '@nestjs/common';
import { CreateStoreItemImageDto } from './dto/create-store-item-image.dto';
import { UpdateStoreItemImageDto } from './dto/update-store-item-image.dto';

@Injectable()
export class StoreItemImageService {
  create(createStoreItemImageDto: CreateStoreItemImageDto) {
    return 'This action adds a new storeItemImage';
  }

  findAll() {
    return `This action returns all storeItemImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeItemImage`;
  }

  update(id: number, updateStoreItemImageDto: UpdateStoreItemImageDto) {
    return `This action updates a #${id} storeItemImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeItemImage`;
  }
}
