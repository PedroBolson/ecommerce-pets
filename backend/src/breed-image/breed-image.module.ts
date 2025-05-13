import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedImageService } from './breed-image.service';
import { BreedImageController } from './breed-image.controller';
import { BreedImage } from './entities/breed-image.entity';
import { Breed } from '../breed/entities/breed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BreedImage, Breed])],
  controllers: [BreedImageController],
  providers: [BreedImageService],
})
export class BreedImageModule { }
