import Router from 'express'
import { verifyUser } from '../middlewares/UserVerify.js'
import { closeOrder, getAllBids, getAllOrders, getMyOrders, getOrderById, postOrder, selectWinningBid } from '../controllers/order.controller.js'
import { requirePurchaser } from '../middlewares/requirePurchaser.js'


export const OrderRouter=Router()


OrderRouter.route('/postorder').post(verifyUser,requirePurchaser,postOrder)
OrderRouter.route('/getallorders').post(verifyUser,requirePurchaser,getAllOrders)
OrderRouter.route('/getorderbyid/:orderId').post(verifyUser,requirePurchaser,getOrderById)
OrderRouter.route('/getmyorders').post(verifyUser,requirePurchaser,getMyOrders)
OrderRouter.route('/getallbids/:orderId').post(verifyUser,requirePurchaser,getAllBids)
OrderRouter.route('/closeorder/:orderId').post(verifyUser,requirePurchaser,closeOrder)
OrderRouter.route('/selectwinningbid/:orderId/:bidId').post(verifyUser,requirePurchaser,selectWinningBid)






