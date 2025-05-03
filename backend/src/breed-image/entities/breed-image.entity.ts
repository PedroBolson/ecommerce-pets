/* istanbul ignore file */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Breed } from '../../breed/entities/breed.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'breed_image' })
export class BreedImage {
    @ApiProperty({
        description: 'The unique identifier for the breed image',
        example: '550e8400-e29b-41d4-a716-446655440001',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'URL pointing to the breed image',
        example: 'https://example.com/images/golden-retriever.jpg'
    })
    @Column()
    url: string;

    @ApiProperty({
        description: 'Alternative text for accessibility',
        example: 'Golden Retriever standing in a grassy field',
        nullable: true
    })
    @Column({ nullable: true })
    altText?: string;

    @ApiProperty({
        description: 'Order in which the image should be displayed (lower numbers first)',
        example: 1,
        default: 0
    })
    @Column({ default: 0 })
    displayOrder: number;

    @ApiProperty({
        description: 'The breed this image belongs to',
        type: () => Breed
    })
    @ManyToOne(() => Breed, breed => breed.images, { onDelete: 'CASCADE' })
    breed: Breed;
}