// utils/validators.js
const CODE_RE = /^[A-Za-z0-9]{6,8}$/;

function isValidCode(code) {
  return CODE_RE.test(code);
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function generateRandomCode(len = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < len; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

module.exports = {
  isValidCode,
  isValidUrl,
  generateRandomCode
};
