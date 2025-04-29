import { PartialType } from '@nestjs/swagger';
import { CreateBreedImageDto } from './create-breed-image.dto';

export class UpdateBreedImageDto extends PartialType(CreateBreedImageDto) {}
