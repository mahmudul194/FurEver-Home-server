const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      lowercase: true,
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
    },
    age: {
      type: String,
      required: [true, 'Age is required'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Unknown'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    healthStatus: {
      type: String,
      required: [true, 'Health status is required'],
    },
    vaccinationStatus: {
      type: String,
      required: [true, 'Vaccination status is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    adoptionFee: {
      type: Number,
      required: [true, 'Adoption fee is required'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required'],
    },
    status: {
      type: String,
      enum: ['available', 'adopted'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pet', petSchema);
