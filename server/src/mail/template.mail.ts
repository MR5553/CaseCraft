import { userType } from "../types/user.types";
import { transporter } from "./mail";

export const EmailVerification = async (user: userType) => {
    const info = await transporter.sendMail({
        from: "CaseCraft <no-reply@casecraft.example>",
        to: user.email,
        subject: "Verify your CaseCraft account",
        html: `
        <!doctype html>
    <html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>CaseCraft Email Verification</title>
</head>
<body
    style="margin:0;padding:0;background:#f4f6f8;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,sans-serif;color:#111;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;background:#f4f6f8;">
        <tr>
            <td align="center" style="padding:28px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600"
                    style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;box-shadow:0 6px 18px rgba(15,15,15,0.06);overflow:hidden;">

                    <tr>
                        <td style="padding:20px 28px 8px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="font-weight:700;font-size:20px;color:#0f172a;">CaseCraft</div>
                                <div style="margin-left:auto;font-size:12px;color:#94a3b8;">Verify your email</div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:18px 28px 8px;">
                            <h1 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#0f172a;">Verify your email
                                address</h1>
                            <p style="margin:0 0 18px;font-size:14px;line-height:1.5;color:#374151;">
                                Use the code below to verify your CaseCraft account. Enter this 6-digit code in the app
                                or on the website.
                            </p>

                            <div style="margin:18px 0;display:flex;justify-content:center;">
                                <div aria-hidden="true"
                                    style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,monospace;font-size:26px;letter-spacing:6px;background:#f8fafc;padding:14px 22px;border-radius:10px;border:1px solid #e6eef6;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.02);">
                                    ${user.verificationCode}
                                </div>
                            </div>

                            <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
                                This code will expire in 60 minutes. If you didn't request this, you can
                                safely ignore this email.
                            </p>

                            <div style="margin-top:16px;">
                                <a href="${process.env.CLIENT_ORIGIN}/verifyemail/${user.id}"
                                    style="display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;background:#0f172a;color:#fff;">
                                    Verify email
                                </a>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:18px 28px 22px;border-top:1px solid #f1f5f9;background:#fff;">
                            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.4;">
                                Need help? Contact our support at <a href="mailto:support@casecraft.example"
                                    style="color:#0f172a;text-decoration:none;">support@casecraft.example</a>.
                            </p>
                            <p style="margin:8px 0 0;font-size:12px;color:#cbd5e1;">© CaseCraft — Keeping your projects
                                tidy since always.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    });
    return info;
}

export const ForgetPassword = async (user: userType) => {
    const info = await transporter.sendMail({
        from: "CaseCraft <no-reply@casecraft.example>",
        to: user.email,
        subject: "Reset your CaseCraft password",
        html: `
        <!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Reset your CaseCraft password</title>
</head>
<body
    style="margin:0;padding:0;background:#f4f6f8;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,sans-serif;color:#111;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;background:#f4f6f8;">
        <tr>
            <td align="center" style="padding:28px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600"
                    style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;box-shadow:0 6px 18px rgba(15,15,15,0.06);overflow:hidden;">
                    <tr>
                        <td style="padding:20px 28px 8px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="font-weight:700;font-size:20px;color:#0f172a;">CaseCraft</div>
                                <div style="margin-left:auto;font-size:12px;color:#94a3b8;">Password reset</div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:18px 28px 8px;">
                            <h1 style="margin:0 0 8px;font-size:18px;font-weight:600;color:#0f172a;">Reset your password
                            </h1>
                            <p style="margin:0 0 18px;font-size:14px;line-height:1.5;color:#374151;">
                                We received a request to reset your CaseCraft account password. Click the button below
                                to create a new password.
                            </p>

                            <div style="margin:20px 0;">
                                <a href="${process.env.CLIENT_ORIGIN}/verify-otp/${user.id}"
                                    style="display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;background:#0f172a;color:#fff;">
                                    Reset Password
                                </a>
                            </div>

                            <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">
                                This link will expire in 60 minutes. If you did not request a password
                                reset, you can safely ignore this email.
                            </p>

                            <div style="margin-top:16px;font-size:13px;color:#94a3b8;">
                                If the button above doesn't work, copy and paste this link into your browser:<br />
                                <a href="${process.env.CLIENT_ORIGIN}/verify-otp/${user.id}" style="color:#0f172a;text-decoration:none;">${process.env.CLIENT_ORIGIN}/verify-otp/${user.id}</a>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:18px 28px 22px;border-top:1px solid #f1f5f9;background:#fff;">
                            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.4;">
                                Need help? Contact our support at <a href="mailto:support@casecraft.example"
                                    style="color:#0f172a;text-decoration:none;">support@casecraft.example</a>.
                            </p>
                            <p style="margin:8px 0 0;font-size:12px;color:#cbd5e1;">© CaseCraft — Keeping your projects
                                tidy since always.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `
    });

    return info;
}