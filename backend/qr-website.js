const QRCode = require('easyqrcodejs-nodejs');
const options = {
  text: "https://your-url.com",
  width: 256,
  height: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
  logo: "./logo.png",  // Path to your logo image
  logoWidth: 80,
  logoHeight: 80,
  PO: "#e1622f",  // Custom position outer color
  title: "Custom QR",
  titleFont: "bold 18px Arial"
};
const qrcode = new QRCode(options);
qrcode.saveImage({ path: 'custom-qr.png' }).then(() => console.log('QR saved!'));
