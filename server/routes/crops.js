import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Crop from '../models/Crop.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'crop-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all available crops
router.get('/', async (req, res) => {
  try {
    const { search, category, sort = 'createdAt' } = req.query;
    let query = { isAvailable: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    const crops = await Crop.find(query)
      .populate('farmer', 'name email phone')
      .sort({ [sort]: -1 });

    res.json({ crops });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single crop by ID
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farmer', 'name email phone address');

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    res.json({ crop });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get farmer's crops
router.get('/farmer/my-crops', auth, authorize('farmer'), async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ crops });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new crop listing
router.post('/', auth, authorize('farmer'), upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, quantity, unit, price, harvestDate, expiryDate } = req.body;

    const crop = new Crop({
      name,
      description,
      category,
      quantity: Number(quantity),
      unit,
      price: Number(price),
      farmer: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined
    });

    await crop.save();
    await crop.populate('farmer', 'name email phone');

    res.status(201).json({
      message: 'Crop listed successfully',
      crop
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update crop
router.put('/:id', auth, authorize('farmer'), upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, quantity, unit, price, harvestDate, expiryDate } = req.body;

    const crop = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found or unauthorized' });
    }

    // Update fields
    crop.name = name || crop.name;
    crop.description = description || crop.description;
    crop.category = category || crop.category;
    crop.quantity = quantity ? Number(quantity) : crop.quantity;
    crop.unit = unit || crop.unit;
    crop.price = price ? Number(price) : crop.price;
    crop.harvestDate = harvestDate ? new Date(harvestDate) : crop.harvestDate;
    crop.expiryDate = expiryDate ? new Date(expiryDate) : crop.expiryDate;

    if (req.file) {
      crop.image = `/uploads/${req.file.filename}`;
    }

    await crop.save();
    await crop.populate('farmer', 'name email phone');

    res.json({
      message: 'Crop updated successfully',
      crop
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete crop
router.delete('/:id', auth, authorize('farmer'), async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found or unauthorized' });
    }

    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Buy crop (for buyers)
router.post('/:id/buy', auth, authorize('buyer'), async (req, res) => {
  try {
    const { quantity } = req.body;
    const crop = await Crop.findById(req.params.id);

    if (!crop || !crop.isAvailable) {
      return res.status(404).json({ message: 'Crop not available' });
    }

    if (quantity > crop.quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    // Update crop quantity
    crop.quantity -= quantity;
    if (crop.quantity === 0) {
      crop.isAvailable = false;
    }

    await crop.save();

    res.json({
      message: 'Purchase successful',
      remainingQuantity: crop.quantity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;