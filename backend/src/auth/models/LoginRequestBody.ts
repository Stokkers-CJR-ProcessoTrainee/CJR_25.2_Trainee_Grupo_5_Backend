import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  @IsEmail({}, { message: 'Insira um endereço de e‑mail válido.' })
  email: string;

  @IsString()
  password: string;
}