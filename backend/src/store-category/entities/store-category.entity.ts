import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StoreItem } from '../../store-item/entities/store-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'store_category' })
export class StoreCategory {
    @ApiProperty({
        description: 'The unique identifier for the store category',
        example: '550e8400-e29b-41d4-a716-446655440003',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Name of the product category',
        example: 'Dog Toys'
    })
    @Column({ unique: true })
    name: string;

    @ApiProperty({
        description: 'Detailed description of the category',
        example: 'High-quality toys for dogs of all breeds and sizes',
        nullable: true
    })
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ApiProperty({
        description: 'Products belonging to this category',
        type: [StoreItem]
    })
    @OneToMany(() => StoreItem, item => item.category)
    items: StoreItem[];
}