import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionPhotoService } from './adoption-photo.service';
import { AdoptionPhotoController } from './adoption-photo.controller';
import { AdoptionPhoto } from './entities/adoption-photo.entity';
import { Breed } from '../breed/entities/breed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionPhoto, Breed])],
  controllers: [AdoptionPhotoController],
  providers: [AdoptionPhotoService],
})
export class AdoptionPhotoModule { }
