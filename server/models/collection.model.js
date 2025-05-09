const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Collection title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Collection description is required']
  },
  image: {
    type: String,
    required: [true, 'Collection image is required'],
    default: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  bgClass: {
    type: String,
    default: 'bg-gradient-to-r from-indigo-600 to-purple-700'
  },
  accentClass: {
    type: String,
    default: 'text-yellow-300'
  },
  buttonClass: {
    type: String,
    default: 'bg-white text-indigo-700 hover:bg-yellow-300 hover:text-indigo-800'
  },
  hashtag: {
    type: String,
    default: 'NewCollection'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  productCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Collection', collectionSchema); 