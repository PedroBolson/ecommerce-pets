import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, ParseBoolPipe, ParseFloatPipe } from '@nestjs/common';
import { StoreItemService } from './store-item.service';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StoreItem } from './entities/store-item.entity';

@ApiTags('Store Items')
@Controller('store-item')
export class StoreItemController {
  constructor(private readonly storeItemService: StoreItemService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new store item' })
  @ApiBody({ type: CreateStoreItemDto })
  @ApiResponse({
    status: 201,
    description: 'The store item has been successfully created',
    type: StoreItem
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createStoreItemDto: CreateStoreItemDto) {
    return this.storeItemService.create(createStoreItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all store items with optional filtering' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter by stock availability', type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all store items successfully',
    type: [StoreItem]
  })
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
  @ApiOperation({ summary: 'Get a specific store item by ID' })
  @ApiParam({ name: 'id', description: 'Store item ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved the store item successfully',
    type: StoreItem
  })
  @ApiResponse({ status: 404, description: 'Store item not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a store item' })
  @ApiParam({ name: 'id', description: 'Store item ID' })
  @ApiBody({ type: UpdateStoreItemDto })
  @ApiResponse({
    status: 200,
    description: 'The store item has been successfully updated',
    type: StoreItem
  })
  @ApiResponse({ status: 404, description: 'Store item not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreItemDto: UpdateStoreItemDto) {
    return this.storeItemService.update(id, updateStoreItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a store item' })
  @ApiParam({ name: 'id', description: 'Store item ID' })
  @ApiResponse({ status: 200, description: 'The store item has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Store item not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemService.remove(id);
  }
}
