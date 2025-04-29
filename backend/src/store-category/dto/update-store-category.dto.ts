import { PartialType } from '@nestjs/swagger';
import { CreateStoreCategoryDto } from './create-store-category.dto';

export class UpdateStoreCategoryDto extends PartialType(CreateStoreCategoryDto) {}
