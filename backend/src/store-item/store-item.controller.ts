import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, ParseFloatPipe, ParseIntPipe } from '@nestjs/common';
import { StoreItemService } from './store-item.service';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiBearerAuth('access-token')
  create(@Body() createStoreItemDto: CreateStoreItemDto) {
    return this.storeItemService.create(createStoreItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all store items with optional filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starting from 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'inStock', required: false, description: 'Filter by stock availability', type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Retrieved store items successfully with pagination',
    type: Object
  })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice', new ParseFloatPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseFloatPipe({ optional: true })) maxPrice?: number,
    @Query('inStock') inStockStr?: string,
  ) {
    // Convert string to boolean only when the parameter exists
    const inStock = inStockStr !== undefined ?
      inStockStr === 'true' || inStockStr === '1' : undefined;

    return this.storeItemService.findAll({
      page,
      limit,
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
  @ApiBearerAuth('access-token')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreItemDto: UpdateStoreItemDto) {
    return this.storeItemService.update(id, updateStoreItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a store item' })
  @ApiParam({ name: 'id', description: 'Store item ID' })
  @ApiResponse({ status: 200, description: 'The store item has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Store item not found' })
  @ApiBearerAuth('access-token')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeItemService.remove(id);
  }
}
