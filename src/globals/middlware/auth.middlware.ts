    import { Request,Response,NextFunction } from "express";
    import { UNAUTHORIZED_Exception,  forbiddenExcption} from "./error.middlware";
    import jwt from "jsonwebtoken";
    import { USERPAYLOAD } from "../../type";
    import { string } from "joi";
    import { prisma } from "../../prisma";

    export function vrefiyUser(req:Request,res:Response,next:NextFunction){
        if (!req.headers['authorization'] || !req.headers['authorization'].startsWith('Bearer')){
            throw new UNAUTHORIZED_Exception('Token is invlaid , please login agin')
        }
        const token=req.headers['authorization'].split(' ')[1]
        try{
            const userDecoded=jwt.verify(token,process.env.JWT_SECRET!) as USERPAYLOAD
            req.currentuser=userDecoded
            next();
        }
        catch(error){
            throw new UNAUTHORIZED_Exception('Token is invlaid , please login agin')
        }
    }

    export const checkPermission = (...roles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const userRole = req.currentuser?.role;
            if (!userRole || !roles.includes(userRole)) {
                throw new forbiddenExcption ('YOU ARE NOT ALLOWED');
            }
            next();
        }
    };


    export const isApprovedExpert = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const expertId = req.currentuser?.id;
            console.log(expertId)
            if (!expertId) {
                return res.status(401).json({ message: "Unauthorized: No user ID provided" });
            }
            const expert = await prisma.expert.findUnique({
                where: { id:  expertId},
            });

            if (!expert || expert.role !== "EXPERT" || expert.status !== "APPROVED") {
                return res.status(403).json({ message: "Access denied: You are not an approved expert" });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };