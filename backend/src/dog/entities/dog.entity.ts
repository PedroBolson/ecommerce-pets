import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Breed } from '../../breed/entities/breed.entity';

@Entity({ name: 'dog' })
export class Dog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    sku: string;

    @ManyToOne(() => Breed, { eager: true })
    breed: Breed;

    @Column({ type: 'enum', enum: ['Male', 'Female'] })
    gender: 'Male' | 'Female';

    @Column('int')
    ageInMonths: number;

    @Column({ nullable: true })
    size?: string;

    @Column({ nullable: true })
    color?: string;

    @Column('decimal', { precision: 12, scale: 2 })
    price: number;

    @Column({ default: false })
    vaccinated: boolean;

    @Column({ default: false })
    dewormed: boolean;

    @Column({ nullable: true })
    certification?: string;

    @Column({ default: false })
    microchip: boolean;

    @Column({ nullable: true })
    location?: string;

    @Column('date', { nullable: true })
    publishedDate?: string;

    @Column('text', { nullable: true })
    additionalInfo?: string;
}