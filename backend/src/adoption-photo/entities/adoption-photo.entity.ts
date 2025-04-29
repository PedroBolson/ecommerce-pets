import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'adoption_photo' })
export class AdoptionPhoto {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    altText?: string;

    @Column({ default: 0 })
    displayOrder: number;
}