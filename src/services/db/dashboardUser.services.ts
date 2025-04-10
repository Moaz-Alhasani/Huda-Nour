import { NOT_FOUND } from "../../globals/middlware/error.middlware";
import { prisma } from "../../prisma";
import bcrypt from 'bcrypt'

class DashBoardUserServices{
    public async editInfo(requsetBody:any,CurrentUser:any){
        const userId=CurrentUser.id;
        const{firstName,lastName,email,password}=requsetBody;

        const user=await this.getUserUsingID(userId)
        if(!user){
            return new NOT_FOUND("User Not Found")
        }

        const updatedData: any = {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,    
        };

        if (password){
            updatedData.password=await bcrypt.hash(password,10)
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData
        });
        
    }
    public async editPhoto(newPhotoUrl: string | null , CurrentUser:any){
        const userId=CurrentUser.id
        const user=await this.getUserUsingID(userId)
        if (!user) {
            throw new NOT_FOUND("User Not Found");
        }
        if (!newPhotoUrl) {
            throw new NOT_FOUND("Photo Not Found");
        }
        const updatedUser=await prisma.user.update({
            where:{id:userId},
            data:{profilePic:newPhotoUrl}
        })
    }

    public async removePhoto(CurrentUser:any){
        const defaultPhoto ='../image/default-avatar-icon-of-social-media-user-vector.jpg'
        const userId=CurrentUser.id
        const user=await this.getUserUsingID(userId)
        if (!user) {
            throw new NOT_FOUND("User Not Found");
        }
        await prisma.user.update({
            where: { id: userId },
            data: { profilePic: defaultPhoto }
        });
    }

    public async getUserUsingID(id_user:number){
        return await prisma.user.findFirst({
            where:{
                id:id_user
            }
        })
    }
}
export const dashboarduserservices:DashBoardUserServices=new DashBoardUserServices();