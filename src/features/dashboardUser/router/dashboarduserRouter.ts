import express from'express'
import { validateSchema } from '../../../globals/middlware/validate.middlware';
import { asyncWapper } from '../../../globals/middlware/error.middlware';
import { dashboarduserconrollers } from '../controllers/dashboarduserconrollers';
import { updateInfo } from '../schema/dashboarduserSchema';
import { vrefiyUser } from '../../../globals/middlware/auth.middlware';
import upload from '../../../globals/constants/mluter';
const dashboarduserRouter=express.Router();

dashboarduserRouter.put('/edit',vrefiyUser,validateSchema(updateInfo),asyncWapper(dashboarduserconrollers.updateInfo))
dashboarduserRouter.put('/photoedit',vrefiyUser,upload.single('profilePic'),asyncWapper(dashboarduserconrollers.updateImage))
dashboarduserRouter.get('/photodelete',vrefiyUser,asyncWapper(dashboarduserconrollers.deleteImage))

export default dashboarduserRouter