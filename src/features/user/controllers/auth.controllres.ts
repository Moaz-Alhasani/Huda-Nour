import { NextFunction, Request, Response } from "express";
import { authervices } from "../../../services/db/auth.services";
import { HTTB_STATUS } from "../../../globals/constants/http";
import { BAD_REQUST_EXCEPTION } from "../../../globals/middlware/error.middlware";


class AuthControllers{
    public async registerUser(req:Request,res:Response,next:NextFunction){
        if(await authervices.isEmailAlreadyExist(req.body.email)){
            return next (new BAD_REQUST_EXCEPTION('email already exist'))
        }
        const accessToken =await authervices.addUser(req.body)

        const options={
            MaxAge:process.env.LOGIN_EXPIRES,
            secure:true,
            httpOnly:true
        }
        res.cookie('jwt',accessToken,options)

        res.status(HTTB_STATUS.OK).json({
            message:'User register successfully',
            accessToken
        })
    }

    public async loginUser(req:Request,res:Response,next:NextFunction){
        const accessToken =await authervices.login(req.body)
        const options={
            MaxAge:process.env.LOGIN_EXPIRES,
            secure:true,
            httpOnly:true
        }
        
        res.cookie('jwt',accessToken,options)
        res.status(HTTB_STATUS.OK).json({
            message:'User login successfully',
            accessToken
        })
    }

    public async  forgotPassword(req:Request,res:Response,next:NextFunction){
        await authervices.forgotpassword(req.body.email,req)
        res.status(HTTB_STATUS.OK).json({
            message:'successfully send Otp',
        })
    }

    public async verifyOTP(req:Request,res:Response,next:NextFunction){
        await authervices.vrefiyOTP(req.body,req)
        res.status(HTTB_STATUS.OK).json({
            message:'OTP verified successfully. You can now reset your password.',
        })
    }

    public async Resetpassword(req:Request,res:Response,next:NextFunction){
        await authervices.resetPassword(req.body,req)
        res.status(HTTB_STATUS.OK).json({
            message:'Password has been reset successfully.',
        })
    }
    public async logout(req:Request,res:Response,next:NextFunction){
        const userId=req.currentuser.id
        console.log(userId)
        if(!userId){
            return res.status(HTTB_STATUS.UNAUTHORIZED).json({
                message:"Unauthorized"
            })
        }
        const user=await authervices.getUserUsingID(userId)
        if(!user){
            return res.status(HTTB_STATUS.NOT_FOUND).json({
                message:"User not found"
            })
        }
        res.cookie('jwt', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none' 
        });
        return res.status(HTTB_STATUS.OK).json({
            message:'Your are logout'
        })
    }
    
}
export const authcontrollers:AuthControllers=new AuthControllers();