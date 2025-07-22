import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiRespone } from "@/types/ApiRespone";

export async function sendVerificationEmail (
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiRespone>{
    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Anonymous message | Verification code',
        react: VerificationEmail({username,otp:verifyCode}),
        });

        return {success:true, message:"Verification email send successfully"}
        
    } catch (error) {
        console.error("Error sending verification email",error)
        return {success:false, message:"failed to send verification email"}
    }
}