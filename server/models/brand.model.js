const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  logo: {
    type: String,
    required: [true, 'Brand logo is required']
  },
  image: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['luxury', 'trend', 'sport', 'accessories'],
    default: 'trend'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Brand', brandSchema); 