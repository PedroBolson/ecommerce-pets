import { PartialType } from '@nestjs/swagger';
import { CreateStoreItemImageDto } from './create-store-item-image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateStoreItemImageDto extends PartialType(CreateStoreItemImageDto) {
    @ApiProperty({
        description: 'URL of the product image',
        required: false,
        example: 'https://example.com/images/updated-dog-leash.jpg'
    })
    @IsOptional()
    url?: string;

    @ApiProperty({
        description: 'Alternative text for the image',
        required: false,
        example: 'Updated premium dog leash with padded leather handle'
    })
    @IsOptional()
    altText?: string;

    @ApiProperty({
        description: 'Display order on the product page',
        required: false,
        example: 2
    })
    @IsOptional()
    displayOrder?: number;

    @ApiProperty({
        description: 'ID of the store item this image represents',
        required: false,
        example: '550e8400-e29b-41d4-a716-446655440001'
    })
    @IsOptional()
    itemId?: string;

    @ApiProperty({
        description: 'Whether this is the main/featured image for the product',
        required: false,
        example: true
    })
    @IsOptional()
    isMain?: boolean;
}
