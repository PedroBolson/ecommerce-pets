import { PartialType } from '@nestjs/swagger';
import { CreateBreedImageDto } from './create-breed-image.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateBreedImageDto extends PartialType(CreateBreedImageDto) {
    @ApiProperty({
        description: 'URL of the breed image',
        required: false,
        example: 'https://example.com/updated-breed-image.jpg'
    })
    @IsOptional()
    url?: string;

    @ApiProperty({
        description: 'Alternative text for the image',
        required: false,
        example: 'Updated photo of Golden Retriever breed'
    })
    @IsOptional()
    altText?: string;

    @ApiProperty({
        description: 'Display order on the page',
        required: false,
        example: 2
    })
    @IsOptional()
    displayOrder?: number;

    @ApiProperty({
        description: 'ID of the breed this image represents',
        required: false,
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsOptional()
    breedId?: string;

    @ApiProperty({
        description: 'Whether this is the main image for the breed',
        required: false,
        example: true
    })
    @IsOptional()
    isMain?: boolean;
}
