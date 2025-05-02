import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, MinLength, Matches, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'Updated email address',
        example: 'newuser@example.com',
        format: 'email',
        required: false
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Current password (required when changing password)',
        example: 'CurrentPassword123',
        required: false
    })
    @IsOptional()
    @IsString()
    currentPassword?: string;

    @ApiProperty({
        description: 'New password (min 8 characters, must contain uppercase, lowercase and number)',
        example: 'NewPassword123',
        minLength: 8,
        required: false
    })
    @IsOptional()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password too weak',
    })
    password?: string;

    @ApiProperty({
        description: 'Password confirmation (must match new password)',
        example: 'NewPassword123',
        required: false
    })
    @IsOptional()
    @IsString()
    confirmPassword?: string;

    @ApiProperty({
        description: 'User role',
        example: 'admin',
        required: false
    })
    @IsOptional()
    role?: string;
}
