import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateBreedImageDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    altText?: string;

    @IsOptional()
    @IsNumber()
    displayOrder?: number;

    @IsNotEmpty()
    @IsUUID()
    breedId: string;
}
