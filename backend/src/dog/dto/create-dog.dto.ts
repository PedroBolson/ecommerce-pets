import { IsNotEmpty, IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsUUID, IsDateString, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDogDto {
    @ApiProperty({ description: 'Unique SKU for the dog', example: 'DOG-LAB-001' })
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiProperty({ description: 'ID of the dog breed', example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsNotEmpty()
    @IsUUID()
    breedId: string;

    @ApiProperty({
        description: 'Gender of the dog',
        enum: ['Male', 'Female'],
        example: 'Male'
    })
    @IsNotEmpty()
    @IsEnum(['Male', 'Female'])
    gender: 'Male' | 'Female';

    @ApiProperty({
        description: 'Age of the dog in months',
        minimum: 1,
        maximum: 240,
        example: 12
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(240) // Maximum 20 years in months
    ageInMonths: number;

    @ApiProperty({
        description: 'Size category of the dog',
        enum: ['Small', 'Medium', 'Large'],
        example: 'Medium'
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(['Small', 'Medium', 'Large'])
    size: string;

    @ApiProperty({
        description: 'Color of the dog',
        required: false,
        example: 'Golden'
    })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiProperty({
        description: 'Price in currency units',
        minimum: 0,
        example: 1200.00
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        description: 'Whether the dog is vaccinated',
        required: false,
        default: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    vaccinated?: boolean;

    @ApiProperty({
        description: 'Whether the dog has been dewormed',
        required: false,
        default: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    dewormed?: boolean;

    @ApiProperty({
        description: 'Certification details',
        required: false,
        example: 'AKC Registered'
    })
    @IsOptional()
    @IsString()
    certification?: string;

    @ApiProperty({
        description: 'Whether the dog has a microchip',
        required: false,
        default: false,
        example: false
    })
    @IsOptional()
    @IsBoolean()
    microchip?: boolean;

    @ApiProperty({
        description: 'Current location of the dog',
        required: false,
        example: 'New York, NY'
    })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({
        description: 'Date when the listing was published (YYYY-MM-DD)',
        required: false,
        example: '2023-04-15'
    })
    @IsOptional()
    @IsDateString()
    publishedDate?: string;

    @ApiProperty({
        description: 'Additional information about the dog',
        required: false,
        example: 'Great with kids and other pets'
    })
    @IsOptional()
    @IsString()
    additionalInfo?: string;
}
