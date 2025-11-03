import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  async sendResetCode(email: string, code: string) {
    console.log(`Email enviado para ${email} com o código ${code}`);
  }
}