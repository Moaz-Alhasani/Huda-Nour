import express from 'express'
import { checkPermission, vrefiyUser } from '../../../globals/middlware/auth.middlware'
import { asyncWapper } from '../../../globals/middlware/error.middlware'
import { admincontrollers } from '../controllers/adminControllers'
import { validateSchema } from '../../../globals/middlware/validate.middlware'
import { AddPostSchema, adminAddUser, AdminupdateInfo, EditPostSchema } from '../schema/adminSchema'
import upload from '../../../globals/constants/mluter'

const adminRouter=express.Router()
adminRouter.get('/',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.GetAllUser))
adminRouter.get('/getuser/:id',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.GetOneUser))
adminRouter.post('/add-user',vrefiyUser,checkPermission('ADMIN'),validateSchema(adminAddUser),asyncWapper(admincontrollers.addUser))
adminRouter.put('/edit/:id',vrefiyUser,checkPermission('ADMIN'),validateSchema(AdminupdateInfo),asyncWapper(admincontrollers.updateUserInfo))
adminRouter.delete('/:id',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.deleteUser))
adminRouter.post('/add-post',vrefiyUser,checkPermission('ADMIN'),upload.single('imageUrl'),validateSchema(AddPostSchema),asyncWapper(admincontrollers.addPost))
adminRouter.put('/edit-post/:id',vrefiyUser,checkPermission('ADMIN'),upload.single('imageUrl'),validateSchema(EditPostSchema),asyncWapper(admincontrollers.editpost))
adminRouter.delete('/delete-post/:id',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.deletePost))
adminRouter.get('/acceptexpert/:id',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.acceptExpert))


adminRouter.get('/all-expert',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.AllExpert))
adminRouter.get('/all-pending',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.ExpertPENDING))
adminRouter.get('/all-approved',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.ExpertAPPROVED))
adminRouter.get('/all-rejected',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.ExpertREJECTED))
adminRouter.delete('/delete-expert/:id',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.deleteExpert))
adminRouter.post('/add-expert',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.AddExpertUsingAdmin))



export default adminRouter