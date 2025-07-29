// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/verificationEmail";
// import { ApiRespone } from "@/types/ApiRespone";

// export async function sendVerificationEmail (
//     email:string,
//     username:string,
//     verifyCode:string
// ):Promise<ApiRespone>{
//     try {
//         await resend.emails.send({
//         from: 'onboarding@resend.dev',
//         to: email,
//         subject: 'Anonymous message | Verification code',
//         react: VerificationEmail({username,otp:verifyCode}),
//         });

//         return {success:true, message:"Verification email send successfully"}
        
//     } catch (error) {
//         console.error("Error sending verification email",error)
//         return {success:false, message:"failed to send verification email"}
//     }
// }

// src/helpers/sendVerificationEmail.ts
export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
) => {
  try {
    const serviceId = process.env.EMAILJS_SERVICE_ID!;
    const templateId = process.env.EMAILJS_TEMPLATE_ID!;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY!;

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "origin": "http://localhost", // Required by EmailJS, or use your deployed domain
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: privateKey,
        template_params: {
          to_email: email,
          username: username,
          otp: otp,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("EmailJS error response:", errorText);
      return { success: false, message: "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, message: "Error sending email" };
  }
};
