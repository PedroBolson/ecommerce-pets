import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBreedDto } from './create-breed.dto';

export class UpdateBreedDto extends PartialType(CreateBreedDto) {
    @ApiProperty({
        description: 'The name of the breed',
        required: false,
        example: 'Labrador Retriever'
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Description of the breed',
        required: false,
        example: 'Popular family dog known for its friendly nature and intelligence'
    })
    @IsOptional()
    @IsString()
    description?: string;
}
