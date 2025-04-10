import { NextFunction, Request, Response } from "express";
import { dashboarduserservices } from "../../../services/db/dashboardUser.services";
import { HTTB_STATUS } from "../../../globals/constants/http";

class DashBoardUserConrollers{
    public async updateInfo(req:Request,res:Response,next:NextFunction){
        const user=await dashboarduserservices.editInfo(req.body,req.currentuser)
        res.status(HTTB_STATUS.OK).json({
            message:'User Update Successfully',
        })
    }
    
    public async updateImage(req:Request,res:Response,next:NextFunction){
        const pohto=req.file ?req.file.path:null
        console.log(pohto)
        const updatepic=await dashboarduserservices.editPhoto(pohto,req.currentuser)
        res.status(HTTB_STATUS.OK).json({
            message:'User Update photo Successfully',
        })
    }

    public async deleteImage(req:Request,res:Response,next:NextFunction){
        await dashboarduserservices.removePhoto(req.currentuser)
        res.status(HTTB_STATUS.OK).json({
            message: "Profile picture removed successfully",
        });
    }
}

export const dashboarduserconrollers:DashBoardUserConrollers=new DashBoardUserConrollers();