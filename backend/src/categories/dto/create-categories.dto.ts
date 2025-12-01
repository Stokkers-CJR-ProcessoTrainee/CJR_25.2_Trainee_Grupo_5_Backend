//id                 Int          @id @default(autoincrement())
//  name               String
//  parent_category_id Int?
//  parent_category    Categories?  @relation("CategoryHierarchy", fields: [parent_category_id], references: [id], onDelete: Cascade)
//  products           Products[]
//  child_categories   Categories[] @relation("CategoryHierarchy")
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoriesDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    parent_category_id?: number;
}