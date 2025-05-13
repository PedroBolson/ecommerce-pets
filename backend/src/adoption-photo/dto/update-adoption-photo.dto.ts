import { PartialType } from '@nestjs/swagger';
import { CreateAdoptionPhotoDto } from './create-adoption-photo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAdoptionPhotoDto extends PartialType(CreateAdoptionPhotoDto) {
    @ApiProperty({
        description: 'URL of the adoption photo',
        required: false,
        example: 'https://example.com/updated-adoption-photo.jpg'
    })
    @IsOptional()
    url?: string;

    @ApiProperty({
        description: 'Alternative text for the image',
        required: false,
        example: 'Updated description of the family with their adopted pet'
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
        description: 'ID of the adopted pet\'s breed',
        required: false,
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsOptional()
    breedId?: string;
}
