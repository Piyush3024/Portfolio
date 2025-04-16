// import SibApiV3Sdk from '@getbrevo/brevo';
// import nodemailer from 'nodemailer';

// // Configure Brevo for production
// const configureBrevo = () => {
//     const defaultClient = SibApiV3Sdk.ApiClient.instance;
//     const apiKey = defaultClient.authentications['api-key'];
//     apiKey.apiKey = process.env.BREVO_API_KEY;
//     return new SibApiV3Sdk.TransactionalEmailsApi();
// };

// // Configure Nodemailer for development
// const developmentTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// export const sendEmail = async ({ to, subject, htmlContent }) => {
//     try {
//         if (process.env.NODE_ENV === 'production') {
//             // Production: Use Brevo
//             const emailApi = configureBrevo();
//             const sender = {
//                 email: process.env.SENDER_EMAIL,
//                 name: process.env.SENDER_NAME || 'JhuniLMS'
//             };
//             const receivers = [{ email: to }];

//             const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//             sendSmtpEmail.sender = sender;
//             sendSmtpEmail.to = receivers;
//             sendSmtpEmail.subject = subject;
//             sendSmtpEmail.htmlContent = htmlContent;

//             const response = await emailApi.sendTransacEmail(sendSmtpEmail);
//             console.log('Email sent successfully (Production):', response);
//             return { success: true, messageId: response.messageId };
//         } else {
//             // Development: Use Nodemailer
//             const mailOptions = {
//                 from: process.env.EMAIL_USER,
//                 to,
//                 subject,
//                 html: htmlContent
//             };

//             const info = await developmentTransporter.sendMail(mailOptions);
//             console.log('Email sent successfully (Development):', info);
//             return { success: true, messageId: info.messageId };
//         }
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// };

// // Email templates
// export const emailTemplates = {
//     welcomeEmail: (userName) => ({
//         subject: 'Welcome to JhuniLMS',
//         htmlContent: `
//             <h1>Welcome to My Portfolio Website!</h1>
//             <p>Dear ${userName},</p>
//             <p>Welcome to JhuniLMS - your learning management system. We're excited to have you on board!</p>
//             <p>You can now access all your courses and learning materials through our platform.</p>
//             <p>If you have any questions, feel free to reach out to our support team.</p>
//             <p>Best regards,<br>JhuniLMS Team</p>
//         `
//     }),


   
// }; 