import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreItemDto {
    @ApiProperty({
        description: 'Unique SKU identifier for the store item',
        example: 'TOY-001'
    })
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiProperty({
        description: 'Name of the product',
        example: 'Premium Dog Leash'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Detailed description of the product',
        required: false,
        example: 'High-quality leather leash with reinforced stitching, perfect for large dogs'
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Price in currency units',
        minimum: 0,
        example: 29.99
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        description: 'Available quantity in stock',
        required: false,
        minimum: 0,
        example: 50
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @ApiProperty({
        description: 'ID of the category this item belongs to',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;
}
