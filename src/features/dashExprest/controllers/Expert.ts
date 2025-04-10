import { NextFunction, Request, Response } from "express";
import { HTTB_STATUS } from "../../../globals/constants/http";
import { BAD_REQUST_EXCEPTION } from "../../../globals/middlware/error.middlware";
import { expertservices } from "../../../services/db/expertservices";
class ExpertControllers{
    public async Register(req:Request,res:Response,next:NextFunction){
        console.log(req.body)
        console.log("Uploaded File:", req.file);    
        if(await expertservices.IsEmailAlreadyExist(req.body.email)){
            return next (new BAD_REQUST_EXCEPTION('email already exist'))
        }
        const pdf=req.file ?req.file.path:null
        const expertToken =await expertservices.addExpert(req.body,pdf)

        const options={
            MaxAge:process.env.LOGIN_EXPIRES,
            secure:true,
            httpOnly:true
        }
        res.cookie('jwt',expertToken,options)

        return res.status(HTTB_STATUS.OK).json({
            message:"Your request is under review .Please wait",
            data:expertToken
        })
    }

    public async Login(req:Request,res:Response,next:NextFunction){
        const expertToken =await expertservices.loginExpert(req.body)

        const options={
            MaxAge:process.env.LOGIN_EXPIRES,
            secure:true,
            httpOnly:true
        }
        res.cookie('jwt',expertToken,options)

        return res.status(HTTB_STATUS.OK).json({
            message:"Login Successfully",
            data:expertToken
        })
    }

    public async logout(req:Request,res:Response,next:NextFunction){
        const expertId=req.currentuser.id
        console.log(expertId)
        if(!expertId){
            return res.status(HTTB_STATUS.UNAUTHORIZED).json({
                message:"Unauthorized"
            })
        }
        const expert=await expertservices.getUserUsingID(expertId)
        if(!expert){
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

    public async writeToJSONFile(req:Request,res:Response,next:NextFunction){
        await expertservices.writeToJSONFile(req.body,req.currentuser)
        return res.status(HTTB_STATUS.OK).json({
            message:'Your are write now'
        })
    }

}
export const expertcontrollers:ExpertControllers=new ExpertControllers();