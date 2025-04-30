import { PartialType } from '@nestjs/swagger';
import { CreateStoreItemDto } from './create-store-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateStoreItemDto extends PartialType(CreateStoreItemDto) {
    @ApiProperty({
        description: 'Unique SKU identifier for the store item',
        required: false,
        example: 'PET-TOY-002'
    })
    @IsOptional()
    sku?: string;

    @ApiProperty({
        description: 'Name of the product',
        required: false,
        example: 'Premium Dog Leash - Deluxe Edition'
    })
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Detailed description of the product',
        required: false,
        example: 'Updated high-quality leather leash with reinforced stitching and padded handle'
    })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Price in currency units',
        required: false,
        minimum: 0,
        example: 34.99
    })
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Available quantity in stock',
        required: false,
        minimum: 0,
        example: 75
    })
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'ID of the category this item belongs to',
        required: false,
        example: '550e8400-e29b-41d4-a716-446655440001'
    })
    @IsOptional()
    categoryId?: string;
}
