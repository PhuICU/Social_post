import nodemailer from "nodemailer";
import env_config from "~/configs/env.config";
import { ROLE_TYPE } from "~/enum/utiils.enum";
import { USER_SCHEMA } from "~/models/schemas/User.schema";
import { capitalize } from "lodash";
import e from "express";

export const sendEmailResetPassword = async ({
  email,
  otp,
  subject,
  role,
}: {
  email: string;
  otp: number;
  subject: string;
  role: ROLE_TYPE;
}) => {
  try {
    const htmlContent = `
      <p>Xin chào,</p>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Mã OTP của bạn là: <strong>${otp}</strong></p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng.</p>
  `;
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS,
      },
    });
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: email,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailVerification = async (
  email: string,
  token: string,
  subject: string,
  role: ROLE_TYPE
) => {
  try {
    console.log(env_config.CLIENT_PORTS);
    const verificationLink = `${env_config.CLIENT_PORTS}/verify-email?token=${token}&role=${role}`;
    const htmlContent = `
         <p>Xin chào,</p>
<p>Cảm ơn bạn đã đăng ký tài khoản! Vui lòng sử dụng liên kết xác minh sau để kích hoạt tài khoản của bạn:</p>

<a href="${verificationLink}"
   style="display: inline-block;
          background-color: #edf2f7; /* Tương đương với bg-gray-200 trong Tailwind */
          color: #2d3748; /* Tương đương với text-white trong Tailwind */
          font-weight: bold;
          padding: 0.5rem 1rem; /* Tương đương với py-2 px-4 trong Tailwind */
          border-radius: 50px; /* Tương đương với rounded-full trong Tailwind */
          text-decoration: none;
          transition: background-color 0.3s ease; /* Tương đương với hover:bg-gray-300 trong Tailwind */
          "
   onmouseover="this.style.backgroundColor='#cbd5e0'"
   onmouseout="this.style.backgroundColor='#edf2f7'"
>
    Xác nhận
</a>

<p>Nhấp vào liên kết ở trên hoặc sao chép và dán nó vào thanh địa chỉ trình duyệt để hoàn tất quá trình xác minh và kích hoạt tài khoản của bạn.</p>

<p>Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>


        `;
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS,
      },
    });
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: email,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    console.log(error);
  }
};
// export const sendEmailResetPassword = async ({
//   email,
//   token,
//   subject,
//   account_type,
//   role
// }: {
//   email: string
//   token: string
//   subject: string
//   account_type: ACCOUNT_TYPE
//   role: ROLE_TYPE
// }) => {
//   try {
//     const resetPasswordLink = `${env_config.CLIENT_PORTS}/reset-password/${token}?account_type=${account_type}&role=${role}`
//     const htmlContent = `
//     <p>Xin chào,</p>
//     <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng liên kết sau để đặt lại mật khẩu của bạn:</p>

//     <a href="${resetPasswordLink}"
//        style="display: inline-block;
//               background-color: #edf2f7; /* Tương đương với bg-gray-200 trong Tailwind */
//               color: #2d3748; /* Tương đương với text-gray-800 trong Tailwind */
//               font-weight: bold;
//               padding: 0.5rem 1rem; /* Tương đương với py-2 px-4 trong Tailwind */
//               border-radius: 50px; /* Tương đương với rounded-full trong Tailwind */
//               text-decoration: none;
//               transition: background-color 0.3s ease; /* Tương đương với hover:bg-gray-300 trong Tailwind */
//               "
//        onmouseover="this.style.backgroundColor='#cbd5e0'"
//        onmouseout="this.style.backgroundColor='#edf2f7'"
//     >
//         Đặt lại mật khẩu
//     </a>

//     <p>Nhấp vào liên kết ở trên hoặc sao chép và dán nó vào thanh địa chỉ trình duyệt để hoàn tất quá trình đặt lại mật khẩu của bạn.</p>

//     <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>

//     <p>Trân trọng.</p>
// `
//     const transporter = nodemailer.createTransport({
//       host: env_config.EMAIL_HOST,
//       service: env_config.EMAIL_SERVICE,
//       port: Number(env_config.EMAIL_PORT),
//       secure: Boolean(env_config.EMAIL_SERCURE),
//       auth: {
//         user: env_config.EMAIL_AUTH_USER,
//         pass: env_config.EMAIL_AUTH_PASS
//       }
//     })
//     return await transporter.sendMail({
//       from: env_config.EMAIL_AUTH_USER,
//       to: email,
//       subject: subject,
//       html: htmlContent
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }
