import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedService } from './breed.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('breeds')
@Controller('breed')
export class BreedController {
  constructor(private readonly breedService: BreedService) { }

  @Post()
  @ApiOperation({ summary: 'Create new breed' })
  @ApiBearerAuth('access-token')
  create(@Body() createBreedDto: CreateBreedDto) {
    return this.breedService.create(createBreedDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all breeds' })
  findAll() {
    return this.breedService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get breed by ID' })
  findOne(@Param('id') id: string) {
    return this.breedService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update breed information' })
  @ApiBearerAuth('access-token')
  update(@Param('id') id: string, @Body() updateBreedDto: UpdateBreedDto) {
    return this.breedService.update(id, updateBreedDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove breed' })
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.breedService.remove(id);
  }
}
