import { IsNotEmpty, IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class CreateStoreItemImageDto {
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
    itemId: string;
}
