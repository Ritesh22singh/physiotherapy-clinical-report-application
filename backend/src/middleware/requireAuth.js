const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if(!authorization?.startsWith("Bearer ")){
        return res.status(401).json({message: "Authentication required"})
    }

    const token  = authorization.slice("Bearer ".length);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select("_id name email");

        if(!user){
            return res.status(401).json({message: "User no longer exists"})
        }

        req.user = user;
        next(); 
    } catch  {
        return res.status(401).json({message: "Invalid or expire token"})
    }
};

module.exports = requireAuth;