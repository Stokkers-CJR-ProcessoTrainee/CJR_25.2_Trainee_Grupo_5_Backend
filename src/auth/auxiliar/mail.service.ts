import { Resend } from 'resend';

// Inicializa o Resend apenas se a chave existir
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function sendVerifyCode(to: string, code: string) {
  
  if (!resend) {
    console.error("ERRO: Chave do Resend (RESEND_API_KEY) não configurada.");
    throw new Error("Serviço de e-mail não configurado.");
  }

  try {
    const data = await resend.emails.send({
      // O Resend exige que o remetente seja este no modo de teste, 
      // ou um domínio verificado teu.
      from: 'onboarding@resend.dev', 
      to: to, 
      subject: 'Seu código de verificação',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Código de verificação</h1>
          <p>Use esse código para verificar sua conta e resetar a senha:</p>
          <h2 style="color:#4CAF50; font-size: 32px; letter-spacing: 5px;">${code}</h2>
          <p>O código expira em 10 minutos.</p>
          <hr>
          <p style="font-size: 12px; color: gray;">Se não solicitou este código, ignore este e-mail.</p>
        </div>
      `,
    });

    console.log("Email enviado com sucesso via Resend!");
    console.log("ID do Email:", data.data?.id);

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL (Resend):", error);
    throw new Error('Falha ao enviar e-mail via API.');
  }
}