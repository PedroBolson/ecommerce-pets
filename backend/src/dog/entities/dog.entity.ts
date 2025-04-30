import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Breed } from '../../breed/entities/breed.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'dog' })
export class Dog {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Unique SKU for the dog' })
    @Column({ unique: true })
    sku: string;

    @ApiProperty({ description: 'Breed information' })
    @ManyToOne(() => Breed, { eager: true })
    breed: Breed;

    @ApiProperty({ description: 'Gender of the dog', enum: ['Male', 'Female'] })
    @Column({ type: 'enum', enum: ['Male', 'Female'] })
    gender: 'Male' | 'Female';

    @ApiProperty({ description: 'Age of the dog in months' })
    @Column('int')
    ageInMonths: number;

    @ApiProperty({ description: 'Size category of the dog' })
    @Column({ nullable: true })
    size?: string;

    @ApiProperty({ description: 'Color of the dog' })
    @Column({ nullable: true })
    color?: string;

    @ApiProperty({ description: 'Price in currency units' })
    @Column('decimal', { precision: 12, scale: 2 })
    price: number;

    @ApiProperty({ description: 'Whether the dog is vaccinated' })
    @Column({ default: false })
    vaccinated: boolean;

    @ApiProperty({ description: 'Whether the dog has been dewormed' })
    @Column({ default: false })
    dewormed: boolean;

    @ApiProperty({ description: 'Certification details' })
    @Column({ nullable: true })
    certification?: string;

    @ApiProperty({ description: 'Whether the dog has a microchip' })
    @Column({ default: false })
    microchip: boolean;

    @ApiProperty({ description: 'Current location of the dog' })
    @Column({ nullable: true })
    location?: string;

    @ApiProperty({ description: 'Date when the listing was published' })
    @Column('date', { nullable: true })
    publishedDate?: string;

    @ApiProperty({ description: 'Additional information about the dog' })
    @Column('text', { nullable: true })
    additionalInfo?: string;
}