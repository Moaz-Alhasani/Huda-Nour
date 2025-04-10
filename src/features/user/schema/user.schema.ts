import joi from 'joi'

export const userschemaCreate=joi.object({
    email:joi.string().required(),
    password:joi.string().required(),
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    role:joi.string().optional(),
    profilePic:joi.optional()
})

export const userschemalogin=joi.object({
    email:joi.string().required(),
    password:joi.string().required(),
})

export const userschemaresetpassword=joi.object({
    newPassword:joi.string().required()
})