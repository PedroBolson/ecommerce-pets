import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
