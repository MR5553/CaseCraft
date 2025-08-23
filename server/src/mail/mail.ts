import { createTransport } from "nodemailer";


export const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
    debug: true,
    tls: { rejectUnauthorized: false }
});

transporter.verify((err) => {
    if (err) {
        throw err;
    }
    console.log("Server is ready to exchange mails")
});