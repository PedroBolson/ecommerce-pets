import { PartialType } from '@nestjs/swagger';
import { CreateStoreCategoryDto } from './create-store-category.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreCategoryDto extends PartialType(CreateStoreCategoryDto) {
    @ApiProperty({
        description: 'Updated name of the store category',
        required: false,
        example: 'Premium Dog Toys'
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Updated description of the category',
        required: false,
        example: 'High-quality toys for dogs of all breeds and sizes'
    })
    @IsOptional()
    @IsString()
    description?: string;
}
