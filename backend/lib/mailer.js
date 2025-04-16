// import nodemailer from "nodemailer";

// const createTransport = async () => {
//   if (process.env.NODE_ENV === "development") {
//     // Create a test account in development mode
//     const testAccount = await nodemailer.createTestAccount();
//     return nodemailer.createTransport({
//       host: "smtp.ethereal.email",
//       port: 587,
//       secure: false,
//       auth: {
//         user: testAccount.user,
//         pass: testAccount.pass
//       }
//     });
//   } else {
//     return nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//   }
// };

// const sendWelcomeEmail = async (email) => {
//   try {
//     const mailTransport = await createTransport();
    
 
    
//     const mailOptions = {
//       from: process.env.EMAIL_SENDER || 'noreply@yourapp.com',
//       to: email,
//       subject: "Welcome to Portfolio",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
//           <h2 style="color: #333;">Email Verification</h2>
//           <p>Thank you for registering! Please verify your email address to complete your registration.</p>
//           <div style="margin: 30px 0;">
//             <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
//           </div>
//           <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
//           <p style="word-break: break-all;">${verificationUrl}</p>
//           <p>This link will expire in 15 minutes.</p>
//           <p>If you didn't create an account, you can safely ignore this email.</p>
//         </div>
//       `
//     };

//     const info = await mailTransport.sendMail(mailOptions);
    
//     console.log("Verification email sent: %s", info.messageId);
    
//     // If using Ethereal for testing, log the preview URL
//     if (process.env.NODE_ENV === "development") {
//       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     }
    
//     return info;
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//     throw new Error("Failed to send verification email");
//   }
// };

// export default sendWelcomeEmail;