import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreItem } from '../../store-item/entities/store-item.entity';

@Entity({ name: 'store_item_image' })
export class StoreItemImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    altText?: string;

    @Column({ default: 0 })
    displayOrder: number;

    @ManyToOne(() => StoreItem, item => item.images, { onDelete: 'CASCADE' })
    item: StoreItem;
}