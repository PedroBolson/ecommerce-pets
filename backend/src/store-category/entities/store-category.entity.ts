import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StoreItem } from '../../store-item/entities/store-item.entity';

@Entity({ name: 'store_category' })
export class StoreCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @OneToMany(() => StoreItem, item => item.category)
    items: StoreItem[];
}