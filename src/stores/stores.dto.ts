//model Stores {
  //id            Int            @id @default(autoincrement())
  //user_id       Int
  //owner         Users          @relation(fields: [user_id], references: [id], onDelete: Cascade)
  //name          String
  //description   String?
  //logo_url      String?
  //banner_url    String?
  //sticker_url   String?
  //createdAt     DateTime       @default(now())
  //updatedAt     DateTime       @updatedAt
  //products      Products[]
  //store_ratings StoreRatings[]
//}

import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsString()
  banner_url?: string;

  @IsOptional()
  @IsString()
  sticker_url?: string;
}

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}