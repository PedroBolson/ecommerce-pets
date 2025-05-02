import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreCategoryDto {
    @ApiProperty({
        description: 'Name of the store category',
        example: 'Dog Toys'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Optional description of the category',
        required: false,
        example: 'All toys designed for dogs of various sizes and preferences'
    })
    @IsOptional()
    @IsString()
    description?: string;
}
