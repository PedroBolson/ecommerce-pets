/* istanbul ignore file */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Breed } from '../../breed/entities/breed.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'adoption_photo' })
export class AdoptionPhoto {
    @ApiProperty({
        description: 'The unique identifier for the adoption photo',
        example: '550e8400-e29b-41d4-a716-446655440002',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'URL pointing to the adoption photo',
        example: 'https://example.com/images/adopted-golden.jpg'
    })
    @Column()
    url: string;

    @ApiProperty({
        description: 'Alternative text for accessibility',
        example: 'Family with their newly adopted Golden Retriever',
        nullable: true
    })
    @Column({ nullable: true })
    altText?: string;

    @ApiProperty({
        description: 'Order in which the photo should be displayed (lower numbers first)',
        example: 1,
        default: 0
    })
    @Column({ default: 0 })
    displayOrder: number;

    @ApiProperty({
        description: 'The breed of the adopted pet',
        type: () => Breed
    })
    @ManyToOne(() => Breed, { eager: true })
    @JoinColumn({ name: 'breed_id' })
    breed: Breed;
}