import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateStoreItemDto {
    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsNotEmpty()
    @IsUUID()
    categoryId: string;
}
