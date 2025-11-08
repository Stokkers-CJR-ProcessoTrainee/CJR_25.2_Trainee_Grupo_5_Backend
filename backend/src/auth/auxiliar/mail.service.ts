import nodemailer from 'nodemailer';

export const trasnporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

export async function sendVerifyCode(to:string, code:string) {
  const mailOps = {
    from: process.env.MAIL_USER,
    to,
    subject: "Seu código de verificação",
    html: `
      <h1>Código de verificação</h1>
      <p>Use esse código para verificar sua conta, e poder resetar a senha:</p>
      <h2 style="color:#4CAF50">${code}</h2>
      <p>O código expira em 10 minutos.</p>
    `,
  };

  await trasnporter.sendMail(mailOps);

}