const QRCode = require('qrcode');

// The URL of your Expo app
const url = 'exp://192.168.100.161:8084';

// Generate QR code in terminal
QRCode.toString(url, { type: 'terminal' }, function (err, qrcode) {
  if (err) return console.error('Error generating QR code:', err);
  console.log('Scan this QR code with Expo Go:');
  console.log(qrcode);
  console.log('URL:', url);
});
