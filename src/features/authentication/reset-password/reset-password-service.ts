import {
    getUserByEmail,
    setPasswordByUserId,
} from '../../../models/user-models.js';
import nodemailer from 'nodemailer';
import MAILER from '../nodemailer-constants.js';
import { hashPassword } from '../../../utils/password/password-utils.js';

export function generateRandomPassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*';

    let password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        special[Math.floor(Math.random() * special.length)],
    ];

    const allChars = lowercase + uppercase + numbers + special;
    for (let i = password.length; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
}

export async function resetPasswordService(email: string): Promise<void> {
    const user = await getUserByEmail(email);
    if (!user) {
        return;
    }

    const temporaryPassword = generateRandomPassword(16);

    const transporter = nodemailer.createTransport({
        host: MAILER.email_host,
        port: MAILER.email_port,
        secure: false,
        auth: {
            user: MAILER.email_user,
            pass: MAILER.email_password,
        },
    });

    const mailOptions = {
        from: MAILER.email_from,
        to: email,
        subject: 'Password Reset - Temporary Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You have requested a password reset for your account. Your temporary password is:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <strong style="font-size: 18px; color: #007bff;">${temporaryPassword}</strong>
                </div>
                <p><strong>Important:</strong> Please change this temporary password immediately after logging in for security reasons.</p>
                <p>If you did not request this password reset, please ignore this email and contact support.</p>
                <p>Best regards,<br>Your Support Team</p>
            </div>
        `,
    };

    await transporter.verify();
    console.log('SMTP connection verified');

    const hashedPassword = await hashPassword(temporaryPassword);

    await setPasswordByUserId(user.id, hashedPassword);

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
}
