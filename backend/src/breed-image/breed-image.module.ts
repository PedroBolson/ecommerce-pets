import { Module } from '@nestjs/common';
import { BreedImageService } from './breed-image.service';
import { BreedImageController } from './breed-image.controller';

@Module({
  controllers: [BreedImageController],
  providers: [BreedImageService],
})
export class BreedImageModule {}
