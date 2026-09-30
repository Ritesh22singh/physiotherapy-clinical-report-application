const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createPatient, listPatients, getPatient } = require("../controllers/patient.controller");

const router = express.Router();

router.get("/", requireAuth, listPatients);
router.get("/:id", requireAuth, getPatient);
router.post("/", requireAuth, createPatient);

module.exports = router;