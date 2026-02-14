import express from "express";
import {postBid,getMyBids} from "../controllers/bid.controller.js";
import { verifyUser } from '../middlewares/UserVerify.js'
import { requireVendor } from "../middlewares/requireVendor.js";

const Bidrouter = express.Router();
Bidrouter.route("/postbid/:orderId").post(verifyUser, requireVendor, postBid)
Bidrouter.route("/mybids").get(verifyUser, requireVendor, getMyBids)


export default Bidrouter;
