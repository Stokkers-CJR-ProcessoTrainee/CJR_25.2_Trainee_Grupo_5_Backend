import nodemailer from 'nodemailer';

if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.error("ERRO CRÍTICO: Variáveis de ambiente de e-mail não configuradas!");
}

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,             
  secure: false,        
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  }
});

export async function sendVerifyCode(to: string, code: string) {
  const mailOps = {
    from: `"Suporte" <${process.env.MAIL_USER}>`, 
    to,
    subject: "Seu código de verificação",
    html: `
      <h1>Código de verificação</h1>
      <p>Use esse código para verificar sua conta, e poder resetar a senha:</p>
      <h2 style="color:#4CAF50">${code}</h2>
      <p>O código expira em 10 minutos.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOps);
    console.log("Email enviado com sucesso para:", to);
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL (Nodemailer):");
    console.error(error);
    throw new Error('Falha ao enviar e-mail. Tente novamente mais tarde.');
  }
}