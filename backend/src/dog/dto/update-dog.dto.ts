import { PartialType } from '@nestjs/swagger';
import { CreateDogDto } from './create-dog.dto';
import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsUUID, IsDateString, Min, Max, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDogDto extends PartialType(CreateDogDto) {
    @ApiProperty({
        description: 'Unique SKU for the dog',
        required: false,
        example: 'DOG-002'
    })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiProperty({
        description: 'ID of the dog breed',
        required: false,
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsOptional()
    @IsUUID()
    breedId?: string;

    @ApiProperty({
        description: 'Gender of the dog',
        required: false,
        enum: ['Male', 'Female'],
        example: 'Female'
    })
    @IsOptional()
    @IsEnum(['Male', 'Female'])
    gender?: 'Male' | 'Female';

    @ApiProperty({
        description: 'Age of the dog in months',
        required: false,
        minimum: 1,
        maximum: 240,
        example: 18
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(240)
    ageInMonths?: number;

    @ApiProperty({
        description: 'Size category of the dog',
        required: false,
        enum: ['Small', 'Medium', 'Large'],
        example: 'Large'
    })
    @IsOptional()
    @IsString()
    @IsIn(['Small', 'Medium', 'Large'])
    size?: string;

    @ApiProperty({
        description: 'Color of the dog',
        required: false,
        example: 'Black and White'
    })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiProperty({
        description: 'Price in currency units',
        required: false,
        minimum: 0,
        example: 1500.00
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiProperty({
        description: 'Whether the dog is vaccinated',
        required: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    vaccinated?: boolean;

    @ApiProperty({
        description: 'Whether the dog has been dewormed',
        required: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    dewormed?: boolean;

    @ApiProperty({
        description: 'Certification details',
        required: false,
        example: 'AKC Registered with papers'
    })
    @IsOptional()
    @IsString()
    certification?: string;

    @ApiProperty({
        description: 'Whether the dog has a microchip',
        required: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    microchip?: boolean;

    @ApiProperty({
        description: 'Current location of the dog',
        required: false,
        example: 'Miami, FL'
    })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({
        description: 'Date when the listing was published (YYYY-MM-DD)',
        required: false,
        example: '2023-05-20'
    })
    @IsOptional()
    @IsDateString()
    publishedDate?: string;

    @ApiProperty({
        description: 'Additional information about the dog',
        required: false,
        example: 'House trained and good with children'
    })
    @IsOptional()
    @IsString()
    additionalInfo?: string;
}
