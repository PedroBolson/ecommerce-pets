import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { StoreCategory } from '../../store-category/entities/store-category.entity';
import { StoreItemImage } from '../../store-item-image/entities/store-item-image.entity';

@Entity({ name: 'store_item' })
export class StoreItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    sku: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('int', { default: 0 })
    stock: number;

    @ManyToOne(() => StoreCategory, cat => cat.items, { eager: true })
    category: StoreCategory;

    @OneToMany(() => StoreItemImage, img => img.item)
    images: StoreItemImage[];
}