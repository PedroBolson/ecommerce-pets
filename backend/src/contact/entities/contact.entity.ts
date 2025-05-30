import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'contacts' })
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({ description: 'Unique contact ID' })
    id: string;

    @Column()
    @ApiProperty({ description: 'Full name' })
    fullName: string;

    @Column()
    @ApiProperty({ description: 'Phone number' })
    phone: string;

    @Column()
    @ApiProperty({ description: 'Email address' })
    email: string;

    @Column()
    @ApiProperty({ description: 'City' })
    city: string;

    @Column()
    @ApiProperty({ description: 'State' })
    state: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Interest on product/dog with that uuid' })
    interestUuid: string;

    @Column({ default: true })
    @ApiProperty({ description: 'Witch interest type are' })
    isDog: boolean;

    @CreateDateColumn()
    @ApiProperty({ description: 'Creation date' })
    createdAt: Date;

    @Column({ default: true })
    @ApiProperty({ description: 'Contact status' })
    isActive: boolean;
}
