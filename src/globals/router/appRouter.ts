import express, { Application } from 'express'
import authRouter from '../../features/user/router/user.Router'
import dashboarduserRouter from '../../features/dashboardUser/router/dashboarduserRouter'
import adminRouter from '../../features/dashboardAdmin/router/adminRouter'
import ExpertRouter from '../../features/dashExprest/router/ExpertRouter'

const appRouter=(app:Application)=>{
    app.use('/api/v1/user',authRouter),
    app.use('/api/v1/manageprofile',dashboarduserRouter),
    app.use('/api/v1/admin',adminRouter),
    app.use('/api/v1/expert',ExpertRouter)
}
export default appRouter