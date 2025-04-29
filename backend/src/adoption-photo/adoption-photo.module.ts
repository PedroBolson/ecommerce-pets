import { Module } from '@nestjs/common';
import { AdoptionPhotoService } from './adoption-photo.service';
import { AdoptionPhotoController } from './adoption-photo.controller';

@Module({
  controllers: [AdoptionPhotoController],
  providers: [AdoptionPhotoService],
})
export class AdoptionPhotoModule {}
