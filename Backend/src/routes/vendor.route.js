import express from "express";
import {getVendorProfile,purchaseConnect,getVendorDashboard} from "../controllers/vendor.controller.js";
import { verifyUser } from "../middlewares/UserVerify.js";
import { requireVendor } from "../middlewares/requireVendor.js";

const Vendorrouter = express.Router();

Vendorrouter.route("/profile").get(verifyUser,requireVendor,getVendorProfile);
Vendorrouter.route("/dashboard").get(verifyUser,requireVendor,getVendorDashboard);
Vendorrouter.route("/connects/purchase").post(verifyUser,requireVendor,purchaseConnect);



export default Vendorrouter;
