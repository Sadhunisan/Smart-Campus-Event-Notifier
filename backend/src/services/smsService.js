const twilio = require('twilio');

const normalizePhoneNumber = (phone) => {
  const value = String(phone || '').trim();
  const digits = value.replace(/\D/g, '');
  const countryCode = String(process.env.SMS_DEFAULT_COUNTRY_CODE || '91').replace(/\D/g, '');

  if (!digits) {
    throw new Error('The account does not have a valid phone number.');
  }

  if (value.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  if (digits.startsWith(countryCode) && digits.length > countryCode.length + 9) return `+${digits}`;
  if (digits.startsWith('0') && digits.length === 11) return `+${countryCode}${digits.slice(1)}`;
  if (digits.length === 10) return `+${countryCode}${digits}`;

  return `+${digits}`;
};

const normalizeSenderNumber = (phone) => {
  const value = String(phone || '').trim();
  if (!value.startsWith('+')) return value;
  return `+${value.slice(1).replace(/\D/g, '')}`;
};

const getSmsConfig = () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromNumber: process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER,
});

const isSmsConfigured = () => {
  const { accountSid, authToken, fromNumber } = getSmsConfig();
  return Boolean(accountSid && authToken && fromNumber);
};

const sendSms = async (phone, message) => {
  const { accountSid, authToken, fromNumber } = getSmsConfig();
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('SMS delivery is not configured. Add the Twilio settings to the backend .env file.');
  }

  const recipient = normalizePhoneNumber(phone);
  if (!/^\+[1-9]\d{7,14}$/.test(recipient)) {
    throw new Error('The recipient phone number is invalid. Enter a valid number or configure SMS_DEFAULT_COUNTRY_CODE for local numbers.');
  }
  const sender = normalizeSenderNumber(fromNumber);
  if (!/^\+[1-9]\d{7,14}$/.test(sender)) {
    throw new Error('The Twilio sender number is invalid. Set TWILIO_PHONE_NUMBER to your Twilio number in international format (for example, +12345678900).');
  }

  try {
    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({ to: recipient, from: sender, body: message });
    return { sid: result.sid, status: result.status };
  } catch (error) {
    console.error('Twilio SMS request failed:', error.code || error.status || 'provider error');
    const safeError = new Error('The SMS provider could not deliver the message. Check the Twilio settings and destination number.');
    safeError.statusCode = 503;
    throw safeError;
  }
};

module.exports = { normalizePhoneNumber, normalizeSenderNumber, isSmsConfigured, sendSms };