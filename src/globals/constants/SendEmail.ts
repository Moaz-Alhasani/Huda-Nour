import nodemailer, { TransportOptions } from "nodemailer";

export const SendEmail = async (option: any) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST as string,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_COMPANY,
            pass: process.env.PASSWORD_EMAIL
        }
    } as TransportOptions);

    const emailOptions = {
        from: 'Cineefix support<support@cinefix.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    };

    await transporter.sendMail(emailOptions);
}