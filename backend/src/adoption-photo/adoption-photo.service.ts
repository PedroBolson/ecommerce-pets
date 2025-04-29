import { Injectable } from '@nestjs/common';
import { CreateAdoptionPhotoDto } from './dto/create-adoption-photo.dto';
import { UpdateAdoptionPhotoDto } from './dto/update-adoption-photo.dto';

@Injectable()
export class AdoptionPhotoService {
  create(createAdoptionPhotoDto: CreateAdoptionPhotoDto) {
    return 'This action adds a new adoptionPhoto';
  }

  findAll() {
    return `This action returns all adoptionPhoto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adoptionPhoto`;
  }

  update(id: number, updateAdoptionPhotoDto: UpdateAdoptionPhotoDto) {
    return `This action updates a #${id} adoptionPhoto`;
  }

  remove(id: number) {
    return `This action removes a #${id} adoptionPhoto`;
  }
}
