import { PartialType } from '@nestjs/swagger';
import { CreateStoreItemImageDto } from './create-store-item-image.dto';

export class UpdateStoreItemImageDto extends PartialType(CreateStoreItemImageDto) {}
