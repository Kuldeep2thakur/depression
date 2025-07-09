import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const templateParams = {
      to_email: email,
      otp: otp,
    };

    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 