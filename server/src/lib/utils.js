import jwt from "jsonwebtoken";

 export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*10000 ,//in ms
        httpOnly:true,  //prevents  XSS attacks cross site scripting attacks done by injecting malicios js
        sameSite:"strict", //CSRF attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV!=="development"//while developing it will work as http as we are using localhost but during deployemnt thsi will become https... 
    })

    return token;

};