const Patient = require("../models/Patient");
const mongoose = require("mongoose");

const createPatient = async (req, res) => {
    try {
        const {name, phone, dateOfBirth} = req.body;

        if(typeof name !== "string" || !name.trim()){
            return res.status(400).json({message: "Patient name is required"})
        }

        if(phone !== undefined && typeof phone !== "string"){
            return res.status(400).json({message: "Phone must be text"})
        }

        if(
            dateOfBirth !== undefined && 
            (typeof dateOfBirth !== "string" ||
                Number.isNaN(Date.parse(dateOfBirth))
            )
        ){
            return res.status(400).json({message: "Invalid Date of Birth"})
        }

        const patient = await Patient.create({
            name: name.trim(),
            phone: phone?.trim(),
            dateOfBirth,
            createdBy: req.user._id,
        })

        return res.status(201).json({patient})

    } catch (error) {
        console.error("Could not create patient", error);
        return res.status(500).json({message: "Could not create patient"})
        
    }
};

const listPatients = async (req, res) => {
    try {
        const patients = await Patient.find({
            createdBy: req.user._id,
        
        }).sort({createdAt: -1});

        return res.json({patients})
    } catch (error) {
        console.error("Could not list patients", error);
        return res.status(500).json({message: "Could not lsit patients"})
    }
}

const getPatient = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const patient = await Patient.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.json({ patient });
  } catch (error) {
    console.error("Could not get patient", error);
    return res.status(500).json({ message: "Could not get patient" });
  }
};


module.exports = {createPatient, listPatients, getPatient}