import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { StoreCategory } from '../../store-category/entities/store-category.entity';
import { StoreItemImage } from '../../store-item-image/entities/store-item-image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'store_item' })
export class StoreItem {
    @ApiProperty({
        description: 'The unique identifier for the store item',
        example: '550e8400-e29b-41d4-a716-446655440004',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Stock Keeping Unit - unique identifier for inventory management',
        example: 'TOY-BALL-001'
    })
    @Column({ unique: true })
    sku: string;

    @ApiProperty({
        description: 'Name of the product',
        example: 'Premium Dog Ball'
    })
    @Column()
    name: string;

    @ApiProperty({
        description: 'Detailed description of the product',
        example: 'Durable rubber ball that bounces high and floats in water',
        nullable: true
    })
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ApiProperty({
        description: 'Price in currency units',
        example: 14.99
    })
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ApiProperty({
        description: 'Current inventory quantity',
        example: 50,
        default: 0
    })
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({
        description: 'Size of the product in grams',
        example: 500,
        default: 0
    })
    @Column('int', { default: 0 })
    size: number;

    @ApiProperty({
        description: 'The category this item belongs to',
        type: () => StoreCategory
    })
    @ManyToOne(() => StoreCategory, cat => cat.items, { eager: true })
    category: StoreCategory;

    @ApiProperty({
        description: 'Images of the product',
        type: [StoreItemImage]
    })
    @OneToMany(() => StoreItemImage, img => img.item)
    images: StoreItemImage[];
}