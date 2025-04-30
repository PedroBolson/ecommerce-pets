import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { StoreItemImageService } from './store-item-image.service';
import { CreateStoreItemImageDto } from './dto/create-store-item-image.dto';
import { UpdateStoreItemImageDto } from './dto/update-store-item-image.dto';

@Controller('store-item-image')
export class StoreItemImageController {
  constructor(private readonly storeItemImageService: StoreItemImageService) { }

  @Post()
  create(@Body() createStoreItemImageDto: CreateStoreItemImageDto) {
    return this.storeItemImageService.create(createStoreItemImageDto);
  }

  @Get()
  findAll() {
    return this.storeItemImageService.findAll();
  }

  @Get('by-item/:itemId')
  findByItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.storeItemImageService.findByItem(itemId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemImageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreItemImageDto: UpdateStoreItemImageDto) {
    return this.storeItemImageService.update(id, updateStoreItemImageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemImageService.remove(id);
  }
}
