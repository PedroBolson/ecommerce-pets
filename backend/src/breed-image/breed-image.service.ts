import { Injectable } from '@nestjs/common';
import { CreateBreedImageDto } from './dto/create-breed-image.dto';
import { UpdateBreedImageDto } from './dto/update-breed-image.dto';

@Injectable()
export class BreedImageService {
  create(createBreedImageDto: CreateBreedImageDto) {
    return 'This action adds a new breedImage';
  }

  findAll() {
    return `This action returns all breedImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} breedImage`;
  }

  update(id: number, updateBreedImageDto: UpdateBreedImageDto) {
    return `This action updates a #${id} breedImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} breedImage`;
  }
}
