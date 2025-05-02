import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreCategoryService } from './store-category.service';
import { CreateStoreCategoryDto } from './dto/create-store-category.dto';
import { UpdateStoreCategoryDto } from './dto/update-store-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { StoreCategory } from './entities/store-category.entity';

@ApiTags('Store Categories')
@Controller('store-category')
export class StoreCategoryController {
  constructor(private readonly storeCategoryService: StoreCategoryService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new store category' })
  @ApiBody({ type: CreateStoreCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created',
    type: StoreCategory
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createStoreCategoryDto: CreateStoreCategoryDto) {
    return this.storeCategoryService.create(createStoreCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all store categories' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all store categories successfully',
    type: [StoreCategory]
  })
  findAll() {
    return this.storeCategoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific store category by ID' })
  @ApiParam({ name: 'id', description: 'Store category ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved the store category successfully',
    type: StoreCategory
  })
  @ApiResponse({ status: 404, description: 'Store category not found' })
  findOne(@Param('id') id: string) {
    return this.storeCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a store category' })
  @ApiParam({ name: 'id', description: 'Store category ID' })
  @ApiBody({ type: UpdateStoreCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'The store category has been successfully updated',
    type: StoreCategory
  })
  @ApiResponse({ status: 404, description: 'Store category not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(@Param('id') id: string, @Body() updateStoreCategoryDto: UpdateStoreCategoryDto) {
    return this.storeCategoryService.update(id, updateStoreCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a store category' })
  @ApiParam({ name: 'id', description: 'Store category ID' })
  @ApiResponse({ status: 200, description: 'The store category has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Store category not found' })
  remove(@Param('id') id: string) {
    return this.storeCategoryService.remove(id);
  }
}
