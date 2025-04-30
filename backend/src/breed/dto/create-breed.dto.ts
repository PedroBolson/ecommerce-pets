import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBreedDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
