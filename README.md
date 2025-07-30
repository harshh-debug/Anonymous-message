
# 🕵️‍♂️ UnseenNote

UnseenNote is a full-stack web app that lets users receive anonymous messages and feedback through their own shareable links. Built with **Next.js**, **MongoDB**, and integrated with **Gemini AI** to suggest thoughtful messages.

## 🚀 Features

- 🌐 Create your unique anonymous message link  
- ✨ Gemini AI suggestions for senders  
- 🔐 Email OTP verification on signup  
- 🧾 Clean dashboard to view and delete received messages  
- 📱 Responsive and minimal UI (built with `shadcn/ui`)  
- 📊 Web analytics using Vercel Analytics  

## 🔗 Try it Live

**Website:** [https://unseennote-blond.vercel.app](https://unseennote-blond.vercel.app)  
**My Link (Try sending a message):** [https://unseennote-blond.vercel.app/u/harshjoshi09](https://unseennote-blond.vercel.app/u/harshjoshi09)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TypeScript  
- **Backend:** NextAuth.js, MongoDB, Mongoose  
- **UI Components:** shadcn/ui  
- **Email Service:** EmailS (for OTP verification)  
- **AI Integration:** Gemini API (for suggesting messages)  
- **Analytics:** Vercel Analytics  

## 🧑‍💻 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshh-debug/Anonymous-message.git
   cd Anonymous-message
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env.local` file**
   Add the following environment variables:
   ```env
    MONGODB_URL=""             # Your MongoDB connection string
    NEXTAUTH_SECRET=""         # Used by NextAuth.js
    GEMINI_API_KEY=""          # Gemini AI API Key for suggestions
    
    EMAILJS_SERVICE_ID=""      # EmailJS Service ID
    EMAILJS_TEMPLATE_ID=""     # EmailJS Template ID
    EMAILJS_PRIVATE_KEY=""     # EmailJS Private Key
   
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

## 🤖 AI Message Suggestions

The app uses **Gemini API** to suggest sample anonymous messages. When someone visits your link and doesn’t know what to write, they can get help from AI-generated prompts.

## 📬 Email Verification

Every user must verify their email with an OTP sent via **EmailJS** during signup. This helps in avoiding spam and ensures real users.

## 📊 Analytics

**Vercel Analytics** is used to track visitor activity and page views to understand user behavior better.

## 🙌 Feedback or Suggestions?

Feel free to use my link and drop any anonymous feedback:  
🔗 [https://unseennote-blond.vercel.app/u/harshjoshi09](https://unseennote-blond.vercel.app/u/harshjoshi09)


---

### ⭐ Star this repo if you found it interesting → [GitHub Repo](https://github.com/harshh-debug/Anonymous-message)
