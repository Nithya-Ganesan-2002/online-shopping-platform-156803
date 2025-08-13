const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, index: true },
    brand: { type: String, default: '' },
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
