import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Breed } from '../../breed/entities/breed.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'pet_knowledge' })
export class PetKnowledge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Title of the article' })
    @Column()
    title: string;

    @ApiProperty({ description: 'Summary or short description' })
    @Column()
    summary: string;

    @ApiProperty({ description: 'Main content of the article' })
    @Column('text')
    content: string;

    @ApiProperty({ description: 'Image URL for the article' })
    @Column({ nullable: true })
    imageUrl?: string;

    @ApiProperty({ description: 'Category of knowledge', example: 'Health, Training, Nutrition' })
    @Column()
    category: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Breed, { nullable: true })
    @JoinColumn({ name: 'breed_id' })
    @IsOptional()
    @ApiProperty({ description: 'Breed associated with the article', type: Breed, nullable: true })
    breed?: Breed;
}
