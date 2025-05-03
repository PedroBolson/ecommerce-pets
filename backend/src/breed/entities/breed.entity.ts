import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BreedImage } from '../../breed-image/entities/breed-image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'breed' })
export class Breed {
    @ApiProperty({
        description: 'The unique identifier for the breed',
        example: '550e8400-e29b-41d4-a716-446655440000',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'The name of the dog breed',
        example: 'Golden Retriever'
    })
    @Column()
    name: string;

    @ApiProperty({
        description: 'Detailed description of the breed characteristics',
        example: 'The Golden Retriever is a medium-large gun dog that was bred to retrieve shot waterfowl during hunting.',
        nullable: true
    })
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ApiProperty({
        description: 'Collection of images associated with this breed',
        type: [BreedImage]
    })
    @OneToMany(() => BreedImage, image => image.breed)
    images: BreedImage[];
}