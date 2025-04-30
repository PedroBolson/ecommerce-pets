import { IsNotEmpty, IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsUUID, IsDateString, Min, Max, IsIn } from 'class-validator';

export class CreateDogDto {
    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsNotEmpty()
    @IsUUID()
    breedId: string;

    @IsNotEmpty()
    @IsEnum(['Male', 'Female'])
    gender: 'Male' | 'Female';

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(240) // Maximum 20 years in months
    ageInMonths: number;

    @IsNotEmpty()
    @IsString()
    @IsIn(['Small', 'Medium', 'Large'])
    size: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsBoolean()
    vaccinated?: boolean;

    @IsOptional()
    @IsBoolean()
    dewormed?: boolean;

    @IsOptional()
    @IsString()
    certification?: string;

    @IsOptional()
    @IsBoolean()
    microchip?: boolean;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsDateString()
    publishedDate?: string;

    @IsOptional()
    @IsString()
    additionalInfo?: string;
}
