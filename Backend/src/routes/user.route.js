import Router from 'express'
import { getMe, Login, Logout, RegisterUser } from '../controllers/user.controller.js'
import { verifyUser } from '../middlewares/UserVerify.js'


export const UserRouter=Router()


UserRouter.route('/register').post(RegisterUser)
UserRouter.route('/login').post(Login)
UserRouter.route('/logout').post(verifyUser,Logout)
UserRouter.route('/getme').get(verifyUser,getMe)




