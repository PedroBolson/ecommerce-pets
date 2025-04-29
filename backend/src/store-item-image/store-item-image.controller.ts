import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreItemImageService } from './store-item-image.service';
import { CreateStoreItemImageDto } from './dto/create-store-item-image.dto';
import { UpdateStoreItemImageDto } from './dto/update-store-item-image.dto';

@Controller('store-item-image')
export class StoreItemImageController {
  constructor(private readonly storeItemImageService: StoreItemImageService) {}

  @Post()
  create(@Body() createStoreItemImageDto: CreateStoreItemImageDto) {
    return this.storeItemImageService.create(createStoreItemImageDto);
  }

  @Get()
  findAll() {
    return this.storeItemImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeItemImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreItemImageDto: UpdateStoreItemImageDto) {
    return this.storeItemImageService.update(+id, updateStoreItemImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeItemImageService.remove(+id);
  }
}
