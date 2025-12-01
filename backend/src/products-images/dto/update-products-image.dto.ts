import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsImageDto } from './create-products-image.dto';

export class UpdateProductsImageDto extends PartialType(CreateProductsImageDto) {}
