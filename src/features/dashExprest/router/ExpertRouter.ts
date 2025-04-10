import express from'express'
import { validateSchema } from '../../../globals/middlware/validate.middlware'
import { expertchemaCreate, loginschemaCreate } from '../schema/expertSchema'
import { asyncWapper } from '../../../globals/middlware/error.middlware'
import { expertcontrollers } from '../controllers/Expert'
import uploadpdf from '../../../globals/constants/multerPdf'
import { checkPermission, isApprovedExpert, vrefiyUser } from '../../../globals/middlware/auth.middlware'
const ExpertRouter=express.Router()

ExpertRouter.post('/register-expert',uploadpdf.single('profileFilePath'),validateSchema(expertchemaCreate),asyncWapper(expertcontrollers.Register))
ExpertRouter.post('/login-expert',validateSchema(loginschemaCreate),asyncWapper(expertcontrollers.Login))
ExpertRouter.post('/logout',vrefiyUser,asyncWapper(expertcontrollers.logout))
ExpertRouter.post('/writetojson',vrefiyUser,isApprovedExpert,asyncWapper(expertcontrollers.writeToJSONFile))


export default ExpertRouter