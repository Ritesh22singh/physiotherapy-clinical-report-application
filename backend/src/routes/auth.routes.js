const requireAuth = require("../middleware/requireAuth")
const express = require("express");

const router = express.Router();

const { register, login } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);

router.get("/me", requireAuth, (req, res) => {
    res.json({
        user:{
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
    });
});

module.exports = router;