const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    apartmentNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    buildingNumber: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    price: { type: Number, required: true },
    squareFootage: { type: Number, required: true },
    amenities: { type: String, default: "" } 
  });

module.exports = mongoose.model('apartment_mang', apartmentSchema, 'apartment_mang');