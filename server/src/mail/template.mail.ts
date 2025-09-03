import { userType } from "../types/user.types";
import { transporter } from "./mail";

export const EmailVerification = async (user: userType) => {
    const info = await transporter.sendMail({
        from: "Playsync",
        to: user.email,
        subject: "Verify your account",
        html: `
        <div
        style="font-family: Inter, SF Pro Display, Open Sans, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;background-color: #f5f5f5; max-width: 600px;margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

        <h1 style="color: #333333;">Welcome to TechByte!</h1>

        <p>Hi there!</p>

        <p style="color: #555555;">We're thrilled to have you join us at TechByte!</p>

        <p style="color: #555555;">
            Your verification code is: <strong style="letter-spacing: 2px; color: #000;">
            ${user.verificationCode}</strong>
        </p>

        <p style="color: #555555;">
            Please enter this code to activate your TechByte account and get
            started with the latest tech blogs and insights.

            If you have any questions or need assistance, feel free to reach out to our support team.

            We're excited to have you with us!
        </p>

        <p style="font-size: 14px;color: #888888;margin-top: 30px;">
            Thanks, <br>
            The TechByte Team
        </p>
    </div>
        `,
    });
    return info;
}

export const ResetPassword = async (user: userType) => {
    const info = await transporter.sendMail({
        from: "Playsync",
        to: user.email,
        subject: "Reset password",
        html: `
        <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f7f7f8; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 600; margin: 0;">Reset Your Password</h1>
    </div>
    <div style="background-color: #ffffff; padding: 24px; border-radius: 8px;">
        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 16px;">Hello,</p>
        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 16px;">
            We received a request to reset your password for your Playsync account. Please use the following One-Time Password (OTP) to proceed:
        </p>
        <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; background-color: #e6f0fa; color: #1a73e8; font-size: 24px; font-weight: 700; letter-spacing: 3px; padding: 12px 24px; border-radius: 6px;">
                ${user.verificationCode}
            </span>
        </div>
        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 16px;">
            Enter this code in the password reset form to create a new password. This OTP is valid for the next 10 minutes.
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 16px;">
            If you didn’t request a password reset, please ignore this email or contact our support team immediately.
        </p>
        <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0;">
            Need help? Reach out to us at <a href="mailto:support@playsync.com" style="color: #1a73e8; text-decoration: none;">support@playsync.com</a>.
        </p>
    </div>
    <div style="text-align: center; padding-top: 20px;">
        <p style="color: #666666; font-size: 14px; line-height: 1.4; margin: 0;">
            Thanks,<br>
            The Playsync Team
        </p>
        <p style="color: #999999; font-size: 12px; margin-top: 16px;">
            © 2025 Playsync. All rights reserved.
        </p>
    </div>
</div>
        `
    });

    return info;
}