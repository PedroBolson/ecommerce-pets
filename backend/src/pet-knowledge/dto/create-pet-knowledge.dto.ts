import { IsNotEmpty, IsString, IsOptional, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePetKnowledgeDto {
    @ApiProperty({
        description: 'Title of the pet knowledge article',
        example: 'How to Identify a Pomeranian'
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Brief summary of the article',
        example: 'Learn how to identify Pomeranian dogs by their distinctive features'
    })
    @IsNotEmpty()
    @IsString()
    summary: string;

    @ApiProperty({
        description: 'Main content of the article',
        example: 'Pomeranians are small dogs known for their...'
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({
        description: 'Image URL for the article',
        required: false,
        example: 'https://example.com/images/pomeranian-guide.jpg'
    })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @ApiProperty({
        description: 'Category of the knowledge',
        example: 'Breeds'
    })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({
        description: 'Optional ID of related breed',
        required: false,
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsOptional()
    @IsUUID()
    breedId?: string;
}
