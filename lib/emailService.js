import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmailNotification(block) {
  try {
    const msg = {
      to: block.userEmail,
      from: process.env.SENDGRID_FROM_EMAIL, 
      subject: `🔕 Your quiet study time "${block.title}" starts in 10 minutes`,
      html: generateEmailHTML(block),
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", block.userEmail);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}

function generateEmailHTML(block) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🔕 Quiet Hours Reminder</h1>
      </div>
      
      <div style="padding: 30px; background: #f8fafc; border-radius: 10px; margin: 20px 0;">
        <h2 style="color: #2d3748; margin-top: 0;">Hi ${block.userName}!</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Your quiet study session "<strong>${block.title}</strong>" is starting in just 10 minutes.
        </p>
        
        ${block.description ? `
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #2d3748;"><strong>Session notes:</strong></p>
            <p style="margin: 5px 0 0 0; color: #4a5568;">${block.description}</p>
          </div>
        ` : ''}
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0; color: #2d3748;"><strong>⏰ Time:</strong> ${new Date(block.startTime).toLocaleString()} - ${new Date(block.endTime).toLocaleString()}</p>
        </div>
        
        <p style="color: #4a5568; font-size: 14px; margin-top: 20px;">
          💡 <strong>Tips for your quiet session:</strong><br>
          • Put your devices in silent mode<br>
          • Find a comfortable, distraction-free space<br>
          • Have your study materials ready<br>
          • Take deep breaths and focus on your goals
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
        <p>Happy studying! 📚</p>
        <p>Quiet Hours Scheduler</p>
      </div>
    </div>
  `;
}
