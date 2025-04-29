import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BreedImage } from '../../breed-image/entities/breed-image.entity';

@Entity({ name: 'breed' })
export class Breed {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @OneToMany(() => BreedImage, image => image.breed)
    images: BreedImage[];
}