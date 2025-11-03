import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePassDto {
  @IsNotEmpty()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
