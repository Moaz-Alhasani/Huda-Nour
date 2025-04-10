import { User } from '@prisma/client';
import bcrypt from 'bcrypt'
import { prisma } from '../../prisma';
import JWT from'jsonwebtoken'
import { BAD_REQUST_EXCEPTION, CustomError, forbiddenExcption, NOT_FOUND } from '../../globals/middlware/error.middlware';
import { generateOtp } from '../../globals/constants/generateOtp';
import { SendEmail } from '../../globals/constants/SendEmail';
import { HTTB_STATUS } from '../../globals/constants/http';

class AuthServices{
    public async addUser(requsetBody:any){
        const{firstName,lastName,email,password,role}=requsetBody;
        const hashpassword:string=await bcrypt.hash(password,10)
        const newUser:User=await prisma.user.create({
            data:{
                email,
                password:hashpassword,
                firstName,
                lastName,
                role
            }
        })
        const payload={email,firstName,lastName,role:newUser.role,id:newUser.id}
        const accessToken:string=await this.generateJWT(payload);
        return accessToken
    }

    public async login(requestBody: any) {
        const { email, password } = requestBody; 
        const user: User | null = await this.getUserByEmail(email);
        if (!user) { 
            throw new BAD_REQUST_EXCEPTION("Invalid Credentials");
        }

        const isMatchPassword: boolean = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            throw new BAD_REQUST_EXCEPTION("Password Invalid Credentials");
        }

        const payload = {
            email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            id: user.id
        };
    
        const accessToken: string = await this.generateJWT(payload);
        return accessToken; 
    }

    public async forgotpassword(requestBody:any, req:any){
        const {email}=requestBody
        const user=await this.getUserByEmail(email)
        if(!user){
            throw new NOT_FOUND('We could not find the user with the given email')
        }
        req.app.locals.OTP=generateOtp()
        req.app.locals.user_id=user.id
        const otp=req.app.locals.OTP
        console.log(otp)
        const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/user/resetpassword`
        const message=`We have recived a password rest request .Please only use the below link to rest your password ${otp} \n\n${resetUrl}\n\n This reset password link willbe valid only for 10 minutes`
        try{
            await SendEmail({
                email:user.email,
                subject:'Password change requset received',
                message:message
            })
        }
        catch(error){
            return new NOT_FOUND('There was an error sending password reset email . please try again later')
        }
    }

    public async vrefiyOTP (requestBody:any ,req:any){
        const {otp}=requestBody
        if(req.app.locals.OTP==otp){
            const userid=req.app.locals.user_id

            const user=await this.getUserUsingID(userid)
            if(!user){
                throw new NOT_FOUND("User Not Found")
            }
            req.app.locals.OTP=null
            req.app.locals.resetSession = true;
        }
        else {
            throw new forbiddenExcption("Invalid OTP , please try again")
        }
    }

    public async resetPassword(requestBody:any,req:any){
        const{newPassword}=requestBody
        const userid=req.app.locals.user_id
        const user=await this.getUserUsingID(userid)
        if(!user){
            throw new NOT_FOUND("User Not Found")
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword,salt);
        const updatedUser = await prisma.user.update({
            where: {
                id:userid,
            },
            data: {
                password: hashedPassword,
            },
        });
        req.app.locals.resetSession = false;
        req.app.locals.user_id=null
    }


    private async getUserByEmail(email:string){
        return await prisma.user.findFirst({
            where:{
                email
            }
        })
    }
    
    private async generateJWT(payload:any){
        return JWT.sign(payload,process.env.JWT_SECRET!,{expiresIn:'1d'})
    }
    
    public async isEmailAlreadyExist(email:string){
        const userByEmail=await prisma.user.findFirst({
            where:{
                email
            }
        })
        return userByEmail !=null
    }

    public async getUserUsingID(id_user:number){
        return await prisma.user.findFirst({
            where:{
                id:id_user
            }
        })
    }
}

export const authervices:AuthServices=new AuthServices();
