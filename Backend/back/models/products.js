// models/Medicine.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: String,
  productDescription: String,
  productPrice: Number,
  productImage: String,
  symptoms: [String],
});

ProductSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Medicine', ProductSchema);





