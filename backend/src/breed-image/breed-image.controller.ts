import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedImageService } from './breed-image.service';
import { CreateBreedImageDto } from './dto/create-breed-image.dto';
import { UpdateBreedImageDto } from './dto/update-breed-image.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('breed-images')
@Controller('breed-image')
export class BreedImageController {
  constructor(private readonly breedImageService: BreedImageService) { }

  @Post()
  @ApiOperation({ summary: 'Add new breed image' })
  @ApiBearerAuth('access-token')
  create(@Body() createBreedImageDto: CreateBreedImageDto) {
    return this.breedImageService.create(createBreedImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all breed images' })
  findAll() {
    return this.breedImageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get breed image by ID' })
  findOne(@Param('id') id: string) {
    return this.breedImageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update breed image' })
  @ApiBearerAuth('access-token')
  update(@Param('id') id: string, @Body() updateBreedImageDto: UpdateBreedImageDto) {
    return this.breedImageService.update(id, updateBreedImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove breed image' })
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.breedImageService.remove(id);
  }
}
