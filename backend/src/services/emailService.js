import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter based on .env config.
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  // If host is gmail or service is configured
  if (process.env.SMTP_SERVICE === 'gmail' || host.includes('gmail')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

/**
 * Send an email notification for a new Contact Us submission.
 * @param {Object} contactData - { name, email, topic, message, createdAt }
 * @returns {Promise<{ success: boolean, info?: any, error?: string }>}
 */
export const sendContactEmail = async ({ name, email, topic, message, createdAt }) => {
  try {
    const transporter = getTransporter();

    const receiverEmail =
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.SMTP_USER ||
      'support@sreecollections.com';

    if (!transporter) {
      console.warn(
        '[Email Service] SMTP is not configured. Please set SMTP_USER and SMTP_PASS in backend/.env to deliver emails to your inbox.'
      );
      return {
        success: false,
        error: 'SMTP credentials not configured in backend/.env',
      };
    }

    const formattedDate = new Date(createdAt || Date.now()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #FAF6EE; margin: 0; padding: 24px; color: #333333; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1.5px solid #BB8E43; box-shadow: 0 4px 20px rgba(93,32,48,0.1); }
    .header { background: #5D2030; padding: 24px 30px; text-align: center; }
    .header h1 { margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; letter-spacing: 1px; }
    .header p { margin: 6px 0 0; color: #E5C384; font-size: 13px; font-weight: 500; }
    .content { padding: 30px; }
    .badge { display: inline-block; background-color: #FAF6EE; color: #5D2030; border: 1px solid #BB8E43; font-weight: 700; font-size: 12px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #F0E8DC; }
    .info-label { width: 130px; font-weight: 600; color: #5D2030; }
    .info-value { color: #222222; }
    .message-box { background: #FAF6EE; border-left: 4px solid #BB8E43; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 28px; }
    .message-box p { margin: 0; font-size: 15px; line-height: 1.6; color: #4A3B32; white-space: pre-line; }
    .btn-container { text-align: center; margin-bottom: 10px; }
    .reply-btn { display: inline-block; background-color: #BB8E43; color: #FFFFFF !important; text-decoration: none; padding: 12px 30px; border-radius: 999px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }
    .footer { background: #F8F4ED; padding: 16px; text-align: center; font-size: 12px; color: #8A7A6E; border-top: 1px solid #ECE2D4; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sree Collections</h1>
      <p>NEW CONTACT INQUIRY</p>
    </div>
    <div class="content">
      <span class="badge">Inquiry Notification</span>
      <p style="font-size: 15px; color: #5D2030; margin-top: 0;">You have received a new message through the website contact form:</p>
      
      <table class="info-table">
        <tr>
          <td class="info-label">Customer Name</td>
          <td class="info-value"><strong>${name}</strong></td>
        </tr>
        <tr>
          <td class="info-label">Email Address</td>
          <td class="info-value"><a href="mailto:${email}" style="color: #5D2030; text-decoration: none;"><strong>${email}</strong></a></td>
        </tr>
        <tr>
          <td class="info-label">Topic</td>
          <td class="info-value"><strong>${topic}</strong></td>
        </tr>
        <tr>
          <td class="info-label">Submitted At</td>
          <td class="info-value">${formattedDate}</td>
        </tr>
      </table>

      <h4 style="color: #5D2030; margin: 0 0 10px 0; font-size: 15px;">Customer Message:</h4>
      <div class="message-box">
        <p>${message}</p>
      </div>

      <div class="btn-container">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(topic)} - Sree Collections" class="reply-btn">Reply to ${name}</a>
      </div>
    </div>
    <div class="footer">
      This is an automated notification from Sree Collections Web Application.
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: `"Sree Collections Website" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@sreecollections.com'}>`,
      to: receiverEmail,
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact Inquiry] ${topic} - From ${name}`,
      text: `New Contact Inquiry from ${name} (${email})\nTopic: ${topic}\nDate: ${formattedDate}\n\nMessage:\n${message}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Contact email delivered to ${receiverEmail}: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error('[Email Service] Failed to send contact email:', error.message);
    return { success: false, error: error.message };
  }
};
