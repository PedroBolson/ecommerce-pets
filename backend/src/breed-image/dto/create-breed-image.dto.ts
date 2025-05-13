import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBreedImageDto {
    @ApiProperty({
        description: 'URL of the breed image',
        example: 'https://example.com/images/golden-retriever.jpg'
    })
    @IsNotEmpty()
    @IsString()
    url: string;

    @ApiProperty({
        description: 'Alternative text for the image',
        required: false,
        example: 'Golden Retriever standing in a grassy field'
    })
    @IsOptional()
    @IsString()
    altText?: string;

    @ApiProperty({
        description: 'Display order on the page',
        required: false,
        default: 0,
        example: 1
    })
    @IsOptional()
    @IsNumber()
    displayOrder?: number;

    @ApiProperty({
        description: 'ID of the breed this image represents',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsNotEmpty()
    @IsUUID()
    breedId: string;
}
