import express from'express'

import { validateSchema } from '../../../globals/middlware/validate.middlware';
import { userschemaCreate, userschemalogin, userschemaresetpassword } from '../schema/user.schema';
import { asyncWapper } from '../../../globals/middlware/error.middlware';
import { authcontrollers } from '../controllers/auth.controllres';
import { vrefiyUser } from '../../../globals/middlware/auth.middlware';

const authRouter=express.Router();

authRouter.post('/register',validateSchema(userschemaCreate),asyncWapper(authcontrollers.registerUser))
authRouter.post('/login',validateSchema(userschemalogin),asyncWapper(authcontrollers.loginUser))
authRouter.post('/forgotpassword',asyncWapper(authcontrollers.forgotPassword))
authRouter.post('/vrefiyotp',asyncWapper(authcontrollers.verifyOTP))
authRouter.put('/resetpassword',validateSchema(userschemaresetpassword),asyncWapper(authcontrollers.Resetpassword))
authRouter.post('/logout',vrefiyUser,asyncWapper(authcontrollers.logout))

export default authRouter