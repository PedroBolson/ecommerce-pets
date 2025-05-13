import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreItemImageDto {
    @ApiProperty({
        description: 'URL of the product image',
        example: 'https://example.com/images/dog-leash.jpg'
    })
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @ApiProperty({
        description: 'Alternative text for the image',
        required: false,
        example: 'Premium dog leash with leather handle'
    })
    @IsOptional()
    @IsString()
    altText?: string;

    @ApiProperty({
        description: 'Display order on the product page',
        required: false,
        default: 0,
        example: 1
    })
    @IsOptional()
    @IsNumber()
    displayOrder?: number;

    @ApiProperty({
        description: 'ID of the store item this image represents',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsNotEmpty()
    @IsUUID()
    itemId: string;

    @ApiProperty({
        description: 'Whether this is the main/featured image for the product',
        required: false,
        default: false,
        example: true
    })
    @IsOptional()
    isMain?: boolean;
}
