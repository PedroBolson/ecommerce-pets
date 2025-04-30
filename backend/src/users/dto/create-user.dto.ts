import { IsEmail, IsNotEmpty, IsOptional, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsEmail()
    @IsNotEmpty()
    confirmEmail: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password too weak',
    })
    password: string;

    @IsNotEmpty()
    confirmPassword: string;

    @IsOptional()
    role?: string;
}
