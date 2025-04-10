import { Expert } from "@prisma/client";
import { prisma } from "../../prisma";
import bcrypt from 'bcrypt'
import JWT from'jsonwebtoken'
import { promises as fs } from 'fs';
import * as path from 'path';

import { BAD_REQUST_EXCEPTION } from "../../globals/middlware/error.middlware";
class ExpertServices{
    public async addExpert(requsetBody:any,PdfUrl: string |null ){
        const{name,email,password}=requsetBody
        const hashpassword=await bcrypt.hash(password,10)
        const newExpert=await prisma.expert.create({
            data:{
                name:name,
                email:email,
                password:hashpassword,
                profileFilePath: PdfUrl ??""
            }
        })
        const payload={name,email,password,role:newExpert.role,id:newExpert.id}
        const accessToken:string=await this.generateJWT(payload);
        return accessToken
    }

    public async loginExpert(requestBody: any) {
        const { email, password } = requestBody; 
        const expert = await this.getUserByEmail(email);
        if (!expert) { 
            throw new BAD_REQUST_EXCEPTION("Invalid Credentials Email NOt found");
        }
        const isMatchPassword: boolean = await bcrypt.compare(password, expert.password);
        if (!isMatchPassword) {
            throw new BAD_REQUST_EXCEPTION("Password Invalid Credentials");
        }
        const payload = {
            email,
            name: expert.name,
            role: expert.role,
            id: expert.id
        };
        const accessToken: string = await this.generateJWT(payload);
        return accessToken; 
    }

    public async writeToJSONFile(requestBody: any, CurrentUser:any): Promise<void> {
        const { main_topic, sub_topic, surah, ayah, tafsir } = requestBody;
    

        const folderPath = path.join(__dirname, 'jsonfile');
        const filePath = path.join(folderPath, `expert_${CurrentUser.name}.json`);
    
        try {

            await fs.mkdir(folderPath, { recursive: true });
            console.log("✅ Folder ensured:", folderPath);
    
            try {
                await fs.access(filePath);
            } catch {
                console.log("✅ Creating new JSON file:", filePath);
                await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
            }

            const fileContent = await fs.readFile(filePath, 'utf-8');
            let data: any[] = [];
    
            try {
                data = JSON.parse(fileContent);
            } catch (parseError) {
                console.error("❌ Error parsing JSON file: ", parseError);
            }
            data.push({ main_topic, sub_topic, surah, ayah, tafsir });
    

            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
            console.log("✅ Data written successfully to:", filePath);
        } catch (error) {
            console.error("❌ Error processing JSON file: ", error);
        }
    }



    
    private async generateJWT(payload:any){
        return JWT.sign(payload,process.env.JWT_SECRET!,{expiresIn:'1d'})
    }

    public async IsEmailAlreadyExist(email:string){
        const expert=await prisma.expert.findFirst({
            where:{email:email}
        })
        return expert !=null
    }

    private async getUserByEmail(email:string){
        return await prisma.expert.findFirst({
            where:{
                email
            }
        })
    } 

    public async getUserUsingID(id_expert:number){
        return await prisma.expert.findFirst({
            where:{
                id:id_expert
            }
        })
    }

}
export const expertservices:ExpertServices=new ExpertServices();