import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdoptionPhotoService } from './adoption-photo.service';
import { CreateAdoptionPhotoDto } from './dto/create-adoption-photo.dto';
import { UpdateAdoptionPhotoDto } from './dto/update-adoption-photo.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('adoption-photos')
@Controller('adoption-photos')
export class AdoptionPhotoController {
  constructor(private readonly adoptionPhotoService: AdoptionPhotoService) { }

  @Post()
  @ApiOperation({ summary: 'Add new adoption photo' })
  create(@Body() createAdoptionPhotoDto: CreateAdoptionPhotoDto) {
    return this.adoptionPhotoService.create(createAdoptionPhotoDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all adoption photos for public display' })
  findAll() {
    return this.adoptionPhotoService.findAll();
  }

  @Get('breed/:breedId')
  @ApiOperation({ summary: 'List all adoption photos for a specific breed' })
  findByBreed(@Param('breedId') breedId: string) {
    return this.adoptionPhotoService.findByBreed(breedId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get adoption photo by ID' })
  findOne(@Param('id') id: string) {
    return this.adoptionPhotoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update adoption photo' })
  update(@Param('id') id: string, @Body() updateAdoptionPhotoDto: UpdateAdoptionPhotoDto) {
    return this.adoptionPhotoService.update(id, updateAdoptionPhotoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove adoption photo' })
  remove(@Param('id') id: string) {
    return this.adoptionPhotoService.remove(id);
  }
}
