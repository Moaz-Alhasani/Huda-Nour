    import { SendEmail } from "../../globals/constants/SendEmail";
    import { BAD_REQUST_EXCEPTION, NOT_FOUND } from "../../globals/middlware/error.middlware";
    import { prisma } from "../../prisma";
    import bcrypt from 'bcrypt'

    class AdminServices{
        public async GetAllUser() {
            return await prisma.user.findMany();
        }
        
        public async GetOneUser(userId:number){
            const user=await prisma.user.findFirst({
                where:{
                    id:userId
                }
            })
            if(!user){
                throw new NOT_FOUND("User not Found") 
            }
            return user
        }
        
        public async adduser(requsetBody:any){
            const{firstName,lastName,email,password,role}=requsetBody;
            const hashpassword=await bcrypt.hash(password,10)
            const newUser=await prisma.user.create({
                data:{
                    firstName,
                    lastName,
                    email,
                    password:hashpassword,
                    role
                }
            })
        }
        public async editUser(requsetBody:any,userId:number){
            const{firstName,lastName,email,password}=requsetBody
            const user=await this.getUserUsingID(userId)
            if(!user){
                throw new NOT_FOUND("User not found")
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

        public async remove(userId:number){
            const user=await this.getUserUsingID(userId)
            if(!user){
                throw new NOT_FOUND("User not found")
            }
            await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
        }
        public async addPost(requsetBody:any,Currentuser:any,newPhotoUrl: string | null){
            const {title,content}=requsetBody
            const post=await prisma.post.create({
                data:{
                    title,
                    content,
                    imageUrl:newPhotoUrl || null,
                    authorId:Currentuser.id
                }
            })
        }

        public async editPost(requsetBody:any,newPhotoUrl:string |null,postId:number){
            const{title,content}=requsetBody
            const Post=await prisma.post.findFirst({where:{id:postId}})
            if(!Post){
                throw new NOT_FOUND("Post Not found")
            }
            const newupdate:any={
                title:title || Post?.title,
                content:content || Post?.content,
            }
            if(newPhotoUrl !=null){
                newupdate.imageUrl=newPhotoUrl
            }
            const edit=await prisma.post.update({
                where:{id:postId},
                data:newupdate
            })
            return edit
        }


        public async removePost(postId:number){
            const Post=await prisma.post.findFirst({where:{id:postId}})
            if(!Post){
                throw new NOT_FOUND("Post Not found")
            }
            await prisma.post.delete({
                where:{id:postId}
            })
        }


        public async approveExpert(expertId:number){
            const Expert=await prisma.expert.findFirst({where:{id:expertId}})
            if(!Expert){
                throw new NOT_FOUND("Expert Not found")
            }
            const message="السلام عليكم ورحمة الله وبركاته،يسعدنا إبلاغكم بأنه قد تمت الموافقة على طلبكم للانضمام إلى فريق الخبراء والمساهمة في تطوير منهجية البحث الدلالي في القرآن الكريم.نقدّر اهتمامكم وحرصكم على فصل الآيات القرآنية إلى موضوعات محددة مثل الزكاة، والصلاة، وغيرها، مما يسهم في تسهيل البحث والاستفادة من النصوص القرآنية بشكل أكثر تنظيمًا ودقة.نشكر لكم جهودكم ونتطلع إلى رؤيتكم تساهمون في إثراء هذا المشروع المبارك.مع أطيب التحيات،فريق الإدارة"
            const expertacc=await prisma.expert.update({
                where: { id: expertId },
                data: {
                    status: 'APPROVED',
                    approvedAt: new Date(),
                },
            });
            try{
                await SendEmail({
                    email:Expert.email,
                    subject:'تم الموافقة على الطلب ',
                    message:message
                })
            }
            catch(error){
                return new NOT_FOUND('There was an error')
            }
        }

        public async getAllExpert(){
            return prisma.expert.findMany({});
        }

        public async getAllExpertPENDING() {
            return prisma.expert.findMany({
                where: { status: 'PENDING' },
            });
        }

        public async getAllExpertAPPROVED() {
            return prisma.expert.findMany({
                where: { status: 'APPROVED' },
            });
        }

        public async getAllExpertREJECTED() {
            return prisma.expert.findMany({
                where: { status: 'REJECTED' },
            });
        }


        public async removeExpert(expertId:number){
            if(! await this.getExpertUsingID(expertId)){
                throw new NOT_FOUND("Expert Not found")
            }
            await prisma.expert.delete({
                where:{id:expertId}
            })
        }

        public async createExpert(requsetBody:any){
            const {name,email,password}=requsetBody
            const hashpassword=await bcrypt.hash(password,10)
            const newExpert=await prisma.expert.create({
                data:{
                    name:name,
                    email:email,
                    password:hashpassword,
                    status:"APPROVED",
                    profileFilePath:""
                }
            })
            return newExpert
        }

        private async getUserUsingID(id_user: number) {
            return await prisma.user.findFirst({
                where: {
                    id: id_user
                }
            });
        }
        private async getExpertUsingID(id_expert:number){
            return await prisma.expert.findFirst({
                where:{
                    id:id_expert
                }
            })
        }
    }
    export const admindervices:AdminServices=new AdminServices ();