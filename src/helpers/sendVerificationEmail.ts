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

    // More reliable way to determine the origin
    const origin = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'production'
      ? 'https://anonymous-message-4z0472k46-harshh-debug-d7be468c.vercel.app'
      : 'http://localhost:3000';

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "origin": origin,
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

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, message: "Error sending email" };
  }
};