import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional, Min, Max, IsString } from 'class-validator';

export class CreateProductRatingsDto {

    @IsInt()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;
    
}

export class UpdateProductRatingsDto extends PartialType(CreateProductRatingsDto) {}