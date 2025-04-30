import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Breed } from '../../breed/entities/breed.entity';

@Entity({ name: 'adoption_photo' })
export class AdoptionPhoto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    altText?: string;

    @Column({ default: 0 })
    displayOrder: number;

    @ManyToOne(() => Breed, { eager: true })
    @JoinColumn({ name: 'breed_id' })
    breed: Breed;
}