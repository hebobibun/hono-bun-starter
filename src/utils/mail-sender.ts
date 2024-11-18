// send email using resend
import { Resend } from "resend";
import { config } from "dotenv";
import { logger } from "../application/logger";

config({ path: '.env' })

export const sendMail = async (to: string, subject: string, body: string) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.EMAIL_SENDER;
        const response = await resend.emails.send({
            from: from || "no-reply@hebobibun.com",
            to: to,
            subject: subject,
            html: body,
        });

        if (response.error) {
            logger.error(`Failed to send email to ${to}: ${response.error}`);
            return false;
        }

        return true;
    } catch (error) {
        logger.error(`Failed to send email to ${to}: ${error}`);
        return false;
    }
}