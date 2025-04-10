import { NextFunction, Request, Response } from "express";
import { admindervices } from "../../../services/db/adminservices";
import { HTTB_STATUS } from "../../../globals/constants/http";
import { authervices } from "../../../services/db/auth.services";
import { BAD_REQUST_EXCEPTION, NOT_FOUND } from "../../../globals/middlware/error.middlware";
import { prisma } from "../../../prisma";
import { expertservices } from "../../../services/db/expertservices";
class AdminControllers{
    public async GetAllUser(req:Request,res:Response,next:NextFunction){
        const Users=await admindervices.GetAllUser()
        return res.status(HTTB_STATUS.OK).json({
            message:"All Users",
            data:Users
        })
    }
    public async GetOneUser(req:Request,res:Response,next:NextFunction){
        console.log(Number(req.params.id))
        const user=await admindervices.GetOneUser(Number(req.params.id))
        return res.status(HTTB_STATUS.OK).json({
            message:"User Found",
            data:user
        })
    }

    public async addUser(req:Request ,res :Response, next:NextFunction){
        if(await authervices.isEmailAlreadyExist(req.body.email)){
             return next (new BAD_REQUST_EXCEPTION('email already exist'))
        }
        await admindervices.adduser(req.body)
        return res.status(HTTB_STATUS.OK).json({
            message:"User Added",
        })
    }

    public async updateUserInfo(req:Request,res:Response,next:NextFunction){
        await admindervices.editUser(req.body,Number(req.params.id))
        return res.status(HTTB_STATUS.OK).json({
            message:"User Added",
        })
    }

    public async deleteUser(req:Request,res:Response,next:NextFunction){
        await admindervices.remove(Number(req.params.id))
        return res.status(HTTB_STATUS.OK).json({
            message:"User Deleted",
        })
    }

    // New Table in database
    public async addPost(req:Request ,res :Response, next:NextFunction){
        const pohto=req.file ?req.file.path:null
        await admindervices.addPost(req.body,req.currentuser,pohto)
        return res.status(HTTB_STATUS.OK).json({
            message:"Post Added",
        })
    }
    public async editpost(req:Request,res:Response,next:NextFunction){
        const pohto=req.file ?req.file.path:null
        const edit =await admindervices.editPost(req.body,pohto,Number(req.params.id))
        return res.status(HTTB_STATUS.OK).json({
            message:"Post edit",
            data:edit
        })
    }
    public async deletePost(req:Request,res:Response,next:NextFunction){
        await admindervices.removePost(Number(req.params.id))
        return res.status(HTTB_STATUS.OK).json({
            message:"Post deleted",
        })
    }
    // New table in Database
    public async acceptExpert(req:Request,res:Response,next:NextFunction){
        await admindervices.approveExpert(Number(req.params.id))
        return res.status(HTTB_STATUS.OK).json({
            message:"Accept Expert",
        })
    }
    public async AllExpert(req:Request,res:Response,next:NextFunction){
        const Experts=await admindervices.getAllExpert()
        return res.status(HTTB_STATUS.OK).json({
            message:"All Experts ",
            data:Experts
        })
    }

    public async ExpertPENDING(req:Request,res:Response,next:NextFunction){
        const Experts=await admindervices.getAllExpertPENDING()
        return res.status(HTTB_STATUS.OK).json({
            message:"Experts All PENDING",
            data:Experts
        })
    }
    public async ExpertAPPROVED(req:Request,res:Response,next:NextFunction){
        const Experts=await admindervices.getAllExpertAPPROVED()
        return res.status(HTTB_STATUS.OK).json({
            message:"Experts All APPROVED",
            data:Experts
        })
    }

    public async ExpertREJECTED(req:Request,res:Response,next:NextFunction){
        const Experts=await admindervices.getAllExpertREJECTED()
        return res.status(HTTB_STATUS.OK).json({
            message:"Experts All REJECTED",
            data:Experts
        })
    }
    public async deleteExpert(req:Request,res:Response,next:NextFunction){
        await admindervices.removeExpert(Number(req.params.id))
        return res.status(HTTB_STATUS.OK).json({
            message:"delete Successfuly",
        })
    }
    public async AddExpertUsingAdmin(req:Request,res:Response,next:NextFunction){
        if(await expertservices.IsEmailAlreadyExist(req.body.email)){
            return next (new BAD_REQUST_EXCEPTION('email already exist'))
        }
        const expert=await admindervices.createExpert(req.body)
        return res.status(HTTB_STATUS.OK).json({
            message:"Add Expert",
            data:expert
        })
    }
}
export const admincontrollers:AdminControllers=new AdminControllers();