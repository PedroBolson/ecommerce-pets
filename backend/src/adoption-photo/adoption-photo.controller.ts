import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdoptionPhotoService } from './adoption-photo.service';
import { CreateAdoptionPhotoDto } from './dto/create-adoption-photo.dto';
import { UpdateAdoptionPhotoDto } from './dto/update-adoption-photo.dto';

@Controller('adoption-photo')
export class AdoptionPhotoController {
  constructor(private readonly adoptionPhotoService: AdoptionPhotoService) {}

  @Post()
  create(@Body() createAdoptionPhotoDto: CreateAdoptionPhotoDto) {
    return this.adoptionPhotoService.create(createAdoptionPhotoDto);
  }

  @Get()
  findAll() {
    return this.adoptionPhotoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionPhotoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdoptionPhotoDto: UpdateAdoptionPhotoDto) {
    return this.adoptionPhotoService.update(+id, updateAdoptionPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionPhotoService.remove(+id);
  }
}
