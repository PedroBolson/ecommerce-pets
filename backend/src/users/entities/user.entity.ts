import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
    @ApiProperty({
        description: 'The unique identifier of the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'The email address of the user',
        example: 'user@example.com'
    })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        description: 'The hashed password of the user',
        example: 'hashedpassword',
        writeOnly: true // Indica que este campo só deve ser usado para escrita, não para leitura
    })
    @Column()
    password: string;

    @ApiProperty({
        description: 'The role of the user in the system',
        example: 'user',
        enum: ['user', 'admin']
    })
    @Column({ default: 'user' })
    role: string;
}
