import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DogService } from './dog.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Dog } from './entities/dog.entity';

@ApiTags('dogs')
@Controller('dog')
export class DogController {
  constructor(private readonly dogService: DogService) { }

  @Post()
  @ApiOperation({ summary: 'Create new dog listing' })
  @ApiResponse({ status: 201, description: 'Dog successfully created', type: Dog })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createDogDto: CreateDogDto) {
    return this.dogService.create(createDogDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all dogs with optional filtering' })
  @ApiQuery({ name: 'breedId', required: false, description: 'Filter by breed ID' })
  @ApiQuery({ name: 'gender', required: false, enum: ['Male', 'Female'], description: 'Filter by gender' })
  @ApiQuery({ name: 'size', required: false, enum: ['Small', 'Medium', 'Large'], description: 'Filter by size' })
  @ApiQuery({ name: 'minAge', required: false, description: 'Minimum age in months' })
  @ApiQuery({ name: 'maxAge', required: false, description: 'Maximum age in months' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starting from 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiResponse({ status: 200, description: 'List of dogs with pagination data' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() filters: any
  ) {
    return this.dogService.findAll({
      page: +page,
      limit: +limit,
      ...filters
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dog by ID' })
  @ApiParam({ name: 'id', description: 'Dog ID' })
  @ApiResponse({ status: 200, description: 'Dog details', type: Dog })
  @ApiResponse({ status: 404, description: 'Dog not found' })
  findOne(@Param('id') id: string) {
    return this.dogService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update dog information' })
  @ApiParam({ name: 'id', description: 'Dog ID' })
  @ApiResponse({ status: 200, description: 'Dog successfully updated', type: Dog })
  @ApiResponse({ status: 404, description: 'Dog not found' })
  update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto) {
    return this.dogService.update(id, updateDogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove dog listing' })
  @ApiParam({ name: 'id', description: 'Dog ID' })
  @ApiResponse({ status: 200, description: 'Dog successfully removed' })
  @ApiResponse({ status: 404, description: 'Dog not found' })
  remove(@Param('id') id: string) {
    return this.dogService.remove(id);
  }
}
