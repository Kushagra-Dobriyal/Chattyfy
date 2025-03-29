import express from "express";
import {signup,login,logout,updateProfile,checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").post(logout);


router.put("/update-profile",protectRoute,updateProfile);


router.get("/check",protectRoute,checkAuth);
//this route is made when the user will refresh the page it will check whether the user is authenticated or not

export default router;
