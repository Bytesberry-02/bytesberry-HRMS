const sendEmail = require("../../utils/sendEmail"); 

//to send emails for reminders
exports.sendReminderEmail = async (req, res) => {
    // console.log("sendReminderEmail endpoint hit");
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    await sendEmail(to, subject, html);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email.", error: error.message });
  }
};
