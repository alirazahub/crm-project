// utils/emailService.js (Backend)
import nodemailer from 'nodemailer';

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    // Option 1: Gmail (most common for testing)
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your-email@gmail.com
      pass: process.env.EMAIL_APP_PASSWORD, // 16-digit app password
    },
  });
};

// Send feedback reply email
export const sendFeedbackReply = async (customerEmail, customerName, adminResponse, originalMessage) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Customer Support',
        address: process.env.EMAIL_USER
      },
      to: customerEmail,
      subject: 'Response to Your Feedback',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
            .response-box { background: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 15px 0; }
            .original-message { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank you for your feedback!</h2>
            </div>
            
            <div class="content">
              <p>Hi ${customerName},</p>
              
              <p>Thank you for reaching out to us. We've reviewed your message and here's our response:</p>
              
              <div class="response-box">
                <h4>Our Response:</h4>
                <p>${adminResponse.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div class="original-message">
                <h4>Your Original Message:</h4>
                <p><em>${originalMessage.replace(/\n/g, '<br>')}</em></p>
              </div>
              
              <p>If you have any further questions or concerns, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br>Customer Support Team</p>
            </div>
            
            <div class="footer">
              <p>This email was sent in response to your feedback submission.</p>
              <p>Please do not reply directly to this email. Contact us through our website for further assistance.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Text version for email clients that don't support HTML
      text: `
        Hi ${customerName},

        Thank you for reaching out to us. Here's our response to your feedback:

        ${adminResponse}

        Your original message: "${originalMessage}"

        If you have any further questions, please contact us through our website.

        Best regards,
        Customer Support Team
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Optional: Send welcome email when feedback is first submitted
export const sendFeedbackConfirmation = async (customerEmail, customerName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Customer Support',
        address: process.env.EMAIL_USER
      },
      to: customerEmail,
      subject: 'We received your feedback - Thank you!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10B981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
            .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank you for your feedback!</h2>
            </div>
            
            <div class="content">
              <p>Hi ${customerName},</p>
              
              <p>We have received your feedback and appreciate you taking the time to contact us.</p>
              
              <p>Our team will review your message and get back to you soon. We typically respond within 24-48 hours.</p>
              
              <p>Best regards,<br>Customer Support Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${customerName},

        We have received your feedback and appreciate you taking the time to contact us.

        Our team will review your message and get back to you soon. We typically respond within 24-48 hours.

        Best regards,
        Customer Support Team
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', customerEmail);
    
  } catch (error) {
    console.error('Confirmation email failed:', error);
    // Don't throw error here - confirmation emails are optional
  }
};