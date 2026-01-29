import ApiError from "../utils/ApiError";
import { asynchandler } from "../utils/AsyncHandler";



export const requireVendor=asynchandler(async(req,res,next)=>{

    const cookieData=req.cookies?.accessToken || req.header('Authentication')?.replace("Bearer ","")

    if(cookieData.role=="purchaser"){
        return new ApiError(400,"UnAuthorized Access !!")
    }
    next();
})