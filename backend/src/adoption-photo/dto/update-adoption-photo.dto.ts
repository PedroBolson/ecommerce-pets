import { PartialType } from '@nestjs/swagger';
import { CreateAdoptionPhotoDto } from './create-adoption-photo.dto';

export class UpdateAdoptionPhotoDto extends PartialType(CreateAdoptionPhotoDto) {}
