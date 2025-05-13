import { IsNotEmpty, IsString, IsOptional, IsUrl, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdoptionPhotoDto {
    @ApiProperty({ description: 'URL of the adopters\' photo' })
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @ApiProperty({ description: 'Alternative text for the image' })
    @IsOptional()
    @IsString()
    altText?: string;

    @ApiProperty({ description: 'Display order on the page', default: 0 })
    @IsOptional()
    @IsNumber()
    displayOrder?: number;

    @ApiProperty({ description: 'ID of the adopted pet\'s breed' })
    @IsNotEmpty()
    @IsUUID()
    breedId: string;
}
