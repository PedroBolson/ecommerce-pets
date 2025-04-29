import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Breed } from '../../breed/entities/breed.entity';

@Entity({ name: 'breed_image' })
export class BreedImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    altText?: string;

    @Column({ default: 0 })
    displayOrder: number;

    @ManyToOne(() => Breed, breed => breed.images, { onDelete: 'CASCADE' })
    breed: Breed;
}