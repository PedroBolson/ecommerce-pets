import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBreedDto {
    @ApiProperty({
        description: 'The name of the breed',
        example: 'Golden Retriever'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Optional description of the breed',
        required: false,
        example: 'Family-friendly breed known for its golden coat and friendly temperament'
    })
    @IsOptional()
    @IsString()
    description?: string;
}
