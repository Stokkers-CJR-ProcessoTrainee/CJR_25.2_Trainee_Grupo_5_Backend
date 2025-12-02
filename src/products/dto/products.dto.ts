import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductsDto {

  @IsNumber()
  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  category_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;
}
