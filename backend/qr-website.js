const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Data file path
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const STORE_SETTINGS_FILE = path.join(DATA_DIR, 'store-settings.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      console.log('Created uploads directory:', UPLOADS_DIR);
    }
    console.log('Multer destination:', UPLOADS_DIR);
    console.log('Destination exists:', fs.existsSync(UPLOADS_DIR));
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: icon-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.png'; // Default to .png if no extension
    const filename = 'icon-' + uniqueSuffix + ext;
    console.log('Multer generating filename:', filename, 'from original:', file.originalname);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const extname = allowedTypes.test(ext);
    // More lenient mimetype check - accept if it starts with 'image/' or matches allowed types
    const mimetype = file.mimetype && (
      file.mimetype.startsWith('image/') || 
      allowedTypes.test(file.mimetype)
    );
    
    console.log('File filter check:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      extension: ext,
      extnameMatch: extname,
      mimetypeMatch: mimetype
    });
    
    if (extname && mimetype) {
      console.log('File accepted by filter');
      return cb(null, true);
    } else {
      console.log('File rejected by filter - extname:', extname, 'mimetype:', mimetype);
      cb(new Error(`Only image files are allowed (jpeg, jpg, png, gif, webp, svg). Got: ${file.mimetype || 'unknown'}`));
    }
  }
});

// Helper functions to read/write products
const readProducts = () => {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
};

// Helper functions to read/write admin credentials
const readAdmin = () => {
  try {
    if (fs.existsSync(ADMIN_FILE)) {
      const data = fs.readFileSync(ADMIN_FILE, 'utf8');
      return JSON.parse(data);
    }
    // Default admin credentials if file doesn't exist
    const defaultAdmin = {
      email: "admin@bakerystore.com",
      password: "admin123"
    };
    writeAdmin(defaultAdmin);
    return defaultAdmin;
  } catch (error) {
    console.error('Error reading admin file:', error);
    return null;
  }
};

const writeAdmin = (admin) => {
  try {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing admin file:', error);
    return false;
  }
};

// Helper functions to read/write store settings
const readStoreSettings = () => {
  try {
    if (fs.existsSync(STORE_SETTINGS_FILE)) {
      const data = fs.readFileSync(STORE_SETTINGS_FILE, 'utf8');
      return JSON.parse(data);
    }
    // Default settings if file doesn't exist
    const defaultSettings = {
      storeName: "Bakery Store",
      tagline: "Freshly baked goods delivered daily",
      email: "contact@bakerystore.com",
      phone: "(555) 123-4567",
      address: "123 Bakery Street",
      city: "New York, NY 10001",
      mondayFriday: "6am - 8pm",
      saturday: "7am - 9pm",
      sunday: "7am - 6pm",
      icon: null
    };
    writeStoreSettings(defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error reading store settings file:', error);
    return null;
  }
};

const writeStoreSettings = (settings) => {
  try {
    fs.writeFileSync(STORE_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing store settings file:', error);
    return false;
  }
};

// Helper functions to read/write categories
const readCategories = () => {
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const data = fs.readFileSync(CATEGORIES_FILE, 'utf8');
      return JSON.parse(data);
    }
    // Default categories if file doesn't exist
    const defaultCategories = [
      { id: "breads", title: "Breads", name: "Breads" },
      { id: "pastries", title: "Pastries", name: "Pastries" },
      { id: "buns", title: "Buns", name: "Buns" },
      { id: "bagels", title: "Bagels", name: "Bagels" }
    ];
    writeCategories(defaultCategories);
    return defaultCategories;
  } catch (error) {
    console.error('Error reading categories file:', error);
    return [];
  }
};

const writeCategories = (categories) => {
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing categories file:', error);
    return false;
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'QR Website API Server',
    status: 'running',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// QR Code generation endpoint
app.post('/api/qr/generate', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required to generate QR code' });
    }

    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({ 
      success: true,
      qrCode: qrCodeDataURL,
      data: data
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code', message: error.message });
  }
});

// Admin Authentication endpoints

// Admin login
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = readAdmin();
    
    if (!admin) {
      return res.status(500).json({ error: 'Admin configuration not found' });
    }

    if (admin.email === email && admin.password === password) {
      res.json({ 
        success: true, 
        message: 'Login successful',
        user: {
          email: admin.email
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Update admin credentials
app.put('/api/admin/credentials', (req, res) => {
  try {
    const { email, password, currentPassword } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = readAdmin();
    
    if (!admin) {
      return res.status(500).json({ error: 'Admin configuration not found' });
    }

    // Verify current password if provided
    if (currentPassword && admin.password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const updatedAdmin = {
      email: email || admin.email,
      password: password || admin.password
    };

    if (writeAdmin(updatedAdmin)) {
      res.json({ 
        success: true, 
        message: 'Admin credentials updated successfully',
        user: {
          email: updatedAdmin.email
        }
      });
    } else {
      res.status(500).json({ error: 'Failed to update credentials' });
    }
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    res.status(500).json({ error: 'Failed to update credentials', message: error.message });
  }
});

// Categories API endpoints

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = readCategories();
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
});

// Create new category
app.post('/api/categories', (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const categories = readCategories();
    
    // Generate ID from name: lowercase, replace spaces with hyphens, remove special characters
    const id = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (!id) {
      return res.status(400).json({ error: 'Invalid category name' });
    }
    
    // Check if category with same id already exists
    if (categories.find(c => c.id === id)) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    // Use the name for both title and name fields
    const newCategory = { 
      id, 
      title: name.trim(), 
      name: name.trim() 
    };
    categories.push(newCategory);
    
    if (writeCategories(categories)) {
      res.status(201).json({ success: true, category: newCategory });
    } else {
      res.status(500).json({ error: 'Failed to save category' });
    }
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category', message: error.message });
  }
});

// Delete category
app.delete('/api/categories/:id', (req, res) => {
  try {
    const categoryId = req.params.id;
    const categories = readCategories();
    const categoryIndex = categories.findIndex(c => c.id === categoryId);

    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if any products are using this category
    const products = readProducts();
    const productsUsingCategory = products.filter(p => p.category === categoryId);
    
    if (productsUsingCategory.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. ${productsUsingCategory.length} product(s) are using this category.` 
      });
    }

    categories.splice(categoryIndex, 1);
    
    if (writeCategories(categories)) {
      res.json({ success: true, message: 'Category deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category', message: error.message });
  }
});

// Store Settings API endpoints

// Upload store icon
app.post('/api/store/icon', (req, res, next) => {
  console.log('Icon upload request received');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('UPLOADS_DIR:', UPLOADS_DIR);
  console.log('UPLOADS_DIR exists:', fs.existsSync(UPLOADS_DIR));
  
  upload.single('icon')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      console.log('Request file:', req.file);
      console.log('Request body:', req.body);
      
      if (!req.file) {
        console.log('No file in request');
        return res.status(400).json({ error: 'No file uploaded. Please select an image file.' });
      }

      // Verify file was actually saved
      const filePath = path.join(UPLOADS_DIR, req.file.filename);
      console.log('Checking file path:', filePath);
      console.log('File path exists:', fs.existsSync(filePath));
      
      if (!fs.existsSync(filePath)) {
        console.error('File was not saved!');
        console.error('Expected path:', filePath);
        console.error('Uploads directory:', UPLOADS_DIR);
        console.error('Uploads directory exists:', fs.existsSync(UPLOADS_DIR));
        return res.status(500).json({ error: 'File was not saved to server' });
      }

      console.log('File uploaded successfully:', req.file.filename);
      console.log('File path:', filePath);
      console.log('File size:', req.file.size, 'bytes');

      const iconPath = `/uploads/${req.file.filename}`;
      
      // Update store settings with new icon path
      const settings = readStoreSettings();
      if (!settings) {
        // If settings don't exist, delete the uploaded file and return error
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: 'Store settings not found' });
      }

      // Delete old icon if it exists
      if (settings.icon && settings.icon.startsWith('/uploads/')) {
        const oldIconPath = path.join(UPLOADS_DIR, path.basename(settings.icon));
        if (fs.existsSync(oldIconPath)) {
          try {
            fs.unlinkSync(oldIconPath);
            console.log('Old icon deleted:', oldIconPath);
          } catch (err) {
            console.error('Error deleting old icon:', err);
            // Continue even if old icon deletion fails
          }
        }
      }
      
      settings.icon = iconPath;
      if (!writeStoreSettings(settings)) {
        // If settings write fails, delete the uploaded file
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: 'Failed to save icon path to settings' });
      }

      console.log('Icon path saved to settings:', iconPath);

      res.json({ 
        success: true, 
        message: 'Icon uploaded successfully',
        icon: iconPath 
      });
    } catch (error) {
      console.error('Error uploading icon:', error);
      // Try to delete the file if it was uploaded but something else failed
      if (req.file) {
        try {
          const filePath = path.join(UPLOADS_DIR, req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error('Error cleaning up uploaded file:', err);
        }
      }
      res.status(500).json({ error: 'Failed to upload icon', message: error.message });
    }
  });
});

// Error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// Get store settings
app.get('/api/store/settings', (req, res) => {
  try {
    const settings = readStoreSettings();
    if (!settings) {
      return res.status(500).json({ error: 'Failed to load store settings' });
    }
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    res.status(500).json({ error: 'Failed to fetch store settings', message: error.message });
  }
});

// Update store settings
app.put('/api/store/settings', (req, res) => {
  try {
    const settings = req.body;
    
    if (!settings) {
      return res.status(400).json({ error: 'Settings data is required' });
    }

    if (writeStoreSettings(settings)) {
      res.json({ 
        success: true, 
        message: 'Store settings updated successfully',
        settings 
      });
    } else {
      res.status(500).json({ error: 'Failed to update store settings' });
    }
  } catch (error) {
    console.error('Error updating store settings:', error);
    res.status(500).json({ error: 'Failed to update store settings', message: error.message });
  }
});

// Products API endpoints (for bakery store)

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', message: error.message });
  }
});

// Create new product
app.post('/api/products', (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const products = readProducts();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id), 0) + 1 : 1,
      name,
      description,
      price: parseFloat(price),
      image,
      category
    };

    products.push(newProduct);
    
    if (writeProducts(products)) {
      res.status(201).json({ success: true, product: newProduct });
    } else {
      res.status(500).json({ error: 'Failed to save product' });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, description, price, image, category } = req.body;
    products[productIndex] = {
      ...products[productIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: parseFloat(price) }),
      ...(image && { image }),
      ...(category && { category })
    };

    if (writeProducts(products)) {
      res.json({ success: true, product: products[productIndex] });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products.splice(productIndex, 1);
    
    if (writeProducts(products)) {
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product', message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🔲 QR Code API: http://localhost:${PORT}/api/qr/generate`);
});

module.exports = app;
