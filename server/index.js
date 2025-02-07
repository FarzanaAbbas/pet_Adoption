// Backend: Node.js with Express
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const cors = require('cors');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "https://pet-adoption-frontend-eyfb.onrender.com", // Your frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
}).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: 'dturagatk',
//   api_key: '465552111156457',
//   api_secret: 'nOw-SGhkUfKrqPIvQ8UD7VdHZEA',
// });


// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'pets',
//     allowed_formats: ['jpg', 'png'],
//   },
// });
// const upload = multer({ storage });

// Schemas
const PetSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  gender: String,
  location: String,
  photo: String, // Cloudinary photo URL
  status: { type: String, default: "Available" }, // New field
});

const Pet = mongoose.model("Pet", PetSchema);

const ApplicationSchema = new mongoose.Schema({
  petId: mongoose.Schema.Types.ObjectId,
  adopterName: String,
  email: String,
  status: { type: String, default: "Pending" },
});
const Application = mongoose.model("Application", ApplicationSchema);

// Routes
// Handle adoption request
app.post("/pets/:id/adopt", async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Example: Mark pet as adopted
    pet.status = "Adopted"; // Add a `status` field in your schema if it doesn't exist
    await pet.save();

    res.json({ message: "Adoption request submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all pets with optional filters
app.get("/pets", async (req, res) => {
  try {
    const filters = req.query;
    const pets = await Pet.find(filters);
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Case 2: Filtering by Location
// 🔹 Request:

// GET http://localhost:3000/pets?location=New York
// 🔹 req.query becomes:

// { location: "New York" }
// 🔹 Effect:

// Pet.find({ location: "New York" }) fetches only pets from New York.



// Get a single pet by ID
app.get("/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new pet (POST /pets)
app.post("/pets", async (req, res) => {
  try {
    const { name, breed, age, gender, location, photo } = req.body;
    const newPet = new Pet({ name, breed, age, gender, location, photo });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit an application for adoption
app.post("/applications", async (req, res) => {
  try {
    const { petId, adopterName, email } = req.body;

    // Save the a doption application
    const application = new Application(req.body);
    await application.save();

    // Update pet's status
    await Pet.findByIdAndUpdate(petId, { status: "Adopted" });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Get an application by ID
// app.get("/applications/:id", async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id);
//     if (!application) return res.status(404).json({ message: "Application not found" });
//     res.json(application);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

