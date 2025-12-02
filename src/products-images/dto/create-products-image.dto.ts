//model ProductImages {
//  id         Int      @id @default(autoincrement())
//  product_id Int
//  product    Products @relation(fields: [product_id], references: [id], onDelete: Cascade)
//  image_url  String
//  order      Int
//}

import { IsInt, IsNotEmpty, IsNumber, IsString, IsUrl, Min } from "class-validator";


export class CreateProductsImageDto {

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    image_url: string;

    @IsNumber()
    @IsInt()
    @Min(0)
    @IsNotEmpty()
    order: number;

}


