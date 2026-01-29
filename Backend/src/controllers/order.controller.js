import { asynchandler } from "../utils/AsyncHandler";

export const postOrder=asynchandler(async(req,res)=>{

})

export const getAllOrders=asynchandler(async(req,res)=>{

})

export const getOrderById=asynchandler(async(req,res)=>{

})

export const updateOrder=asynchandler(async(req,res)=>{

})

export const getMyOrders = asynchandler(async (req, res) => {})
// purchaser sees only their orders

export const closeOrder = asynchandler(async (req, res) => {})
// stop accepting bids

export const deleteOrder = asynchandler(async (req, res) => {})
// only if no bid accepted

export const selectWinningBid = asynchandler(async (req, res) => {})
// purchaser selects vendor



