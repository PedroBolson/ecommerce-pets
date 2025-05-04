import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, IsUUID, IsBoolean } from 'class-validator';

export class CreateContactDto {
    @ApiProperty({
        description: 'Full name',
        example: 'João Silva'
    })
    @IsNotEmpty({ message: 'Full name is required' })
    @IsString({ message: 'Full name must be a string' })
    @MinLength(3, { message: 'Full name must have at least 3 characters' })
    @MaxLength(100, { message: 'Full name must have at most 100 characters' })
    fullName: string;

    @ApiProperty({
        description: 'Phone number',
        example: '(11) 98765-4321'
    })
    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
    phone: string;

    @ApiProperty({
        description: 'Email address',
        example: 'joao.silva@email.com'
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
        description: 'City',
        example: 'São Paulo'
    })
    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @ApiProperty({
        description: 'State',
        example: 'SP'
    })
    @IsNotEmpty({ message: 'State is required' })
    @IsString({ message: 'State must be a string' })
    state: string;

    @ApiProperty({
        description: 'UUID of the product or dog the customer is interested in',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false
    })
    @IsUUID(4, { message: 'Product UUID must be a valid UUID' })
    interestUuid?: string;

    @ApiProperty({
        description: 'Indicates if the interest is a dog',
        example: true,
        default: true
    })
    @IsNotEmpty({ message: 'Interest type is required' })
    @IsBoolean({ message: 'Interest type must be a boolean' })
    isDog: boolean;
}
