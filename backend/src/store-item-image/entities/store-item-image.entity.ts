/* istanbul ignore file */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreItem } from '../../store-item/entities/store-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'store_item_image' })
export class StoreItemImage {
    @ApiProperty({
        description: 'The unique identifier for the store item image',
        example: '550e8400-e29b-41d4-a716-446655440005',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'URL pointing to the product image',
        example: 'https://example.com/images/blue-dog-ball.jpg'
    })
    @Column()
    url: string;

    @ApiProperty({
        description: 'Alternative text for accessibility',
        example: 'Blue rubber ball for dogs',
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
        description: 'The product this image belongs to',
        type: () => StoreItem
    })
    @ManyToOne(() => StoreItem, item => item.images, { onDelete: 'CASCADE' })
    item: StoreItem;
}