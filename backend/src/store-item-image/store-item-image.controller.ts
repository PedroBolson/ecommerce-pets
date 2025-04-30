import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { StoreItemImageService } from './store-item-image.service';
import { CreateStoreItemImageDto } from './dto/create-store-item-image.dto';
import { UpdateStoreItemImageDto } from './dto/update-store-item-image.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('store-item-images')
@Controller('store-item-image')
export class StoreItemImageController {
  constructor(private readonly storeItemImageService: StoreItemImageService) { }

  @Post()
  @ApiOperation({ summary: 'Add new store item image' })
  create(@Body() createStoreItemImageDto: CreateStoreItemImageDto) {
    return this.storeItemImageService.create(createStoreItemImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all store item images' })
  findAll() {
    return this.storeItemImageService.findAll();
  }

  @Get('by-item/:itemId')
  @ApiOperation({ summary: 'Find all images for a specific store item' })
  findByItem(@Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.storeItemImageService.findByItem(itemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store item image by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemImageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update store item image' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreItemImageDto: UpdateStoreItemImageDto) {
    return this.storeItemImageService.update(id, updateStoreItemImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove store item image' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemImageService.remove(id);
  }
}
