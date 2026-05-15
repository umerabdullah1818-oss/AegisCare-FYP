const nodemailer = require('nodemailer');

// @desc    Send contact form message via email
// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 100 characters'
      });
    }

    // Validate message length
    if (message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 2000 characters'
      });
    }

    // Validate subject
    const validSubjects = ['General Inquiry', 'Technical Support', 'Billing Question', 'Partnership', 'Feedback', 'Other'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid subject'
      });
    }

    // Check email service configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email service not configured: EMAIL_USER and EMAIL_PASS are required in .env');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please try again later.'
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter
    await transporter.verify();

    // Email to admin (the support email)
    const adminMailOptions = {
      from: `"AegisCare Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `[AegisCare Contact] ${subject} - from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">AegisCare</h1>
            <p style="color: #6B7280;">New Contact Form Submission</p>
          </div>
          
          <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h2 style="color: #1F2937; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-weight: 600; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #1F2937;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0; color: #1F2937;"><a href="mailto:${email}" style="color: #3B82F6;">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Phone:</td>
                <td style="padding: 8px 0; color: #1F2937;">${phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #6B7280; font-weight: 600;">Subject:</td>
                <td style="padding: 8px 0; color: #1F2937;">${subject}</td>
              </tr>
            </table>
          </div>

          <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h2 style="color: #1F2937; margin-top: 0;">Message</h2>
            <p style="color: #4B5563; white-space: pre-line; line-height: 1.6;">${message}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            This email was sent from the AegisCare Contact Form. Reply directly to respond to ${name}.
          </p>
        </div>
      `
    };

    // Confirmation email to the user
    const userMailOptions = {
      from: `"AegisCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'AegisCare - We received your message!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">AegisCare</h1>
          </div>
          
          <h2 style="color: #1F2937;">Thank you for contacting us, ${name}!</h2>
          <p style="color: #4B5563;">We have received your message and our team will get back to you within 2 hours during business hours.</p>
          
          <div style="background: #F9FAFB; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="color: #6B7280; margin: 0 0 8px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #6B7280; margin: 0;"><strong>Your message:</strong></p>
            <p style="color: #4B5563; white-space: pre-line; margin-top: 8px;">${message}</p>
          </div>
          
          <p style="color: #4B5563;">If you have any urgent concerns, feel free to reach us at:</p>
          <ul style="color: #4B5563;">
            <li>Phone: +92 324 4519323</li>
            <li>Email: ${process.env.EMAIL_USER}</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">AegisCare - Elderly Care Platform</p>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! Check your email for a confirmation.'
    });
  } catch (error) {
    console.error('Contact form error:', error);

    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        message: 'Email service authentication failed. Please try again later.'
      });
    }
    if (error.code === 'ESOCKET' || error.code === 'ECONNECTION') {
      return res.status(500).json({
        success: false,
        message: 'Could not connect to email server. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};
