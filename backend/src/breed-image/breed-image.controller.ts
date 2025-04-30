import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BreedImageService } from './breed-image.service';
import { CreateBreedImageDto } from './dto/create-breed-image.dto';
import { UpdateBreedImageDto } from './dto/update-breed-image.dto';

@Controller('breed-image')
export class BreedImageController {
  constructor(private readonly breedImageService: BreedImageService) { }

  @Post()
  create(@Body() createBreedImageDto: CreateBreedImageDto) {
    return this.breedImageService.create(createBreedImageDto);
  }

  @Get()
  findAll() {
    return this.breedImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.breedImageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBreedImageDto: UpdateBreedImageDto) {
    return this.breedImageService.update(id, updateBreedImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.breedImageService.remove(id);
  }
}
