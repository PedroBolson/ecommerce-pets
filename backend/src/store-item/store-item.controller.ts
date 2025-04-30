import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, ParseBoolPipe, ParseFloatPipe } from '@nestjs/common';
import { StoreItemService } from './store-item.service';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';

@Controller('store-item')
export class StoreItemController {
  constructor(private readonly storeItemService: StoreItemService) { }

  @Post()
  create(@Body() createStoreItemDto: CreateStoreItemDto) {
    return this.storeItemService.create(createStoreItemDto);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('minPrice', ParseFloatPipe) minPrice?: number,
    @Query('maxPrice', ParseFloatPipe) maxPrice?: number,
    @Query('inStock', ParseBoolPipe) inStock?: boolean,
  ) {
    return this.storeItemService.findAll({
      categoryId,
      minPrice,
      maxPrice,
      inStock
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreItemDto: UpdateStoreItemDto) {
    return this.storeItemService.update(id, updateStoreItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemService.remove(id);
  }
}
