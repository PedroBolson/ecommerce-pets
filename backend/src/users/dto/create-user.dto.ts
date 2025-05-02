import { IsEmail, IsNotEmpty, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
        format: 'email'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Confirmation of email address (must match email)',
        example: 'user@example.com',
        format: 'email'
    })
    @IsEmail()
    @IsNotEmpty()
    confirmEmail: string;

    @ApiProperty({
        description: 'User password (min 8 characters, must contain uppercase, lowercase and number)',
        example: 'Password123',
        minLength: 8
    })
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password too weak',
    })
    password: string;

    @ApiProperty({
        description: 'Password confirmation (must match password)',
        example: 'Password123'
    })
    @IsNotEmpty()
    confirmPassword: string;

    @ApiProperty({
        description: 'User role (optional)',
        example: 'customer',
        required: false
    })
    @IsOptional()
    role?: string;
}
