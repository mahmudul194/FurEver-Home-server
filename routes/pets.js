const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const AdoptionRequest = require('../models/AdoptionRequest');
const { protect } = require('../middleware/auth');

// @desc    Get all pets (with search, filter, and sort)
// @route   GET /api/pets
// @access  Public
router.get('/', async (req, res) => {
  try {
    const query = {};

    // 1. Search by name using $regex
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // 2. Filter by species using $in
    if (req.query.species && req.query.species !== 'all') {
      const speciesList = req.query.species.split(',').map(s => s.trim().toLowerCase());
      query.species = { $in: speciesList };
    }

    // 3. Optional status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Sorting setup
    let sortBy = {};
    if (req.query.sort) {
      if (req.query.sort === 'feeAsc') {
        sortBy.adoptionFee = 1;
      } else if (req.query.sort === 'feeDesc') {
        sortBy.adoptionFee = -1;
      } else if (req.query.sort === 'newest') {
        sortBy.createdAt = -1;
      } else if (req.query.sort === 'oldest') {
        sortBy.createdAt = 1;
      }
    } else {
      sortBy.createdAt = -1; // default newest first
    }

    const pets = await Pet.find(query).sort(sortBy);
    res.status(200).json({ success: true, count: pets.length, data: pets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private (as Details is a Private Route)
router.get('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create pet listing
// @route   POST /api/pets
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      image,
      healthStatus,
      vaccinationStatus,
      location,
      adoptionFee,
      description,
    } = req.body;

    // Validation
    if (
      !name ||
      !species ||
      !breed ||
      !age ||
      !gender ||
      !image ||
      !healthStatus ||
      !vaccinationStatus ||
      !location ||
      adoptionFee === undefined ||
      !description
    ) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const pet = await Pet.create({
      name,
      species,
      breed,
      age,
      gender,
      image,
      healthStatus,
      vaccinationStatus,
      location,
      adoptionFee,
      description,
      ownerEmail: req.user.email, // Auto-filled and read-only
      status: 'available',
    });

    res.status(201).json({ success: true, message: 'Pet added successfully', data: pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update pet listing
// @route   PUT /api/pets/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Verify ownership
    if (pet.ownerEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this pet' });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Pet updated successfully', data: pet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete pet listing
// @route   DELETE /api/pets/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Verify ownership
    if (pet.ownerEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this pet' });
    }

    // Delete associated adoption requests
    await AdoptionRequest.deleteMany({ petId: req.params.id });

    // Delete pet
    await Pet.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Pet and associated requests deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
