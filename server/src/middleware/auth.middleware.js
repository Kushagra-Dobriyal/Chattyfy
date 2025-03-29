import jwt from "jsonwebtoken";
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(400).json({
                message: "Unautherised - Access Denied!!"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(400).json({
                message: "Unautherised - Invalid Token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password");  //There was a mistake 

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in auth-middleware",error.message);
         res.status(500).json({
            message:"Internal server error"
        })
    }
}
