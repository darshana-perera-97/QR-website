const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Generate QR code endpoint
app.post('/api/qr/generate', async (req, res) => {
  try {
    const { text, width = 256, colorDark = '#000000', colorLight = '#ffffff' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Generate QR code as data URL
    const qrDataURL = await QRCode.toDataURL(text, {
      width: width,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      errorCorrectionLevel: 'H'
    });

    res.json({ 
      success: true, 
      qrCode: qrDataURL,
      text: text 
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Generate QR code as PNG file
app.post('/api/qr/download', async (req, res) => {
  try {
    const { text, filename = 'qr-code.png', width = 256 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Generate QR code buffer
    const qrBuffer = await QRCode.toBuffer(text, {
      width: width,
      errorCorrectionLevel: 'H'
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(qrBuffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

